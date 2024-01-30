import { HiOutlinePencilAlt } from "react-icons/hi";
import { Button } from ".";

export default function ButtonEdit({ variant="ghost", text, onClick }) {
  return (
    <Button
      className="flex items-center justify-center gap-x-2 hover:bg-gray-100"
      variant={variant}
      onClick={onClick}
    >
      <HiOutlinePencilAlt />
      {text ? text : <span>Ubah</span>}
    </Button>
  );
}
