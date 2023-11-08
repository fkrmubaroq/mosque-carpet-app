import { Input } from ".";
import { FiSearch } from "react-icons/fi";

export default function SearchInput({ placeholder }: React.ComponentPropsWithoutRef<"input">) {
  return (
    <div className="relative">
      <Input
        placeholder={placeholder ? placeholder : "Search"}
        className="!h-11 w-96"
      />
      <div className="absolute right-3 top-3.5">
        <FiSearch color="#9ca3af" />
      </div>
    </div>
  );
}