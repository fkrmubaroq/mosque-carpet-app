import { useMemo } from "react";
import { FaFolder } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

export default function PathFile({ segment, appendArrow, onSelect }) {
  const folder = useMemo(() => segment?.split("/")?.slice(0, -1)?.pop(), []);
  return (
    <div className="flex items-center gap-x-3 ">
      <span
        className="cursor-pointer rounded-md p-3 font-semibold hover:bg-gray-200"
        onClick={() => {
          onSelect(segment)
        }}
      >
        {segment === "/" ? <FaFolder size={20} /> : folder}
      </span>
      {appendArrow && <IoIosArrowForward size={18} />}
    </div>
  );
}