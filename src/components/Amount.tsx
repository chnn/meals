export function Amount({
  quantity,
  units,
}: {
  quantity: number | null;
  units: string | null;
}) {
  return <>{quantity ? `${quantity}${units ? ` ${units}` : ""} ` : ""}</>;
}
