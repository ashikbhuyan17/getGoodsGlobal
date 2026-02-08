import InfoBarBack from "@/components/common/InfoBarBack";

export default function CartInfoBar() {
  return (
    <div className="flex items-center justify-between border p-4 bg-white shadow-sm w-full md:mt-[-7px]">
      <div className="flex items-center gap-3">
        <InfoBarBack />
        <div>
          <h2 className="text-lg font-semibold text-black">
            Cart
          </h2>
        </div>
      </div>
    </div>
  );
}
