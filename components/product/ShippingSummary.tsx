import { Badge } from "@/components/ui/badge";

export default function ShippingSummary() {
  return (
    <div className="border border-dashed border-[#2F9FC7] rounded-xl p-4 mt-3">
      <div className="mb-2 -ml-1">
        <Badge variant="destructive" className="text-base">
          Approximate weight: 1.81kg
        </Badge>
      </div>
      <div>
        <p className="text-lg font-semibold">শিপিং চার্জ</p>
        <div className="flex justify-between mt-1">
          <p className="text-[#167389] text-sm">৳750 / ৳1150 Per Kg</p>
          <span className="text-[#167389] text-sm font-semibold cursor-pointer">
            বিস্তারিত
          </span>
        </div>
      </div>
      <p className="text-sm text-[#E4004B] mt-2">
        *** উল্লেখিত পণ্যের ওজন সম্পূর্ণ সঠিক নয়, আনুমানিক মাত্র। বাংলাদেশে
        আসার পর পণ্যটির প্রকৃত ওজন মেপে শিপিং চার্জ হিসাব করা হবে।
      </p>
    </div>
  );
}
