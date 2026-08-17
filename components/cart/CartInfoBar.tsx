import InfoBarBack from "@/components/common/InfoBarBack";

export default function CartInfoBar() {
  return (
    <div className="flex w-full items-center justify-between border bg-white p-2.5 shadow-sm md:mt-[-7px] lg:p-4">
      <div className="flex items-center gap-2 lg:gap-3">
        <InfoBarBack />
        <div>
          <h2 className="text-base font-semibold text-black lg:text-lg">
            Cart
          </h2>
        </div>
      </div>
    </div>
  );
}
