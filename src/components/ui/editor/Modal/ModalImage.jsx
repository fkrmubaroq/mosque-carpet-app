import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "../../button";
import ContainerInput from "../../container/ContainerInput";
import { Input } from "../../form/input";
import { Modal, ModalBody, ModalHeader } from "../../modal";

export default function ModalImage({ data, title, show, onHide, onApply }) {
  const [form, setForm] = useState(data);

  const onChange = (e) => setForm(form => ({ ...form, [e.target.name]: e.target.value }));

  return <Modal show={show} onHide={onHide}>
    <ModalHeader onHide={onHide}>{title}</ModalHeader>
    <ModalBody className="flex flex-col gap-y-3">
      <ContainerInput>
        <Label className="text-xs">Gambar URL</Label>
        <Input placeholder="Masukan URL" name="src" value={form.src} onChange={onChange} />
      </ContainerInput>
      <Button className="w-full mt-3" disabled={!form.src} onClick={() => onApply(form)}>Terapkan</Button>

    </ModalBody>
  </Modal>
}