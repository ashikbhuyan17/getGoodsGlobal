/** UI copy aligned with Resin Calculator.xlsx (EN + BN). */

export const resinCalculatorCopy = {
  title: 'Resin Calculator',
  subtitleEn: 'Calculate the required amount of Resin & Hardener',
  subtitleBn: 'প্রয়োজনীয় রেজিন ও হার্ডেনারের পরিমাণ নির্ণয় করুন',
  selectShapeEn: 'Please select a shape',
  selectShapeBn: 'অনুগ্রহ করে একটি শেপ নির্বাচন করুন',
  ratioQuestionEn: 'Which resin ratio system are you using?',
  ratioQuestionBn: 'আপনি কোন রেজিন রেশিও সিস্টেম ব্যবহার করছেন?',
  measurementUnitEn: 'Measurement Unit',
  measurementUnitBn: 'পরিমাপের একক (ইঞ্চি/সেমি)',
  measurementUnitPlaceholderEn: 'Select measurement unit',
  measurementUnitPlaceholderBn: 'পরিমাপের একক নির্বাচন করুন',
  coatingThicknessEn: 'Recommended Resin Coating Thickness:',
  coatingThicknessSub: 'Per Coating—1.5mm',
  optional: 'Optional',
  priceEn: 'What is the price of a 1,000g (1 kg) resin set?',
  priceBn: '১,০০০ গ্রাম (১ কেজি) রেজিন সেটের মূল্য কত?',
  calculateEn: 'Calculate',
  calculateBn: 'ক্যালকুলেট করুন',
  resultCardEn: 'Result Card',
  resultCardBn: 'ফলাফল প্রদর্শন',
  recalculateEn: 'Recalculate',
  recalculateBn: 'পুনরায় হিসাব করুন',
  resinLabel: 'Resin (A)',
  hardenerLabel: 'Hardener (B)',
  estimatedCostEn: 'Estimated Cost',
  totalRequiredEn: 'Total Resin+Hardener Required',
  customInputLabel: 'Water weight in gm',
} as const;

export function shapeDisplayTitle(type: string, apiTitle: string): string {
  if (type === 'rectangle') return 'Rectangle/Square';
  if (type === 'circle') return 'Circle';
  if (type === 'custom') return 'Custom / Irregular Mold';
  return apiTitle;
}

export function shapeSectionHeading(type: string): { en: string; bn?: string } {
  switch (type) {
    case 'rectangle':
      return {
        en: 'For Rectangle/ Square shape:',
        bn:
          'মোল্ড/অবজেক্টের অভ্যন্তরে রেজিন ধারণের জন্য মোট কতটুকু জায়গা রয়েছে।',
      };
    case 'circle':
      return { en: 'Circle shape:' };
    case 'custom':
      return { en: '' };
    default:
      return { en: '' };
  }
}
