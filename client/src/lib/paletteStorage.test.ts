import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { colorsFromInput, PALETTE_STORAGE_KEY, readPaletteDraft, savePaletteDraft, validFavorites } from "./paletteStorage";

let data: Map<string, string>;
beforeEach(() => {
  data = new Map();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => { data.set(key, value); },
    } },
  });
});

test("first visit uses the sample without a warning", () => {
  assert.deepEqual(readPaletteDraft("#ffffff"), {
    draft: { version: 1, input: "#ffffff", favorites: [] }, warning: "",
  });
});

test("raw unfinished input and directional selections survive a round trip", () => {
  const input = "#ffffff, rgb(0, 0, 0)\n#in-progress";
  assert.equal(savePaletteDraft(input, ["#ffffff-#000000"]), true);
  const result = readPaletteDraft("sample");
  assert.equal(result.draft.input, input);
  assert.deepEqual(result.draft.favorites, ["#ffffff-#000000"]);
  assert.equal(result.warning, "");
});

test("an intentionally empty palette stays empty", () => {
  savePaletteDraft("", []);
  assert.equal(readPaletteDraft("#ffffff").draft.input, "");
});

test("removed colors prune selections while reordering keeps them", () => {
  const favorite = "#ffffff-#000000";
  assert.deepEqual(validFavorites("#000000 #ffffff", [favorite]), [favorite]);
  assert.deepEqual(validFavorites("#ffffff", [favorite]), []);
});

test("malformed, outdated, and invalid pairing data produce explicit recovery warnings", () => {
  for (const value of [
    "{broken", "null", "[]",
    JSON.stringify({ version: 2, input: "", favorites: [] }),
    JSON.stringify({ version: 1, input: 7, favorites: [] }),
    JSON.stringify({ version: 1, input: "#ffffff #000000", favorites: [42] }),
    JSON.stringify({ version: 1, input: "#ffffff", favorites: ["#ffffff-#000000"] }),
  ]) {
    data.set(PALETTE_STORAGE_KEY, value);
    const result = readPaletteDraft("sample");
    assert.equal(result.draft.input, "sample");
    assert.ok(result.warning);
  }
});

test("blocked reads and quota failures do not throw", () => {
  window.localStorage.getItem = () => { throw new Error("Blocked"); };
  window.localStorage.setItem = () => { throw new Error("Quota"); };
  assert.ok(readPaletteDraft("sample").warning);
  assert.equal(savePaletteDraft("#ffffff", []), false);
});

test("parsed colors are deduplicated and normalized", () => {
  assert.deepEqual(colorsFromInput("#ffffff #FFFFFF rgb(999, 0, 0) unfinished"), [
    { r: 255, g: 255, b: 255 }, { r: 255, g: 0, b: 0 },
  ]);
});
