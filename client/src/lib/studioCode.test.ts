import assert from "node:assert/strict";
import { test } from "node:test";
import { parseColorInput, parseStudioCode, type RGB } from "./colorUtils";
import { createStudioCode } from "./paletteDownload";

const colors: RGB[] = [{ r: 255, g: 0, b: 170 }, { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }];
const pairings = [
  { foreground: "#ff00aa", background: "#000000" },
  { foreground: "#000000", background: "#ff00aa" },
];

test("full palette Studio Code restores every color in order", () => {
  const code = createStudioCode(colors);
  assert.deepEqual(parseColorInput(code), ["#ff00aa", "#000000", "#ffffff"]);
  assert.deepEqual(parseStudioCode(code), { colors: ["#ff00aa", "#000000", "#ffffff"] });
});

test("selected-pair Studio Code preserves both foreground/background directions", () => {
  const code = createStudioCode(colors.slice(0, 2), pairings);
  assert.deepEqual(parseStudioCode(code), { colors: ["#ff00aa", "#000000"], pairings });
  assert.doesNotMatch(decodeURIComponent(code), /wcag|passes|ratio|approved|fail/i);
});

test("full Studio Code URLs import as well as short codes", () => {
  const query = createStudioCode(colors, pairings).replace("studiocode?", "");
  assert.deepEqual(parseStudioCode(`https://thecolorpalettestudio.com/studiocode?${query}`), {
    colors: ["#ff00aa", "#000000", "#ffffff"], pairings,
  });
});

test("previous encoded JSON exports still import", () => {
  const data = { colorNames: ["Color 1", "Color 2"], colors: ["#ff00aa", "#000000"] };
  const url = `https://thecolorpalettestudio.com/studiocode?${encodeURIComponent(JSON.stringify(data))}`;
  assert.deepEqual(parseColorInput(url), data.colors);
});

test("legacy double-encoded colorNames remain supported", () => {
  const query = new URLSearchParams({ colorNames: encodeURIComponent(JSON.stringify([{ hex: "#000000" }])) });
  assert.deepEqual(parseColorInput(`studiocode?${query}`), ["#000000"]);
});

test("pair import discards duplicates, missing colors, malformed and self pairings", () => {
  const query = new URLSearchParams({
    colorNames: JSON.stringify(colors.map((color, index) => ({ hex: ["#ff00aa", "#000000", "#ffffff"][index] }))),
    pairings: JSON.stringify([...pairings, pairings[0], { foreground: "#123456", background: "#000000" }, { foreground: "#ffffff", background: "#ffffff" }, null, { foreground: 5 }]),
  });
  assert.deepEqual(parseStudioCode(`studiocode?${query}`)?.pairings, pairings);
});

test("invalid Studio Code does not crash, and ordinary colors still parse", () => {
  for (const input of ["studiocode?colorNames=not-json", "studiocode?colorNames=null", "studiocode?colorNames=%", "studiocode?colorNames=%5Bnull%5D"]) {
    assert.equal(parseStudioCode(input), null);
  }
  assert.deepEqual(parseColorInput("#ff00aa #000000"), ["#ff00aa", "#000000"]);
});

test("Studio Code never serializes extra accessibility fields from pair objects", () => {
  const extraFields = [{ ...pairings[0], passes: false, ratio: 1.2, wcag: "AA" }];
  const code = createStudioCode(colors, extraFields);
  assert.doesNotMatch(decodeURIComponent(code), /passes|ratio|wcag/);
  assert.deepEqual(parseStudioCode(code)?.pairings, [pairings[0]]);
});
