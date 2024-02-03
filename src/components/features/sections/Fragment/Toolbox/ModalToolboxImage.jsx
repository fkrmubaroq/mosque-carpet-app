import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import SrcFileManager from "@/components/ui/form/input/SrcFileManager";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function ModalToolboxImage({ name, value, onHide, show, onUpdateContent }) {
  const [currentValue, setCurrentValue] = useState(value);

  return <Modal verticallyCentered className="w-[450px]" show={show} onHide={() => onHide && onHide()}>
    <ModalHeader onHide={() => onHide && onHide()}>Ganti Gambar</ModalHeader>
    <ModalBody>
      <ContainerInput>
        <Label>Link Gambar</Label>
        <SrcFileManager
          single
          onSave={setCurrentValue}
          values={currentValue}
          onRemoveFile={() => setCurrentValue("")}
        />
      </ContainerInput>
      <Button
        className="w-full mt-3"
        onClick={() => {
          onUpdateContent(name, currentValue);
        }}
      >
        Simpan
      </Button>
    </ModalBody>
  </Modal>
}