import { AiOutlineWhatsApp } from "react-icons/ai";
import { Button } from ".";

export default function ButtonWhatsapp() {
  return (
    <div className="fixed bottom-6 right-4 z-50 shadow-sm ">
      <Button className="flex rounded-full !h-16 w-16 items-center justify-center bg-[#25d366]">
        <AiOutlineWhatsApp size={30} />
      </Button>
    </div>
  );
}