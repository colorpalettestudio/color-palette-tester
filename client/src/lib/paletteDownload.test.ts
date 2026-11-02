import assert from "node:assert/strict";
import { test } from "node:test";
import { paletteHexText, downloadPalettePNG, downloadPaletteText } from "./paletteDownload";

test("HEX download preserves palette order with one reusable code per line", () => {
  assert.equal(paletteHexText([{ r: 255, g: 0, b: 170 }, { r: 0, g: 0, b: 0 }]), "#FF00AA\n#000000\n");
});

test("palette exports create named PNG/text downloads with all swatches and labels", () => {
  const labels: string[] = [];
  const downloads: { download: string; href: string }[] = [];
  let swatchCount = 0;
  const context = {
    scale() {}, fillRect() { swatchCount++; }, strokeRect() {},
    fillText(text: string) { labels.push(text); },
  };
  const originalDocument = globalThis.document;
  Object.assign(globalThis, { document: {
    body: { appendChild() {} },
    createElement(tag: string) {
      if (tag === "canvas") return { getContext: () => context, toDataURL: () => "data:image/png;base64,abc" };
      return { download: "", href: "", click() { downloads.push({ download: this.download, href: this.href }); }, remove() {} };
    },
  } });
  try {
    const colors = [{ r: 255, g: 0, b: 170 }, { r: 0, g: 0, b: 0 }];
    downloadPalettePNG(colors);
    downloadPaletteText(colors);
    assert.equal(swatchCount, 3); // white sheet + two swatches
    assert.ok(labels.includes("#FF00AA"));
    assert.ok(labels.includes("#000000"));
    assert.deepEqual(downloads.map(item => item.download), ["my-color-palette.png", "my-color-palette.txt"]);
    assert.ok(downloads[1].href.startsWith("blob:"));
    assert.throws(() => downloadPalettePNG([]), /No palette colors/);
  } finally {
    globalThis.document = originalDocument;
  }
});
