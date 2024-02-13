import Image from "next/image";
import { IoIosClose } from "react-icons/io";

export default function Banner({ src, redirectTo, onClose, }) {
  return <div className="absolute justify-center flex items-center inset-0 z-[999999]">
    <div className="bg-black/60 inset-0 fixed"></div>
    <div className="text-white z-[99999] fixed ">
      <div
        onClick={() => redirectTo && window.open(redirectTo)}
      >
        <div className="relative px-4 max-w-[800px] h-[400px]">
          <Image src={src} alt=""
            width={500}
            height={300}
            layout="responsive"
            className="!max-h-[500px] object-contain"
          />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClose && onClose();
          }}
          className="absolute right-1 cursor-pointer hover:bg-gray-300/90 -top-3 bg-gray-200 rounded-full">
          <IoIosClose color="black" size={30} />
        </div>
      </div>
    </div>
  </div>
}