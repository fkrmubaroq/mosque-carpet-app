import cn from "classnames";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React from "react";
type PropsPagination = {
  className?: string;
  position?: Position;
  currentPage: number;
  lastPage: boolean;
  onPrev: (number: number) => void;
  onNext: (number: number) => void;
};
const variantPosition = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};
type Position = keyof typeof variantPosition;

export default function Pagination({
  currentPage = 1,
  className,
  position = "left",
  onPrev,
  onNext,
  lastPage,
}: PropsPagination) {
  return (
    <nav className={cn(className, "flex", variantPosition[position])}>
      <ul className="inline-flex items-center -space-x-px">
        <ButtonPaginate
          disabled={currentPage == 1}
          arrow="left"
          onClick={() => currentPage > 1 && onPrev(-1)}
        />
        <li
          className={cn(
            " bg-white px-4 text-gray-500 hover:bg-gray-100 hover:text-gray-700",
            "ml-0 block h-10 leading-tight",
            "flex items-center justify-center"
          )}
        >
          {currentPage}
        </li>

        <ButtonPaginate
          disabled={lastPage}
          arrow="right"
          onClick={() => onNext(1)}
        />
      </ul>
    </nav>
  );
}

type PropsButtonPaginate = {
  arrow: "left" | "right";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
};
function ButtonPaginate({ disabled, arrow, onClick }: PropsButtonPaginate) {
  return (
    <li
      onClick={(e) => {
        if (disabled) return;
        onClick && onClick(e);
      }}
      className={cn(
        "h-10 w-10",
        "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        "ml-0 block leading-tight",
        "flex items-center justify-center",
        {
          "rounded-l-md": arrow === "left",
          "rounded-r-md": arrow === "right",
          "opacity-50": disabled,
          "cursor-pointer": !disabled,
        }
      )}
    >
      {arrow === "left" ? <IoIosArrowBack size={20}/> : <IoIosArrowForward size={20}/>}
    </li>
  );
}
