import assert from "node:assert/strict";
import { test } from "node:test";
import { parseColor, parseColorInput, rgbToHex } from "./colorUtils";

const parsedHexes = (input: string) =>
  parseColorInput(input)
    .map(parseColor)
    .filter((color) => color !== null)
    .map(rgbToHex);

test("accepts HEX codes separated by spaces without commas", () => {
  assert.deepEqual(parsedHexes("#7c70ff #000000"), ["#7c70ff", "#000000"]);
});

test("accepts mixed separators from the reported palette", () => {
  const input = "#f91d71, #fd806a, #ffd025, #74d551, #76c4f4, #7c70ff #000000";
  assert.deepEqual(parsedHexes(input), [
    "#f91d71", "#fd806a", "#ffd025", "#74d551", "#76c4f4", "#7c70ff", "#000000",
  ]);
});

test("accepts newlines, tabs, repeated spaces, commas and semicolons", () => {
  assert.deepEqual(
    parsedHexes("  #FF0000\r\n\t#00FF00   #0000FF,; #FFFFFF  "),
    ["#ff0000", "#00ff00", "#0000ff", "#ffffff"],
  );
});

test("accepts six-digit HEX codes without hash prefixes", () => {
  assert.deepEqual(parsedHexes("ff0000 00FF00"), ["#ff0000", "#00ff00"]);
});

test("preserves commas and spaces inside RGB and HSL functions", () => {
  assert.deepEqual(
    parseColorInput("rgb(255, 0, 0), hsl(120, 100%, 50%) #0000ff"),
    ["rgb(255, 0, 0)", "hsl(120, 100%, 50%)", "#0000ff"],
  );
  assert.deepEqual(
    parsedHexes("rgb(255, 0, 0) hsl(120, 100%, 50%) #0000ff"),
    ["#ff0000", "#00ff00", "#0000ff"],
  );
});

test("preserves case-insensitive function names with spacing", () => {
  assert.deepEqual(parsedHexes("RGB (255, 255, 255)\nHSL(0, 0%, 0%)"), [
    "#ffffff", "#000000",
  ]);
});

test("ignores empty input and separator-only input", () => {
  assert.deepEqual(parseColorInput(""), []);
  assert.deepEqual(parseColorInput(" ,;\n\t "), []);
});

test("does not truncate malformed HEX into an accepted color", () => {
  assert.deepEqual(parsedHexes("#1234567 invalid #000000"), ["#000000"]);
});

test("preserves legacy Studio Code imports", () => {
  const params = new URLSearchParams({
    colorNames: JSON.stringify([{ hex: "#ff0000" }, { hex: "#000000" }]),
  });
  assert.deepEqual(parsedHexes(`studiocode?${params}`), ["#ff0000", "#000000"]);
});
