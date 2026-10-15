export type ResinShapeInput = {
  title: string;
  parameter: string;
  mm?: number;
};

export type ResinShape = {
  id: number;
  title: string;
  type: string;
  status?: string;
  input_list: ResinShapeInput[];
};

export type ResinRatio = {
  id: number;
  resin: string;
  hardener: string;
  title?: string;
  status?: string;
};

export type MeasurementUnit = {
  id: number;
  title: string;
  value: string;
  custom: string;
  status?: string;
};

export type ResinCalculatorResult = {
  resin: number;
  hardener: number;
  cost: number;
};

type ApiList<T> = {
  status?: boolean | string;
  message?: string;
  data?: T[];
};

export function normalizeList<T>(raw: unknown): T[] {
  if (!raw || typeof raw !== 'object') return [];
  const payload = raw as ApiList<T>;
  if (payload.status === false || payload.status === 'error') return [];
  return Array.isArray(payload.data) ? payload.data : [];
}

export function filterActiveShapes(shapes: ResinShape[]): ResinShape[] {
  return shapes.filter(
    (s) =>
      s?.id != null &&
      Array.isArray(s.input_list) &&
      s.input_list.length > 0 &&
      String(s.status ?? '1') === '1',
  );
}

export function filterActiveRatios(ratios: ResinRatio[]): ResinRatio[] {
  return ratios.filter(
    (r) => r?.id != null && String(r.status ?? '1') === '1',
  );
}

export function filterActiveUnits(
  units: MeasurementUnit[],
  shapeType: string | undefined,
): MeasurementUnit[] {
  if (!shapeType) return [];
  const isCustom = shapeType === 'custom';
  return units.filter((u) => {
    if (String(u.status ?? '1') !== '1') return false;
    return isCustom ? u.custom === '1' : u.custom === '0';
  });
}

export function formatRatioLabel(ratio: ResinRatio): string {
  return `${ratio.resin}:${ratio.hardener}`;
}

export function getInputLabel(
  input: ResinShapeInput,
  shapeType: string,
  unit: MeasurementUnit | null,
): string {
  if (shapeType === 'custom') return input.title;
  if (input.mm === 1) return `${input.title} (in mm)`;
  const unitTitle = unit?.title?.toLowerCase() ?? '';
  if (unitTitle.includes('inch')) return `${input.title} (in inches)`;
  if (unitTitle.includes('meter')) return `${input.title} (in meters)`;
  return input.title;
}

export function parseCalculatorResult(raw: unknown): ResinCalculatorResult | null {
  if (!raw || typeof raw !== 'object') return null;
  const root = raw as { status?: boolean | string; data?: Record<string, unknown> };
  if (root.status === false || root.status === 'error') return null;
  const data = root.data;
  if (!data) return null;
  const resin = Number(data.resin);
  const hardener = Number(data.hardener);
  const cost = Number(data.cost);
  if (!Number.isFinite(resin) || !Number.isFinite(hardener) || !Number.isFinite(cost)) {
    return null;
  }
  return { resin, hardener, cost };
}
