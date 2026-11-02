import { parseColor, parseColorInput, rgbToHex, type RGB } from "./colorUtils";

export const PALETTE_STORAGE_KEY = "color-palette-studio:draft";

export interface PaletteDraft {
  version: 1;
  input: string;
  favorites: string[];
}

export function colorsFromInput(input: string): RGB[] {
  const unique = new Map<string, RGB>();
  for (const token of parseColorInput(input)) {
    const color = parseColor(token);
    if (color) {
      const hex = rgbToHex(color);
      // Normalize out-of-range RGB input the same way as the swatches.
      unique.set(hex, parseColor(hex)!);
    }
  }
  return Array.from(unique.values());
}

export function validFavorites(input: string, favorites: Iterable<string>): string[] {
  const hexes = new Set(colorsFromInput(input).map(rgbToHex));
  return Array.from(new Set(favorites)).filter(id => {
    const [foreground, background, extra] = id.split("-");
    return !extra && foreground !== background && hexes.has(foreground) && hexes.has(background);
  });
}

export function readPaletteDraft(defaultInput: string): { draft: PaletteDraft; warning: string } {
  const fallback: PaletteDraft = { version: 1, input: defaultInput, favorites: [] };
  try {
    const raw = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    if (raw === null) return { draft: fallback, warning: "" };
    const data: unknown = JSON.parse(raw);
    if (
      !data || typeof data !== "object" ||
      !("version" in data) || data.version !== 1 ||
      !("input" in data) || typeof data.input !== "string" ||
      !("favorites" in data) || !Array.isArray(data.favorites) ||
      !data.favorites.every(id => typeof id === "string")
    ) throw new Error("Invalid palette draft");
    const favorites = validFavorites(data.input, data.favorites);
    if (favorites.length !== data.favorites.length) throw new Error("Invalid saved pairings");
    return { draft: { version: 1, input: data.input, favorites }, warning: "" };
  } catch {
    return {
      draft: fallback,
      warning: "Your saved palette could not be restored because its data is invalid or browser storage is unavailable. The sample palette is shown instead.",
    };
  }
}

export function savePaletteDraft(input: string, favorites: Iterable<string>): boolean {
  try {
    const draft: PaletteDraft = { version: 1, input, favorites: validFavorites(input, favorites) };
    window.localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}
