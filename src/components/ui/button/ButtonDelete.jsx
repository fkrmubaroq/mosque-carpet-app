import { FiTrash2 } from "react-icons/fi";
import { Button } from ".";

export default function ButtonDelete({ variant="ghost" , onClick }) {
  return (
    <Button
      className="text-6b7280 flex items-center justify-center gap-x-2 hover:bg-red-500 hover:text-white"
      variant={variant}
      onClick={onClick}
    >
      <FiTrash2 />
      <span>Hapus</span>
    </Button>
  );
}
