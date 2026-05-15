import type { BeadColor } from '@/data/beadColors';

export interface ConversionResult {
  grid: string[][];
  colorMap: Map<string, BeadColor>;
  statistics: ColorStat[];
  width: number;
  height: number;
}

export interface ColorStat {
  code: string;
  color: BeadColor;
  count: number;
  percentage: number;
  letter: string;
}

// ===== RGB <-> Lab Conversion =====

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  // Normalize RGB to 0-1
  let rn = r / 255;
  let gn = g / 255;
  let bn = b / 255;

  // Apply gamma correction
  rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92;
  gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92;
  bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92;

  // Observer = 2°, Illuminant = D65
  const x = rn * 0.4124564 + gn * 0.3575761 + bn * 0.1804375;
  const y = rn * 0.2126729 + gn * 0.7151522 + bn * 0.0721750;
  const z = rn * 0.0193339 + gn * 0.1191920 + bn * 0.9503041;

  return [x * 100, y * 100, z * 100];
}

function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // D65 reference white
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  let xr = x / refX;
  let yr = y / refY;
  let zr = z / refZ;

  xr = xr > 0.008856 ? Math.pow(xr, 1 / 3) : 7.787 * xr + 16 / 116;
  yr = yr > 0.008856 ? Math.pow(yr, 1 / 3) : 7.787 * yr + 16 / 116;
  zr = zr > 0.008856 ? Math.pow(zr, 1 / 3) : 7.787 * zr + 16 / 116;

  const L = 116 * yr - 16;
  const a = 500 * (xr - yr);
  const b = 200 * (yr - zr);

  return [L, a, b];
}

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

// ===== CIEDE2000 Color Distance =====

export function ciede2000(
  lab1: [number, number, number],
  lab2: [number, number, number]
): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const kL = 1;
  const kC = 1;
  const kH = 1;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cbar = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  let h1p = Math.atan2(b1, a1p) * (180 / Math.PI);
  if (h1p < 0) h1p += 360;
  let h2p = Math.atan2(b2, a2p) * (180 / Math.PI);
  if (h2p < 0) h2p += 360;

  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp = 0;
  if (C1p * C2p !== 0) {
    if (Math.abs(h2p - h1p) <= 180) {
      dhp = h2p - h1p;
    } else if (h2p - h1p > 180) {
      dhp = h2p - h1p - 360;
    } else {
      dhp = h2p - h1p + 360;
    }
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);

  const Lbarp = (L1 + L2) / 2;
  const Cbarp = (C1p + C2p) / 2;

  let hbarp = h1p + h2p;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1p - h2p) <= 180) {
      hbarp = (h1p + h2p) / 2;
    } else if (h1p + h2p < 360) {
      hbarp = (h1p + h2p + 360) / 2;
    } else {
      hbarp = (h1p + h2p - 360) / 2;
    }
  }

  const T =
    1 -
    0.17 * Math.cos(((hbarp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hbarp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hbarp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hbarp - 63) * Math.PI) / 180);

  const dtheta = 30 * Math.exp(-Math.pow((hbarp - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(Cbarp, 7) / (Math.pow(Cbarp, 7) + Math.pow(25, 7)));
  const Rt = -Rc * Math.sin((2 * dtheta * Math.PI) / 180);

  const Sl = 1 + (0.015 * Math.pow(Lbarp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbarp - 50, 2));
  const Sc = 1 + 0.045 * Cbarp;
  const Sh = 1 + 0.015 * Cbarp * T;

  const dE = Math.sqrt(
    Math.pow(dLp / (kL * Sl), 2) +
    Math.pow(dCp / (kC * Sc), 2) +
    Math.pow(dHp / (kH * Sh), 2) +
    Rt * (dCp / (kC * Sc)) * (dHp / (kH * Sh))
  );

  return dE;
}

// ===== Find Nearest Color =====

const labCache = new Map<string, [number, number, number]>();

function getLabCache(hex: string): [number, number, number] {
  if (!labCache.has(hex)) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    labCache.set(hex, rgbToLab(r, g, b));
  }
  return labCache.get(hex)!;
}

export function findNearestColor(
  r: number,
  g: number,
  b: number,
  palette: BeadColor[]
): BeadColor {
  const targetLab = rgbToLab(r, g, b);
  let minDist = Infinity;
  let nearest = palette[0];

  for (const color of palette) {
    const colorLab = getLabCache(color.hex);
    const dist = ciede2000(targetLab, colorLab);
    if (dist < minDist) {
      minDist = dist;
      nearest = color;
    }
  }

  return nearest;
}

// ===== Pixelization =====

