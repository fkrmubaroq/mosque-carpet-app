import { FiTrash2 } from "react-icons/fi";
import { Button } from ".";

export default function ButtonDelete() {
  return (
    <Button
      className="text-6b7280 flex items-center justify-center gap-x-2 hover:text-white hover:bg-red-500"
      variant="ghost"
    >
      <FiTrash2 />
      <span>Hapus</span>
    </Button>
  );
}
