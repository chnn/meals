export function Amount({
  quantity,
  units,
}: {
  quantity: number | null;
  units: string | null;
}) {
  return (
    <span>{quantity ? `${quantity}${units ? ` ${units}` : ""} ` : ""}</span>
  );
}
