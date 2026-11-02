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

export function downloadPalettePNG(
  colors: RGB[],
  pairings: { foreground: RGB; background: RGB }[] = [],
): void {
  if (!colors.length) throw new Error("No palette colors");
  const columns = Math.min(colors.length, 5);
  const rows = Math.ceil(colors.length / columns);
  const width = pairings.length ? Math.max(680, 80 + columns * 200) : 80 + columns * 200;
  const paletteHeight = 150 + rows * 220;
  const pairColumns = Math.max(1, Math.min(3, Math.floor((width - 80) / 280)));
  const pairRows = Math.ceil(pairings.length / pairColumns);
  const height = paletteHeight + (pairings.length ? 80 + pairRows * 200 : 0);
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
  if (pairings.length) {
    ctx.fillStyle = "#18181b";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(`Selected pairings (${pairings.length})`, 40, paletteHeight + 20);
    const cardWidth = (width - 80) / pairColumns - 20;
    pairings.forEach((pair, index) => {
      const x = 40 + (index % pairColumns) * ((width - 80) / pairColumns);
      const y = paletteHeight + 50 + Math.floor(index / pairColumns) * 200;
      const fg = rgbToHex(pair.foreground).toUpperCase();
      const bg = rgbToHex(pair.background).toUpperCase();
      ctx.fillStyle = bg;
      ctx.fillRect(x, y, cardWidth, 100);
      ctx.strokeStyle = "#d4d4d8";
      ctx.strokeRect(x, y, cardWidth, 100);
      ctx.fillStyle = fg;
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("Aa", x + 20, y + 62);
      // Keep metadata readable even when the chosen pair has low contrast.
      ctx.fillStyle = "#18181b";
      ctx.font = "16px monospace";
      ctx.fillText(`Text: ${fg}`, x, y + 130);
      ctx.fillText(`Background: ${bg}`, x, y + 156);
    });
  }
  const data = canvas.toDataURL("image/png");
  if (!data.startsWith("data:image/png")) throw new Error("Palette image could not be created");
  downloadFile(data, pairings.length ? "my-colors-and-pairings.png" : "my-color-palette.png");
}
