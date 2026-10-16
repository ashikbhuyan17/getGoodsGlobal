import { z } from 'zod';

const positiveNumberString = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((value) => {
      const n = Number(value);
      return Number.isFinite(n) && n > 0;
    }, `Enter a valid ${label.toLowerCase()} greater than 0`);

const optionalPositivePriceString = z
  .string()
  .refine((value) => {
    if (value.trim() === '') return true;
    const n = Number(value);
    return Number.isFinite(n) && n >= 0;
  }, 'Enter a valid price');

export function buildResinCalculatorSchema(
  fields: { parameter: string; title: string }[],
) {
  const inputShape: Record<string, z.ZodString> = {};
  for (const field of fields) {
    inputShape[field.parameter] = positiveNumberString(field.title);
  }

  return z.object({
    price: optionalPositivePriceString,
    inputs: z.object(inputShape),
  });
}

export type ResinCalculatorFormValues = {
  price: string;
  inputs: Record<string, string>;
};
