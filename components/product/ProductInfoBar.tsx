import { Star } from 'lucide-react';
import InfoBarBack from '../common/InfoBarBack';
import ProductInfoBarShareButtons from './ProductInfoBarShareButtons';

export default async function ProductInfoBar({
  product,
  slug,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  slug: string;
}) {
  const p = product?.data?.product;

  return (
    <div className="flex items-center justify-between border p-3 bg-white shadow-sm w-full md:mt-[-7px]">
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <InfoBarBack />
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-black truncate">{p?.name}</h2>

          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-black">5/5</span>
          </div>
        </div>
      </div>

      {/* Right Section – Share buttons */}
      <div className="flex items-center shrink-0 lg:pr-10">
        <ProductInfoBarShareButtons slug={slug} />
      </div>
    </div>
  );
}
