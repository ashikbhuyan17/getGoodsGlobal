'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import {
  type MeasurementUnit,
  type ResinCalculatorResult,
  type ResinRatio,
  type ResinShape,
  filterActiveUnits,
  formatRatioLabel,
  getInputLabel,
  parseCalculatorResult,
} from '@/lib/resin-calculator';
import {
  buildResinCalculatorSchema,
  type ResinCalculatorFormValues,
} from '@/lib/resin-calculator-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type ResinCalculatorClientProps = {
  shapes: ResinShape[];
  ratios: ResinRatio[];
  units: MeasurementUnit[];
  bootstrapError?: string;
};

function shapeToggleLabel(shape: ResinShape): string {
  if (shape.type === 'rectangle') return 'Rectangle/Square';
  return shape.title;
}

function OptionRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full rounded-none border border-black">
      {children}
    </div>
  );
}

function OptionToggle({
  label,
  selected,
  onClick,
  withLeftBorder,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  withLeftBorder?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-[2.75rem] flex-1 rounded-none px-1 py-2.5 text-center text-xs font-normal leading-snug transition-colors sm:min-h-[3.5rem] sm:px-2 sm:py-3 sm:text-base',
        withLeftBorder && 'border-l border-black',
        selected
          ? 'bg-black text-white'
          : 'bg-white text-neutral-500 hover:text-neutral-800',
      )}
    >
      {label}
    </button>
  );
}

const fieldInputClass =
  'h-11 rounded-none border-neutral-400 text-base shadow-none focus-visible:border-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-14 sm:text-lg';

const fieldLabelClass =
  'text-sm font-medium text-neutral-900 sm:text-base';

function emptyInputsForShape(shape: ResinShape | null): Record<string, string> {
  const inputs: Record<string, string> = {};
  for (const field of shape?.input_list ?? []) {
    inputs[field.parameter] = '';
  }
  return inputs;
}

