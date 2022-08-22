export function Badge({
  className = "",
  children,
}: {
  className?: string;
  children: string | JSX.Element | JSX.Element[];
}) {
  return (
    <div
      className={`rounded-sm bg-blue-100 text-zinc-700 flex items-center p-1 ${className}`}
    >
      {children}
    </div>
  );
}
