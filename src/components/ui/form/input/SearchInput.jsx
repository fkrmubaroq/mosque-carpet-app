import cn from "classnames";
import { FiSearch } from "react-icons/fi";
import { Input } from ".";

export default function SearchInput({
  onChange,
  placeholder,
  name,
  value,
  className
}) {
  return (
    <div className="relative shrink-0">
      <Input
        placeholder={placeholder ? placeholder : "Search"}
        className={cn("!h-11", className)}
        name={name}
        value={value}
        onChange={onChange}
      />
      <div className="absolute right-3 top-3.5">
        <FiSearch color="#9ca3af" />
      </div>
    </div>
  );
}