export function pixelizeImage(
  image: HTMLImageElement,
  width: number,
  height: number
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  // Use nearest-neighbor for sharp pixel edges
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

// ===== Color Quantization =====

export type QuantAlgorithm = 'nearest' | 'median' | 'kmeans';

export function quantizeColors(
  imageData: ImageData,
  palette: BeadColor[],
  maxColors: number,
  _algorithm: QuantAlgorithm = 'nearest'
): ConversionResult {
  const { width, height, data } = imageData;
  const totalPixels = width * height;

  // Step 1: Map each pixel to nearest bead color
  const colorCodeGrid: string[][] = [];
  const colorCounts = new Map<string, { color: BeadColor; count: number }>();

  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      let code: string;
      if (a < 128) {
        // Transparent -> use white
        code = palette.find((c) => c.code.includes('01'))?.code || palette[0].code;
      } else {
        const nearest = findNearestColor(r, g, b, palette);
        code = nearest.code;
      }

      row.push(code);
      const existing = colorCounts.get(code);
      if (existing) {
        existing.count++;
      } else {
        const color = palette.find((c) => c.code === code);
        if (color) {
          colorCounts.set(code, { color, count: 1 });
        }
      }
    }
    colorCodeGrid.push(row);
  }

  // Step 2: If too many colors, merge least-used
  if (colorCounts.size > maxColors) {
    // Sort by count ascending
    const sorted = Array.from(colorCounts.entries()).sort((a, b) => a[1].count - b[1].count);
    const toMerge = sorted.slice(0, sorted.length - maxColors);
    const keepCodes = new Set(sorted.slice(sorted.length - maxColors).map(([code]) => code));

    // Build a map of merge targets
    const mergeMap = new Map<string, string>();
    for (const [codeToMerge] of toMerge) {
      const colorToMerge = colorCounts.get(codeToMerge)!.color;
      const colorLab = getLabCache(colorToMerge.hex);
      let minDist = Infinity;
      let bestTarget = '';
      for (const [keepCode] of sorted.slice(sorted.length - maxColors)) {
        const keepColor = colorCounts.get(keepCode)!.color;
        const keepLab = getLabCache(keepColor.hex);
        const dist = ciede2000(colorLab, keepLab);
        if (dist < minDist) {
          minDist = dist;
          bestTarget = keepCode;
        }
      }
      mergeMap.set(codeToMerge, bestTarget);
      keepCodes.add(bestTarget);
    }

    // Apply merge
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const oldCode = colorCodeGrid[y][x];
        if (mergeMap.has(oldCode)) {
          const newCode = mergeMap.get(oldCode)!;
          colorCodeGrid[y][x] = newCode;
          colorCounts.get(oldCode)!.count--;
          colorCounts.get(newCode)!.count++;
        }
      }
    }

    // Remove empty entries
    for (const [code, info] of colorCounts) {
      if (info.count <= 0) {
        colorCounts.delete(code);
      }
    }
  }

  // Step 3: Build color map and statistics
  const colorMap = new Map<string, BeadColor>();
  const statistics: ColorStat[] = [];

  for (const [code, info] of colorCounts) {
    colorMap.set(code, info.color);
  }

  // Assign letters
  const sortedStats = Array.from(colorCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([code, info], index) => {
      const letter = getLetterCode(index);
      return {
        code,
        color: info.color,
        count: info.count,
        percentage: (info.count / totalPixels) * 100,
        letter,
      };
    });

  for (const stat of sortedStats) {
    colorMap.set(stat.code, stat.color);
    statistics.push(stat);
  }

  // Step 4: Convert color codes to letter codes in grid
  const letterGrid: string[][] = colorCodeGrid.map((row) =>
    row.map((code) => {
      const stat = sortedStats.find((s) => s.code === code);
      return stat?.letter || '?';
    })
  );

  return {
    grid: letterGrid,
    colorMap,
    statistics,
    width,
    height,
  };
}

function getLetterCode(index: number): string {
  if (index < 26) {
    return String.fromCharCode(65 + index); // A-Z
  }
  if (index < 52) {
    return String.fromCharCode(97 + (index - 26)); // a-z
  }
  return String(index - 51); // 1, 2, 3...
}

// ===== Grid Encoding =====

export function encodeGrid(
  colorGrid: string[][],
  colorMap: Map<string, BeadColor>
): { letterGrid: string[][]; statMap: Map<string, ColorStat> } {
  const codeToLetter = new Map<string, string>();
  const statMap = new Map<string, ColorStat>();
  let index = 0;

  for (const [code, color] of colorMap) {
    const letter = getLetterCode(index);
    codeToLetter.set(code, letter);
    statMap.set(letter, {
      code,
      color,
      count: 0,
      percentage: 0,
      letter,
    });
    index++;
  }

  const letterGrid = colorGrid.map((row) =>
    row.map((code) => codeToLetter.get(code) || '?')
  );

  // Recalculate counts based on letter grid
  for (const row of letterGrid) {
    for (const letter of row) {
      const stat = statMap.get(letter);
      if (stat) stat.count++;
    }
  }

  const total = letterGrid.length * (letterGrid[0]?.length || 0);
  for (const stat of statMap.values()) {
    stat.percentage = (stat.count / total) * 100;
  }

  return { letterGrid, statMap };
}

// ===== Dimension Helpers =====

export function getRealSizeCm(gridWidth: number, gridHeight: number): string {
  // Standard bead is 5mm
  const w = (gridWidth * 5) / 10;
  const h = (gridHeight * 5) / 10;
  return `${w.toFixed(1)}×${h.toFixed(1)}`;
}

export function getPegboardCount(gridWidth: number, gridHeight: number): number {
  const boardSize = 29;
  const boardsW = Math.ceil(gridWidth / boardSize);
  const boardsH = Math.ceil(gridHeight / boardSize);
  return boardsW * boardsH;
}
