'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import {
  resinCalculatorCopy,
  shapeDisplayTitle,
  shapeSectionHeading,
} from '@/lib/resin-calculator-copy';
import {
  type MeasurementUnit,
  type ResinCalculatorResult,
  type ResinRatio,
  type ResinShape,
  filterActiveUnits,
  formatRatioLabel,
  getCoatingThicknessSubline,
  getInputLabel,
  parseCalculatorResult,
  roundResultDisplay,
} from '@/lib/resin-calculator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

function OptionRow({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-wrap gap-2 sm:gap-3">{children}</div>;
}

function OptionToggle({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-9 flex-1 basis-[calc(50%-0.25rem)] rounded-lg border px-2 py-1.5 text-center text-sm font-semibold leading-tight tracking-tight transition-all duration-200 sm:min-h-10 sm:basis-auto sm:px-3 sm:py-2 sm:text-base',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
          : 'border-gray-300 bg-white text-gray-900 shadow-sm hover:border-primary/50 hover:bg-teal-50 hover:text-primary',
      )}
    >
      {label}
    </button>
  );
}

/** Match OptionToggle (shape/ratio) height, type, and border */
const controlFieldClass =
  'h-9 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900 shadow-sm transition-colors duration-200 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 sm:h-10 sm:text-base';

const fieldLabelClass = 'text-sm font-semibold text-gray-900 sm:text-base';

function CoatingThicknessHint({ subline }: { subline: string }) {
  return (
    <div
      className="rounded-lg border border-primary/15 bg-gradient-to-br from-teal-50/80 to-white px-3 py-2.5 sm:px-4 sm:py-3"
      role="note"
    >
      <p className="text-sm font-semibold text-gray-800">
        {resinCalculatorCopy.coatingThicknessEn}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{subline}</p>
    </div>
  );
}

function ResultMetricCard({
  label,
  value,
  suffix = '',
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-teal-50/60 to-white px-4 py-4 text-center transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums text-primary sm:text-2xl">
        {value}
        {suffix}
      </p>
    </div>
  );
}

