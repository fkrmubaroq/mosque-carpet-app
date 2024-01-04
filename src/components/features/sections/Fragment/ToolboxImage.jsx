import cn from "classnames";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import ModalToolboxImage from "./ModalToolboxImage";

const itemToolboxList = [
  {
    icon: <CiImageOn size={20} />,
    text: "Ganti Gambar"
  }
]
const initModal = Object.freeze({
  show: false,
  type: ""
})
export default function ToolboxImage({ className, onUpdateContent }) {
  const [modal, setModal] = useState(initModal);

  const onClickUpdateImage = () => {
    setModal({
      type: "update-image",
      show: true
    })
  }
  
  return <>
    <ModalToolboxImage
      show={modal.show}
      onHide={() => setModal(initModal)}
      onUpdateContent={(name, value) => {
        setModal(initModal);
        onUpdateContent(name, value);
      }}
      
    />
    <div className={cn("absolute left-1/2 z-[999] top-1/2 -translate-x-1/2 -translate-y-1/2 p-2", className)}>
      <div className="bg-white shadow-lg rounded-md flex gap-x-2">
        {itemToolboxList?.map((item, key) => <ItemBox
          key={key}
          icon={item.icon}
          text={item.text}
          onClick={onClickUpdateImage}
        />)}
      </div>
    </div>
  </>
}

function ItemBox({ icon, text, onClick }) {
  return <div className="flex items-center gap-x-2 p-2 cursor-pointer hover:rounded-md hover:bg-blue-600 hover:text-white" onClick={() => onClick()}>
    <div className="shrink-0">{icon}</div>
    <span className="text-xs">{text}</span>
  </div>

}