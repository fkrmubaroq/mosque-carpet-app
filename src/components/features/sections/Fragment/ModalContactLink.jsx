import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function ModalContactLink({ show, onHide, data, onUpdateContent }) {
  const [currentValue, setCurrentValue] = useState(data);

  return <Modal verticallyCentered className="w-[450px]" onHide={onHide} show={show}> 
    <ModalHeader onHide={onHide}>Ganti Link Kontak</ModalHeader>
    <ModalBody>
      <ContainerInput>
        <Label>Link Kontak</Label>
        <Input
          value={currentValue}
          placeholder="Masukkan Contact Lonk"
          onChange={(e) => setCurrentValue(e.target.value)}
        />
      </ContainerInput>
      <Button
        className="w-full mt-3"
        onClick={() => {
          onUpdateContent("contact_link", currentValue);
        }}
      >
        Simpan
      </Button>
    </ModalBody>
  </Modal>
}