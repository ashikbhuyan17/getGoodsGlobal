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
  description?: string | null;
};

export function getCoatingThicknessSubline(
  unit: MeasurementUnit | null,
  fallback: string,
): string {
  const text = unit?.description?.trim();
  return text ? text : fallback;
}

export type ResinCalculatorResult = {
  resin: number;
  hardener: number;
  cost: number;
  wastageLine: string | null;
};

function formatWastageLineFromRatio(ratio: unknown): string | null {
  if (!ratio || typeof ratio !== 'object') return null;
  const r = ratio as { title?: string; wastage?: string | number };
  const title = typeof r.title === 'string' ? r.title.trim() : '';
  if (title) {
    return title.replace(/^note:\s*/i, '');
  }
  const w = Number(r.wastage);
  if (Number.isFinite(w)) {
    const pct = w > 0 && w <= 1 ? Math.round(w * 100) : Math.round(w);
    return `Including ${pct}% wastage`;
  }
  return null;
}

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
  return ratios.filter((r) => r?.id != null && String(r.status ?? '1') === '1');
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

function unitLabelSuffix(unit: MeasurementUnit | null): string | null {
  if (!unit?.title) return null;
  const t = unit.title.toLowerCase().trim();
  if (t.includes('inch')) return 'in inches';
  if (t === 'cm' || t.includes('centimeter')) return 'in cm';
  if (t === 'ml' || t.includes('millilitre') || t.includes('milliliter')) {
    return 'in ml';
  }
  if (t.includes('gram') || t === 'gm' || t === 'g') return 'in gram';
  if (t.includes('meter') && !t.includes('centi')) return 'in meters';
  return null;
}

export function getInputLabel(
  input: ResinShapeInput,
  shapeType: string,
  unit: MeasurementUnit | null,
  customFieldLabel = 'Water weight in gm',
): string {
  if (shapeType === 'custom') return customFieldLabel;
  if (input.mm === 1) return `${input.title} (in mm)`;
  const suffix = unitLabelSuffix(unit);
  if (suffix) return `${input.title} (${suffix})`;
  return input.title;
}

/** Display rounding: fractional part ≥ 0.5 rounds up, otherwise down. */
export function roundResultDisplay(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

export function parseCalculatorResult(
  raw: unknown,
): ResinCalculatorResult | null {
  if (!raw || typeof raw !== 'object') return null;
  const root = raw as {
    status?: boolean | string;
    data?: Record<string, unknown>;
  };
  if (root.status === false || root.status === 'error') return null;
  const data = root.data;
  if (!data) return null;
  const resin = Number(data.resin);
  const hardener = Number(data.hardener);
  const cost = Number(data.cost);
  if (
    !Number.isFinite(resin) ||
    !Number.isFinite(hardener) ||
    !Number.isFinite(cost)
  ) {
    return null;
  }
  return {
    resin,
    hardener,
    cost,
    wastageLine: formatWastageLineFromRatio(data.resin_ratio),
  };
}
