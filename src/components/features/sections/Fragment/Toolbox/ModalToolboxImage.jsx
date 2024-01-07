import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
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
        <Input
          value={currentValue}
          placeholder="Masukkan link gambar"
          onChange={(e) => setCurrentValue(e.target.value)}
        />
      </ContainerInput>
      <span className="text-gray-500 text-xs">Upload Gambar anda <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => window.open("/admin/file-manager")}>disini</span></span>
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