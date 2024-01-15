import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "../../button";
import ContainerInput from "../../container/ContainerInput";
import Checkbox from "../../form/Checkbox";
import { Input } from "../../form/input";
import { Modal, ModalBody, ModalHeader } from "../../modal";

export default function ModalLink({ data, title, show, onHide, onApply }) {
  const [form, setForm] = useState(data);

  const onChange = (e) => setForm(form => ({ ...form, [e.target.name]: e.target.value }));

  return <Modal verticallyCentered className="w-[450px]" show={show} onHide={onHide}>
    <ModalHeader onHide={onHide}>{title}</ModalHeader>
    <ModalBody className="flex flex-col gap-y-3">
      <ContainerInput>
        <Label className="text-xs">Link</Label>
        <Input placeholder="Masukan Link URL" name="link" value={form.link} onChange={onChange} />
      </ContainerInput>
      <Checkbox text={<span className="text-gray-500 text-xs">Buka Tab baru</span>} checked={form.newTab} onChange={() => setForm(form => ({ ...form, newTab:!form.newTab }))}/>
      <Button className="w-full mt-3" disabled={!form.link} onClick={() => onApply(form)}>Terapkan</Button>

    </ModalBody>
  </Modal>
}