function BilingualPrompt({
  en,
  bn,
  className,
}: {
  en: string;
  bn?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1 text-center', className)}>
      <p className="text-sm font-medium text-gray-800 sm:text-base">{en}</p>
      {bn ? (
        <p className="text-xs text-muted-foreground sm:text-sm">{bn}</p>
      ) : null}
    </div>
  );
}

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
  const calculatorTopRef = useRef<HTMLElement>(null);
  const pendingScrollToTopRef = useRef(false);

  /** Fixed site header (60px) + back bar + spacing */
  const scrollToCalculatorTitle = () => {
    const el = calculatorTopRef.current;
    if (!el) return;
    const offset = 140;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

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

  const selectedRatio = useMemo(
    () => ratios.find((r) => r.id === ratioId) ?? null,
    [ratios, ratioId],
  );

  const showRatioStep = shapeId != null;
  const showUnitStep = showRatioStep && ratioId != null;
  const showInputsStep = showUnitStep && unitId != null;

  const schema = useMemo(
    () =>
      buildResinCalculatorSchema(selectedShape?.input_list ?? [], {
        shapeType: selectedShape?.type,
        customInputLabel: resinCalculatorCopy.customInputLabel,
      }),
    [selectedShape?.input_list, selectedShape?.type],
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

  useEffect(() => {
    if (unitId == null) return;
    if (!filteredUnits.some((u) => u.id === unitId)) {
      setUnitId(null);
    }
  }, [filteredUnits, unitId]);

  useEffect(() => {
    if (!pendingScrollToTopRef.current || result !== null) return;
    pendingScrollToTopRef.current = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToCalculatorTitle();
      });
    });
  }, [result]);

  const handleShapeSelect = (id: number) => {
    setShapeId(id);
    setRatioId(null);
    setUnitId(null);
    setResult(null);
    setApiError(null);
  };

  const handleRatioSelect = (id: number) => {
    if (id === ratioId) return;
    setRatioId(id);
    setUnitId(null);
    setResult(null);
    setApiError(null);
  };

  const handleUnitSelect = (value: string) => {
    const id = Number(value);
    if (!Number.isFinite(id)) return;
    setUnitId(id);
    setResult(null);
    setApiError(null);
  };

  const handleRecalculate = () => {
    setResult(null);
    setApiError(null);
    pendingScrollToTopRef.current = true;
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
            price: values.price.trim() === '' ? 0 : Number(values.price),
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
    return <p className="text-center text-sm text-red-600">{bootstrapError}</p>;
  }

  return (
    <div
      className={cn(
        'mx-auto w-full px-3 py-6',
        'sm:px-4 sm:py-8',
        'md:max-w-3xl md:px-6',
        'lg:w-[58vw] lg:max-w-4xl lg:px-0 lg:py-10',
        'xl:w-[62vw] xl:max-w-5xl',
      )}
    >
      <div className="space-y-8 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:space-y-10 sm:p-6 md:p-8">
        <header
          ref={calculatorTopRef}
          className="scroll-mt-[140px] space-y-2 text-center"
        >
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {resinCalculatorCopy.title}
          </h1>
          <BilingualPrompt
            en={resinCalculatorCopy.subtitleEn}
            bn={resinCalculatorCopy.subtitleBn}
          />
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-primary" />
        </header>

        <section className="space-y-4 sm:space-y-5">
          <BilingualPrompt
            en={resinCalculatorCopy.selectShapeEn}
            bn={resinCalculatorCopy.selectShapeBn}
          />
          <OptionRow>
            {shapes.map((shape) => (
              <OptionToggle
                key={shape.id}
                label={shapeDisplayTitle(shape.type, shape.title)}
                selected={shapeId === shape.id}
                onClick={() => handleShapeSelect(shape.id)}
              />
            ))}
          </OptionRow>
        </section>

        {showRatioStep && (
          <section className="animate-in fade-in space-y-4 duration-300 sm:space-y-5">
            <BilingualPrompt
              en={resinCalculatorCopy.ratioQuestionEn}
              bn={resinCalculatorCopy.ratioQuestionBn}
            />
            <OptionRow>
              {ratios.map((ratio) => (
                <OptionToggle
                  key={ratio.id}
                  label={formatRatioLabel(ratio)}
                  selected={ratioId === ratio.id}
                  onClick={() => handleRatioSelect(ratio.id)}
                />
              ))}
            </OptionRow>
          </section>
        )}

        {showUnitStep && (
          <Form {...form}>
            <form
              className="space-y-8 sm:space-y-10"
              onSubmit={(e) => {
                e.preventDefault();
                handleCalculateClick();
              }}
            >
              <section className="animate-in fade-in space-y-4 duration-300 sm:space-y-5">
                <div className="space-y-2">
                  <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {resinCalculatorCopy.optional}
                  </span>
                  <BilingualPrompt
                    className="text-left"
                    en={resinCalculatorCopy.priceEn}
                    bn={resinCalculatorCopy.priceBn}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">
                        {resinCalculatorCopy.priceEn}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="any"
                          inputMode="decimal"
                          placeholder="0.00"
                          className={controlFieldClass}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="animate-in fade-in space-y-4 duration-300 sm:space-y-5">
                <BilingualPrompt
                  en={resinCalculatorCopy.measurementUnitEn}
                  bn={resinCalculatorCopy.measurementUnitBn}
                />
                {filteredUnits.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    No units available for this shape.
                  </p>
                ) : (
                  <Select
                    key={`measurement-unit-${shapeId ?? 0}-${ratioId ?? 0}`}
                    value={
                      unitId != null && filteredUnits.some((u) => u.id === unitId)
                        ? String(unitId)
                        : ''
                    }
                    onValueChange={handleUnitSelect}
                  >
                    <SelectTrigger
                      className={cn(
                        controlFieldClass,
                        'w-full data-[placeholder]:text-muted-foreground',
                      )}
                    >
                      <span className="flex min-w-0 flex-1 items-center truncate">
                        <SelectValue
                          placeholder={
                            resinCalculatorCopy.measurementUnitPlaceholderEn
                          }
                        />
                        {unitId == null ? (
                          <span className="hidden shrink-0 text-muted-foreground sm:inline">
                            {' '}
                            ({resinCalculatorCopy.measurementUnitPlaceholderBn})
                          </span>
                        ) : null}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {filteredUnits.map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          {unit.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </section>

              {showInputsStep && selectedShape && (
                <section className="animate-in fade-in w-full space-y-4 sm:space-y-5">
                  {(() => {
                    const heading = shapeSectionHeading(selectedShape.type);
                    return heading.en ? (
                      <div className="space-y-1 border-b border-gray-100 pb-3 text-left">
                        <h2 className="text-base font-semibold text-primary sm:text-lg">
                          {heading.en}
                        </h2>
                        {heading.bn ? (
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            ({heading.bn})
                          </p>
                        ) : null}
                      </div>
                    ) : null;
                  })()}

                  {selectedShape.input_list.map((fieldDef) => {
                    const isThickness = fieldDef.mm === 1;
                    return (
                      <FormField
                        key={fieldDef.parameter}
                        control={form.control}
                        name={
                          `inputs.${fieldDef.parameter}` as `inputs.${string}`
                        }
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className={fieldLabelClass}>
                              {isThickness
                                ? fieldDef.title
                                : getInputLabel(
                                    fieldDef,
                                    selectedShape.type,
                                    selectedUnit,
                                    resinCalculatorCopy.customInputLabel,
                                  )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step="any"
                                inputMode="decimal"
                                placeholder={isThickness ? '1.5' : '0.00'}
                                className={controlFieldClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            {isThickness ? (
                              <CoatingThicknessHint
                                subline={getCoatingThicknessSubline(
                                  selectedUnit,
                                  resinCalculatorCopy.coatingThicknessSub,
                                )}
                              />
                            ) : null}
                          </FormItem>
                        )}
                      />
                    );
                  })}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:opacity-60 sm:min-h-10 sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Calculating…
                      </>
                    ) : (
                      <span className="flex flex-col leading-tight">
                        <span>{resinCalculatorCopy.calculateEn}</span>
                        <span className="text-xs font-normal opacity-90">
                          ({resinCalculatorCopy.calculateBn})
                        </span>
                      </span>
                    )}
                  </button>
                </section>
              )}
            </form>
          </Form>
        )}

        {(result || apiError) && (
          <section className="animate-in fade-in w-full space-y-4 border-t border-gray-100 pt-8">
            <BilingualPrompt
              className="text-left sm:text-center"
              en={resinCalculatorCopy.resultCardEn}
              bn={resinCalculatorCopy.resultCardBn}
            />
            {apiError && !result && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {apiError}
              </p>
            )}
            {result && selectedRatio && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultMetricCard
                    label={`${resinCalculatorCopy.totalRequiredEn} (${formatRatioLabel(selectedRatio)})`}
                    value={String(
                      roundResultDisplay(result.resin + result.hardener),
                    )}
                    suffix="g"
                  />
                  <ResultMetricCard
                    label={resinCalculatorCopy.estimatedCostEn}
                    value={String(roundResultDisplay(result.cost))}
                  />
                  <ResultMetricCard
                    label={resinCalculatorCopy.resinLabel}
                    value={String(roundResultDisplay(result.resin))}
                    suffix="g"
                  />
                  <ResultMetricCard
                    label={resinCalculatorCopy.hardenerLabel}
                    value={String(roundResultDisplay(result.hardener))}
                    suffix="g"
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground sm:text-sm">
                  {result.wastageNote}
                </p>
                <button
                  type="button"
                  onClick={handleRecalculate}
                  className="flex h-11 w-full items-center justify-center rounded-lg border border-primary bg-white text-sm font-semibold text-primary transition-all duration-200 hover:bg-teal-50/80 sm:h-12"
                >
                  <span className="flex flex-col leading-tight">
                    <span>{resinCalculatorCopy.recalculateEn}</span>
                    <span className="text-xs font-normal">
                      ({resinCalculatorCopy.recalculateBn})
                    </span>
                  </span>
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
