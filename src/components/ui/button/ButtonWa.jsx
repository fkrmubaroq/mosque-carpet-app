import { useApi, useButtonlick } from "@/lib/hooks";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { Button } from ".";

export default function ButtonWhatsapp({ phone }) {
  const ipAddress = useApi();
  const { trackButtonClick } = useButtonlick();
  return (
    <div className="fixed bottom-6 right-4 z-50 shadow-sm ">
      <Button
        className="flex !rounded-full !h-16 w-16 items-center justify-center !bg-[#25d366]"
        onClick={() => {
          if (phone && ipAddress) {
            trackButtonClick(ipAddress);
            window.open(`https://wa.me/${phone}`)
          }
        }}
      >
        <AiOutlineWhatsApp size={30} />
      </Button>
    </div>
  );
}