export default function ResinCalculatorClient({
  shapes,
  ratios,
  units,
  bootstrapError,
}: ResinCalculatorClientProps) {
  const [shapeId, setShapeId] = useState<number | null>(null);
  const [ratioId, setRatioId] = useState<number | null>(null);
  const [unitId, setUnitId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ResinCalculatorResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const selectedShape = useMemo(
    () => shapes.find((s) => s.id === shapeId) ?? null,
    [shapes, shapeId],
  );

  const filteredUnits = useMemo(
    () => filterActiveUnits(units, selectedShape?.type),
    [units, selectedShape?.type],
  );

  const selectedUnit = useMemo(
    () => filteredUnits.find((u) => u.id === unitId) ?? null,
    [filteredUnits, unitId],
  );

  const showRatioStep = shapeId != null;
  const showUnitStep = showRatioStep && ratioId != null;
  const showInputsStep = showUnitStep && unitId != null;

  const schema = useMemo(
    () => buildResinCalculatorSchema(selectedShape?.input_list ?? []),
    [selectedShape?.input_list],
  );

  const form = useForm<ResinCalculatorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: '',
      inputs: {},
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    form.reset({
      price: '',
      inputs: emptyInputsForShape(selectedShape),
    });
  }, [selectedShape?.id, form, selectedShape]);

  const handleShapeSelect = (id: number) => {
    setShapeId(id);
    setRatioId(null);
    setUnitId(null);
    setResult(null);
    setApiError(null);
  };

  const handleRatioSelect = (id: number) => {
    setRatioId(id);
    setUnitId(null);
    setResult(null);
    setApiError(null);
  };

  const handleUnitSelect = (id: number) => {
    setUnitId(id);
    setResult(null);
    setApiError(null);
  };

  const validateSelections = (): boolean => {
    if (!shapeId) {
      toast.error('Please select a shape.');
      return false;
    }
    if (!ratioId) {
      toast.error('Please select a resin : hardener ratio.');
      return false;
    }
    if (!unitId) {
      toast.error('Please select a measurement unit.');
      return false;
    }
    return true;
  };

  const onSubmit = async (values: ResinCalculatorFormValues) => {
    if (!validateSelections() || !selectedShape) return;

    const inputs: Record<string, number> = {};
    for (const field of selectedShape.input_list) {
      inputs[field.parameter] = Number(values.inputs[field.parameter]);
    }

    setSubmitting(true);
    setApiError(null);
    setResult(null);

    try {
      const raw = await fetcher<{
        status?: boolean | string;
        message?: string;
        data?: unknown;
      }>(
        '/resin-calculator',
        {
          method: 'POST',
          body: JSON.stringify({
            shape_id: shapeId,
            resin_ratio_id: ratioId,
            measurement_unit_id: unitId,
            price: Number(values.price),
            inputs,
          }),
        },
        0,
        false,
      );

      if (raw?.status === false || raw?.status === 'error') {
        const msg =
          typeof raw?.message === 'string'
            ? raw.message
            : 'Calculation failed. Please try again.';
        setApiError(msg);
        toast.error(msg);
        return;
      }

      const parsed = parseCalculatorResult(raw);
      if (!parsed) {
        const msg = 'Could not read calculation result.';
        setApiError(msg);
        toast.error(msg);
        return;
      }

      setResult(parsed);
    } catch {
      const msg = 'Calculation request failed.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCalculateClick = () => {
    if (!validateSelections()) return;
    void form.handleSubmit(onSubmit)();
  };

  if (bootstrapError && shapes.length === 0) {
    return (
      <p className="text-center text-sm text-red-600">{bootstrapError}</p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-full space-y-8 px-2 py-6 sm:w-[60vw] sm:space-y-10 sm:px-0 sm:py-12">
      <header className="text-center">
        <h1 className="text-xl font-semibold tracking-tight text-black sm:text-3xl">
          Resin Calculator
        </h1>
      </header>

      <section className="space-y-4 sm:space-y-5">
        <p className="text-center text-sm text-black sm:text-lg">
          Please select an option
        </p>
        <OptionRow>
          {shapes.map((shape, index) => (
            <OptionToggle
              key={shape.id}
              label={shapeToggleLabel(shape)}
              selected={shapeId === shape.id}
              onClick={() => handleShapeSelect(shape.id)}
              withLeftBorder={index > 0}
            />
          ))}
        </OptionRow>
      </section>

      {showRatioStep && (
        <section className="space-y-4 sm:space-y-5">
          <p className="text-center text-sm leading-snug text-black sm:text-base">
            Which type of epoxy resin hardener are you using?
          </p>
          <OptionRow>
            {ratios.map((ratio, index) => (
              <OptionToggle
                key={ratio.id}
                label={formatRatioLabel(ratio)}
                selected={ratioId === ratio.id}
                onClick={() => handleRatioSelect(ratio.id)}
                withLeftBorder={index > 0}
              />
            ))}
          </OptionRow>
        </section>
      )}

      {showUnitStep && (
        <section className="space-y-4 sm:space-y-5">
          <p className="text-center text-sm leading-snug text-black sm:text-base">
            Select measurement unit
          </p>
          {filteredUnits.length === 0 ? (
            <p className="text-center text-sm text-neutral-500">
              No units available for this shape.
            </p>
          ) : (
            <OptionRow>
              {filteredUnits.map((unit, index) => (
                <OptionToggle
                  key={unit.id}
                  label={unit.title}
                  selected={unitId === unit.id}
                  onClick={() => handleUnitSelect(unit.id)}
                  withLeftBorder={index > 0}
                />
              ))}
            </OptionRow>
          )}
        </section>
      )}

      {showInputsStep && selectedShape && (
        <section className="w-full space-y-5 sm:space-y-6">
          <h2 className="text-left text-base font-medium text-black sm:text-lg">
            {selectedShape.title}
          </h2>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleCalculateClick();
              }}
            >
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={fieldLabelClass}>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        inputMode="decimal"
                        placeholder="0.00"
                        className={fieldInputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedShape.input_list.map((fieldDef) => (
                <FormField
                  key={fieldDef.parameter}
                  control={form.control}
                  name={`inputs.${fieldDef.parameter}` as `inputs.${string}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={fieldLabelClass}>
                        {getInputLabel(
                          fieldDef,
                          selectedShape.type,
                          selectedUnit,
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="any"
                          inputMode="decimal"
                          placeholder="0.00"
                          className={fieldInputClass}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-none bg-black text-sm font-medium text-white disabled:opacity-60 sm:h-14 sm:text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Calculating…
                  </>
                ) : (
                  'Calculate'
                )}
              </button>
            </form>
          </Form>
        </section>
      )}

      {(result || apiError) && (
        <section className="w-full space-y-4 border-t border-neutral-200 pt-8">
          <h2 className="text-left text-lg font-bold text-black">
            Total resin required
          </h2>
          {apiError && !result && (
            <p className="text-sm text-red-600">{apiError}</p>
          )}
          {result && (
            <div className="space-y-3 text-base">
              <p>
                <span className="font-semibold text-black">Resin:</span>{' '}
                {result.resin}
              </p>
              <p>
                <span className="font-semibold text-black">Hardener:</span>{' '}
                {result.hardener}
              </p>
              <p>
                <span className="font-semibold text-black">Cost:</span>{' '}
                {result.cost}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
