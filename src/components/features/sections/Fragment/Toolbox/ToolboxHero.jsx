import cn from "classnames";
import { useState } from "react";
import { LuPencil } from "react-icons/lu";
import ItemBox from "./ItemBox";
import ModalToolboxFooter from "./ModalToolboxFooter";
const initModal = Object.freeze({
  show: false,
})
export default function ToolboxHero({ className, data, onUpdateContent }) {
  const [modal, setModal] = useState(initModal);
  return <>
    {modal.show &&
      <ModalToolboxFooter
        title="Ganti Menu link"
        data={modal?.data}
        show={modal.show}
        onHide={() => setModal(initModal)}
        verticallyCentered className="w-[450px]"
        onUpdateContent={(form) => {
          onUpdateContent(form);
          setModal(initModal)
        }}
      />
    }
    <div className={cn("absolute -right-8 top-0 z-20", className)}>
      <div className="bg-primary h-9 hover:bg-primary-hover shadow-lg group rounded-r-md flex gap-x-2">
        <ItemBox
          icon={<LuPencil color="white" size={17} />}
          text=""
          onClick={() => {
            setModal({ show: true, data })
          }}
        />
      </div>
    </div>
  </>
}