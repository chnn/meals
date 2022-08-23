export function Amount({
  quantity,
  units,
}: {
  quantity: number | null;
  units: string | null;
}) {
  if (!quantity) {
    return null;
  }

  const isDecimal = Math.round(quantity) !== quantity;

  if (isDecimal && units) {
    return (
      <span>
        {quantity.toFixed(2).replace(/0+$/, "")} {units}
      </span>
    );
  }

  if (units) {
    return (
      <span>
        {quantity} {units}
      </span>
    );
  }

  return <span>{quantity}</span>;
}
