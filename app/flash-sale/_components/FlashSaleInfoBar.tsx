import InfoBarBack from '@/components/common/InfoBarBack';

export default function FlashSaleInfoBar() {
  return (
    <div className="flex w-full items-center justify-between border bg-white p-3 shadow-sm md:mt-[-7px]">
      <div className="flex items-center gap-3">
        <InfoBarBack />
        <div>
          <h1 className="text-xl font-semibold text-primary">Flash Sale</h1>
          <p className="text-xs font-medium text-orange-500 sm:text-sm">
            On Sale Now
          </p>
        </div>
      </div>
    </div>
  );
}
