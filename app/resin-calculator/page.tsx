import ResinCalculatorTopBar from '@/components/resin-calculator/ResinCalculatorTopBar';
import ResinCalculatorClient from '@/components/resin-calculator/ResinCalculatorClient';
import { fetcher } from '@/lib/fetcher';
import {
  filterActiveRatios,
  filterActiveShapes,
  normalizeList,
  type MeasurementUnit,
  type ResinRatio,
  type ResinShape,
} from '@/lib/resin-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resin Calculator',
  description: 'Calculate resin, hardener and cost for your project.',
};

export default async function ResinCalculatorPage() {
  const [shapesRaw, ratiosRaw, unitsRaw] = await Promise.all([
    fetcher('/shape', { cache: 'no-store' }, 0, false).catch(() => null),
    fetcher('/resin-ratio', { cache: 'no-store' }, 0, false).catch(() => null),
    fetcher('/measurement-unit', { cache: 'no-store' }, 0, false).catch(() => null),
  ]);

  const shapes = filterActiveShapes(normalizeList<ResinShape>(shapesRaw));
  const ratios = filterActiveRatios(normalizeList<ResinRatio>(ratiosRaw));
  const units = normalizeList<MeasurementUnit>(unitsRaw).filter(
    (u) => String(u.status ?? '1') === '1',
  );

  const bootstrapError =
    shapes.length === 0 || ratios.length === 0 || units.length === 0
      ? 'Could not load calculator data. Please try again later.'
      : undefined;

  return (
    <div className="min-h-screen bg-white pb-20">
      <ResinCalculatorTopBar />
      <ResinCalculatorClient
        shapes={shapes}
        ratios={ratios}
        units={units}
        bootstrapError={bootstrapError}
      />
    </div>
  );
}
