import cn from "classnames";
import { IoChevronBackOutline } from "react-icons/io5";
import { Button } from ".";

export default function ButtonBack({
  onClick,
  className,
  text
}) {
  return (
    <Button variant="ghost" onClick={onClick} className={cn("flex cursor-pointer items-center gap-x-2", className)}>
      <IoChevronBackOutline size={20} />
      <span className="text-gray-600">{text ? text : "Kembali"}</span>
    </Button>
  );
}
