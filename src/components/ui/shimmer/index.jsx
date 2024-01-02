import cn from "classnames";
import React from "react";
import { Td, Tr } from "../table";

export function Shimmer({ children, className }) {
  return <div className={cn("flex animate-pulse", className)}>{children}</div>;
}

export function Circle({
  className,
  width = "w-10",
  height = "h-10",
}) {
  return (
    <div
      className={cn("rounded-full bg-slate-200", width, height, className)}
    ></div>
  );
}

export function Line({ width = "w-full", height = "h-2" }) {
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
