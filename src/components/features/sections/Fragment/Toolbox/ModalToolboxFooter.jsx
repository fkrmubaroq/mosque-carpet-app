import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function ModalToolboxFooter({ title, data, onHide, show, onUpdateContent }) {
  const [form, setForm] = useState(data);
  return <Modal verticallyCentered className="w-[450px]" show={show} onHide={() => onHide && onHide()}>
    <ModalHeader onHide={() => onHide && onHide()}>{title || ""}</ModalHeader>
    <ModalBody className="flex flex-col gap-y-4">
      <ContainerInput>
        <Label className="text-sm font-medium">Text</Label>
        <Input
          placeholder="Masukkan teks"
          name="text"
          value={form?.text || ""}
          onChange={(e) => setForm(form => ({ ...form, [e.target.name]: e.target.value}))}
        />
      </ContainerInput>
      <ContainerInput>
        <Label className="text-sm font-medium">Link (optional)</Label>
        <Input
          value={form?.link || ""}
          placeholder="Masukkan link"
          name="link"
          onChange={(e) => setForm(form => ({ ...form, [e.target.name]: e.target.value }))}
        />
      </ContainerInput>
      <Button
        className="w-full mt-3"
        onClick={() => {
          onUpdateContent(form);
        }}
      >
        Simpan
      </Button>
    </ModalBody>
  </Modal>
}