import React from "react";
import cn from "classnames";
import { Td, Tr } from "../table";
type ShimmerProps = {
  children?: React.ReactNode;
  className?: string;
};
export function Shimmer({ children, className }: ShimmerProps) {
  return <div className={cn("flex animate-pulse", className)}>{children}</div>;
}

type SizeProps = {
  width?: string;
  height?: string;
};
export function Circle({
  className,
  width = "w-10",
  height = "h-10",
}: ShimmerProps & SizeProps) {
  return (
    <div
      className={cn("rounded-full bg-slate-200", width, height, className)}
    ></div>
  );
}

export function Line({ width = "w-full", height = "h-2" }: SizeProps) {
  return <div className={cn("h-2 rounded bg-slate-200", width, height)}></div>;
}

export function ShimmerTableRow({ colspan = 4 }) {
  return (
    <Tr>
      {Array(colspan)
        .fill(1)
        .map((item, key) => (
          <Td className="!border-none" key={key}>
            <Shimmer>
              <Line />
            </Shimmer>
          </Td>
        ))}
    </Tr>
  );
}
