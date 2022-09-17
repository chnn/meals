import type { ReactNode } from "react";

export const Heading = ({
  level,
  children,
  className = "",
}: {
  level: 1 | 2 | 3;
  className?: string;
  children: ReactNode;
}) => {
  switch (level) {
    case 1:
      return <h1 className={`text-xxl mb-6 ${className}`}>{children}</h1>;
    case 2:
      return <h2 className={`text-xl mb-4 ${className}`}>{children}</h2>;
    case 3:
      return <h3 className={`text-lg mb-2 ${className}`}>{children}</h3>;
    default:
      throw new Error(`Heading for level ${level} not implemented`);
  }
};
