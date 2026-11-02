import { rgbToHex, type RGB, type StudioPairing } from "./colorUtils";

export function createStudioCode(colors: RGB[], pairings?: StudioPairing[]): string {
  const colorNames = Array.from(new Set(colors.map(rgbToHex))).map((hex, index) => ({
    name: `Color ${index + 1}`, hex,
  }));
  const params = new URLSearchParams({ colorNames: JSON.stringify(colorNames) });
  if (pairings !== undefined) {
    params.set("pairings", JSON.stringify(pairings.map(({ foreground, background }) => ({ foreground, background }))));
  }
  return `studiocode?${params.toString()}`;
}

export function downloadTextFile(text: string, filename: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  downloadFile(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function paletteHexText(colors: RGB[]): string {
  return colors.map(color => rgbToHex(color).toUpperCase()).join("\n") + "\n";
}

export function downloadFile(href: string, filename: string): void {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function downloadPaletteText(colors: RGB[]): void {
  downloadTextFile(paletteHexText(colors), "my-color-palette.txt");
}

export function downloadPalettePNG(colors: RGB[]): void {
  if (!colors.length) throw new Error("No palette colors");
  const columns = Math.min(colors.length, 5);
  const rows = Math.ceil(colors.length / columns);
  const width = 80 + columns * 200;
  const height = 150 + rows * 220;
  const canvas = document.createElement("canvas");
  canvas.width = width * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  ctx.scale(2, 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#18181b";
  ctx.font = "bold 28px sans-serif";
  ctx.fillText("My Color Palette", 40, 55);
  ctx.font = "16px sans-serif";
  ctx.fillText(`${colors.length} colors · Color Palette Tester`, 40, 85);
  colors.forEach((color, index) => {
    const x = 40 + (index % columns) * 200;
    const y = 120 + Math.floor(index / columns) * 220;
    ctx.fillStyle = rgbToHex(color);
    ctx.fillRect(x, y, 176, 150);
    ctx.strokeStyle = "#d4d4d8";
    ctx.strokeRect(x, y, 176, 150);
    ctx.fillStyle = "#18181b";
    ctx.font = "18px monospace";
    ctx.fillText(rgbToHex(color).toUpperCase(), x, y + 182);
  });
  const data = canvas.toDataURL("image/png");
  if (!data.startsWith("data:image/png")) throw new Error("Palette image could not be created");
  downloadFile(data, "my-color-palette.png");
}
