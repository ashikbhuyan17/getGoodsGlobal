import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CartEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md border-2 border-dashed border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          
          <p className="text-sm text-gray-600 mb-8 max-w-sm">
            Looks like you haven't added anything yet. Start shopping to add items to your cart!
          </p>
          
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
