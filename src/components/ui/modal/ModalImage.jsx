import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function ModalImage({ gallery, src, alt, onHide }) {
  const [activeImage, setActiveImage] = useState(src);

  return <div className="fixed flex justify-center items-start inset-0 z-[999999]">
    <div className="fixed inset-0 bg-black opacity-90"></div>
    <div className="absolute right-4 cursor-pointer top-4" onClick={() => onHide()}>
      <IoMdClose size={40} color="white" />
    </div>
    <div className="flex flex-col justify-center items-center relative mt-20 mx-10 w-full h-[500px]">
      <Image src={activeImage} layout="fill" alt={alt || ""} className="rounded-xl" objectFit="contain" />
      <div className="flex gap-x-3 fixed bottom-5 overflow-auto">
        {gallery?.map((image, key) =>
          <div key={key} className={cn("shrink-0 cursor-pointer", { "opacity-50": activeImage !== image })} onClick={() => setActiveImage(image)}>
            <Image key={key} src={image} width={200} height={100} alt={alt || ""} className="rounded-xl" objectFit="cover" />
          </div>
        )}
      </div>
    </div>
  </div>
}