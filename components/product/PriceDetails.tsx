export default function PriceDetails({
  quantity,
  price,
  shipping,
  bulkQuantities,
}: {
  quantity: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  price: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bulkQuantities?: any;
  shipping: number;
}) {
  let productPrice;

  if (bulkQuantities?.data?.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findPrice = bulkQuantities?.data?.find((bulk: any) => {
      return (
        Number(quantity) >= Number(bulk?.min_qty) &&
        Number(quantity) <= Number(bulk?.max_qty)
      );
    });
    if (findPrice) {
      productPrice = Number(findPrice?.price) * Number(quantity);
    } else {
      productPrice = price?.reduce(
        (total, item) =>
          Number(total) + Number(item.price) * Number(item.quantity),
        0
      );
    }
  } else {
    productPrice = price?.reduce(
      (total, item) =>
        Number(total) + Number(item.price) * Number(item.quantity),
      0
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100 my-4">
      <div className="flex justify-between py-1">
        <p>Quantity</p>
        <p>{quantity}</p>
      </div>
      <div className="flex justify-between py-1">
        <p>Product price</p>
        <p>৳{productPrice}</p>
      </div>
      <div className="flex justify-between py-1">
        <p>Subtotal</p>
        <p>৳{productPrice}</p>
      </div>
      {productPrice > 0 && (
        <div className="flex justify-between py-1">
          <p>Total</p>
          <p>৳{Number(productPrice) + Number(shipping)}</p>
        </div>
      )}
    </div>
  );
}
