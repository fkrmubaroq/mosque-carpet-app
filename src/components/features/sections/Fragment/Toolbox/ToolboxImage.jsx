import cn from "classnames";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import ItemBox from "./ItemBox";
import ModalToolboxImage from "./ModalToolboxImage";

const initModal = Object.freeze({
  show: false,
  type: ""
});

const positionToolbox = {
  centered: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  bottomRight: "-bottom-0 -right-0"
}
export default function ToolboxImage({ text="Ganti", noText, position="centered", name, value, className, onUpdateContent }) {
  const [modal, setModal] = useState(initModal);

  const onClickUpdateImage = () => {
    setModal({
      type: "update-image",
      show: true
    })
  }
  
  return <>
    <ModalToolboxImage
      name={name}
      show={modal.show}
      onHide={() => setModal(initModal)}
      onUpdateContent={(name, value) => {
        setModal(initModal);
        onUpdateContent(name, value);
      }}
      value={value}
    />
    <div className={cn("absolute  z-[999] p-2", positionToolbox[position], className)}>
      <div className="bg-primary text-white hover:bg-primary-hover shadow-lg rounded-md flex gap-x-2">
        <ItemBox
          icon={<CiImageOn size={17} />}
          text={noText ? "" : text} 
          onClick={onClickUpdateImage}
        />
      </div>
    </div>
  </>
}