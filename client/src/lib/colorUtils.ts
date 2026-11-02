export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function parseColor(color: string): RGB | null {
  const trimmed = color.trim();
  
  // HEX format
  const hexMatch = trimmed.match(/^#?([A-Fa-f0-9]{6})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }
  
  // RGB format
  const rgbMatch = trimmed.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }
  
  // HSL format
  const hslMatch = trimmed.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)$/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    return hslToRgb(h, s, l);
  }
  
  return null;
}

function hslToRgb(h: number, s: number, l: number): RGB {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function getLuminance(rgb: RGB): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: RGB, color2: RGB): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface StudioPairing {
  foreground: string;
  background: string;
}

export function parseStudioCode(input: string): { colors: string[]; pairings?: StudioPairing[] } | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith("studiocode?") && !trimmed.includes("/studiocode?") && !trimmed.includes("colorNames=")) return null;
  try {
    const query = trimmed.includes("?") ? trimmed.slice(trimmed.indexOf("?") + 1) : trimmed;
    const params = new URLSearchParams(query);
    const decodeJSON = (value: string) => {
      try { return JSON.parse(value); }
      catch { return JSON.parse(decodeURIComponent(value)); }
    };
    const names = params.get("colorNames");
    // Accept the previous exporter's encoded JSON URL as well as parameter-based codes.
    const legacy = names ? null : decodeJSON(decodeURIComponent(query));
    const entries: unknown = names ? decodeJSON(names) : legacy?.colors;
    if (!Array.isArray(entries)) return null;
    const colors = Array.from(new Set(entries.map(item => {
      const value = typeof item === "string" ? item : item?.hex;
      if (typeof value !== "string") return null;
      const color = parseColor(value);
      return color ? rgbToHex(color) : null;
    }).filter((hex): hex is string => hex !== null)));
    if (!colors.length) return null;
    const encodedPairs = params.get("pairings");
    const rawPairs = encodedPairs ? decodeJSON(encodedPairs) : legacy?.pairings;
    if (rawPairs === undefined || rawPairs === null) return { colors };
    if (!Array.isArray(rawPairs)) return null;
    const seen = new Set<string>();
    const pairings: StudioPairing[] = [];
    for (const pair of rawPairs) {
      if (typeof pair?.foreground !== "string" || typeof pair?.background !== "string") continue;
      const fg = parseColor(pair.foreground);
      const bg = parseColor(pair.background);
      if (!fg || !bg) continue;
      const foreground = rgbToHex(fg);
      const background = rgbToHex(bg);
      const id = `${foreground}-${background}`;
      if (foreground === background || !colors.includes(foreground) || !colors.includes(background) || seen.has(id)) continue;
      seen.add(id);
      pairings.push({ foreground, background });
    }
    return { colors, pairings };
  } catch {
    return null;
  }
}

export function parseColorInput(input: string): string[] {
  const studio = parseStudioCode(input);
  if (studio) return studio.colors;
  
  // Keep RGB/HSL functions intact while accepting whitespace or punctuation
  // between colors. parseColor validates each complete token afterward.
  return input.match(/(?:rgb|hsl)\s*\([^)]*\)|[^\s,;]+/gi) ?? [];
}
