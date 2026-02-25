import { Card, CardContent } from '@/components/ui/card';

export default function ProductCardSkeleton() {
  return (
    <Card className="max-w-72 p-0 rounded-xl overflow-hidden shadow-none border border-gray-200">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-gray-200 animate-pulse w-full" />
        <div className="mt-1 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
