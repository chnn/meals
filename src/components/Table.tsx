// FIXME
/* eslint-disable react/display-name */

import classNames from "./Table.module.css";

type Children = JSX.Element | JSX.Element[] | string | number;

export const Table = ({ children }: { children?: Children }) => {
  return <table className="w-full table-fixed">{children}</table>;
};

Table.Header = ({ children }: { children?: Children }) => {
  return <thead className="">{children}</thead>;
};

Table.Body = ({ children }: { children?: Children }) => {
  return <tbody className="">{children}</tbody>;
};

Table.Footer = ({ children }: { children?: Children }) => {
  return <tfoot className="">{children}</tfoot>;
};

Table.Row = ({ children }: { children?: Children }) => {
  return <tr className="even:bg-slate-50">{children}</tr>;
};

Table.Th = ({
  children,
  className = "",
}: {
  children?: Children;
  className?: string;
}) => {
  return (
    <th
      className={`border-b border-zinc-300 font-medium py-1 px-3 first:pl-0 last:pr-0 text-left ${className}`}
    >
      {children}
    </th>
  );
};

Table.Td = ({
  children,
  className = "",
}: {
  children?: Children;
  className?: string;
}) => {
  return (
    <td
      className={`border-b border-zinc-100 py-1 px-3 first:pl-0 last:pr-0 text-left align-top ${className}`}
    >
      {children}
    </td>
  );
};
