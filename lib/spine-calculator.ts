// Spine (lomo) calculation engine for book binding
// Replicates the logic from "CALCULO DE LOMOv2.xlsx"

export type PaperType = "O" | "B" | "M"; // Offset, Brillo (gloss), Mate

export interface SpineInput {
  width: number;         // Book width in cm
  height: number;        // Book height in cm
  pages: number;         // Interior pages count
  coverWeight: number;   // Cover paper weight in gsm
  paperType: PaperType;  // Interior paper finish
  paperWeight: number;   // Interior paper weight in gsm
  cardboardThickness: number; // Cardboard thickness in mm (for hardcover)
  endpaperWeight: number;     // Endpaper (guardas) weight in gsm (for hardcover)
}

export interface SpineResult {
  // Raw spine values in mm
  rawFresado: number;
  rawRusticaCosida: number;
  rawTapaDura: number;
  // Rounded commercial spine values in mm
  fresado: number;
  rusticaCosida: number;
  tapaDura: number;
  // Weight per copy in grams
  weightRustica: {
    interior: number;
    cover: number;
    total: number;
  };
  weightTapaDura: {
    interior: number;
    coverLining: number;
    cardboard: number;
    endpapers: number;
    total: number;
  };
  // Hardcover lining development in mm
  hardcoverDevelopment: {
    width: number;   // Total development width
    height: number;  // Total development height
    flap: number;          // Pestaña para pegar
    backCover: number;     // Contracubierta
    hinge: number;         // Franquicia
    spine: number;         // Lomo
    frontCover: number;    // Cubierta
  };
}

// Calibre lookup table: maps paper weight (gsm) to thickness per page (mm)
// Columns: [weight, offset, brillo, mate]
const CALIBRE_TABLE: [number, number, number, number][] = [
  [70,  0.0488, 0,      0],
  [80,  0.0538, 0,      0],
  [90,  0.0594, 0.0344, 0.0394],
  [100, 0.0644, 0.0369, 0.0431],
  [110, 0.0738, 0.0410, 0.0485],
  [115, 0.07755, 0.0441, 0.0513],
  [120, 0.0813, 0.0462, 0.0531],
  [125, 0,      0.0475, 0.0538],
  [135, 0,      0.0513, 0.0594],
  [150, 0,      0.0600, 0.0644],
  [170, 0,      0.0631, 0.0725],
];

// Cardboard weight lookup: thickness (mm) -> weight (gsm)
const CARDBOARD_TABLE: [number, number][] = [
  [1,    615],
  [1.25, 770],
  [1.5,  920],
  [1.75, 1075],
  [2,    1230],
  [2.25, 1385],
  [2.5,  1540],
  [2.75, 1690],
  [3,    1845],
];

/**
 * Look up calibre (thickness per page) based on paper weight and type.
 * Uses LOOKUP-style matching: finds the largest weight <= the given weight.
 */
function lookupCalibre(paperWeight: number, paperType: PaperType): number {
  const colIndex = paperType === "O" ? 1 : paperType === "B" ? 2 : 3;

  // LOOKUP behavior: find the last row where table weight <= paperWeight
  let calibre = 0;
  for (const row of CALIBRE_TABLE) {
    if (row[0] <= paperWeight && row[colIndex] > 0) {
      calibre = row[colIndex];
    }
  }
  return calibre;
}

/**
 * Look up cardboard weight (gsm) from thickness (mm).
 */
function lookupCardboardWeight(thickness: number): number {
  let weight = 0;
  for (const [t, w] of CARDBOARD_TABLE) {
    if (t <= thickness) {
      weight = w;
    }
  }
  return weight;
}

/**
 * Round spine to commercial value.
 * Rules: if < minimum, use minimum. Otherwise round to nearest 0.5mm.
 */
function roundSpine(raw: number, minimum: number): number {
  if (raw === 0) return 0;
  if (raw < minimum) return minimum;

  const floored = Math.floor(raw);
  const remainder = raw - floored;
  return floored + (remainder < 0.5 ? 0.5 : 1);
}

/**
 * Main calculation function.
 */
export function calculateSpine(input: SpineInput): SpineResult {
  const {
    width, height, pages, coverWeight,
    paperType, paperWeight,
    cardboardThickness, endpaperWeight,
  } = input;

  const calibre = lookupCalibre(paperWeight, paperType);

  // --- Spine calculations (in mm) ---
  const rawFresado = pages * calibre;
  const rawRusticaCosida = rawFresado * 1.15;
  const rawTapaDura = Math.ceil((rawFresado + cardboardThickness * 2 + 1) * 10) / 10;

  // Rounded commercial values
  const fresado = roundSpine(rawFresado, 4);
  const rusticaCosida = roundSpine(rawRusticaCosida, 4);
  const tapaDura = roundSpine(rawTapaDura, 8);

  // --- Weight calculations (in grams) ---

  // Interior pages weight (same for both binding types)
  const interiorWeight = (width * height * paperWeight / 20000) * pages;

  // Rústica cover: plastified 1 side
  const rusticaCoverPaper = (width * 2 + rawRusticaCosida) * height * coverWeight / 10000;
  const rusticaCoverPlastic = (width * 2 + rawRusticaCosida) * height * 13 / 10000;
  const rusticaCoverTotal = rusticaCoverPaper + rusticaCoverPlastic;

  // Hardcover development dimensions (in mm)
  const flap = 20; // Pestaña para pegar
  const backCoverMm = width * 10 - 5;
  const hinge = (cardboardThickness + 5) + 2.5; // Franquicia
  const spineMm = tapaDura;
  const frontCoverMm = backCoverMm;
  const developmentWidth = flap + backCoverMm + hinge + spineMm + hinge + frontCoverMm + flap;
  const cardboardHeightMm = height * 10 + 7;
  const developmentHeight = cardboardHeightMm + flap * 2;

  // Hardcover lining weight (forro)
  const liningWeight = (developmentWidth * developmentHeight) * 163 / 1000000;

  // Cardboard weight (bigris)
  const cardboardGsm = lookupCardboardWeight(cardboardThickness);
  const cardboardWeight = ((backCoverMm + spineMm + frontCoverMm) * cardboardHeightMm * cardboardGsm) / 1000000;

  // Endpapers weight (guardas)
  const endpapersWeight = ((width * height) * 4) * endpaperWeight / 10000;

  return {
    rawFresado,
    rawRusticaCosida,
    rawTapaDura,
    fresado,
    rusticaCosida,
    tapaDura,
    weightRustica: {
      interior: interiorWeight,
      cover: rusticaCoverTotal,
      total: interiorWeight + rusticaCoverTotal,
    },
    weightTapaDura: {
      interior: interiorWeight,
      coverLining: liningWeight,
      cardboard: cardboardWeight,
      endpapers: endpapersWeight,
      total: interiorWeight + liningWeight + cardboardWeight + endpapersWeight,
    },
    hardcoverDevelopment: {
      width: developmentWidth,
      height: developmentHeight,
      flap,
      backCover: backCoverMm,
      hinge,
      spine: spineMm,
      frontCover: frontCoverMm,
    },
  };
}
