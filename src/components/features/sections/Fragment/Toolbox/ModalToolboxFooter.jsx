import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function ModalToolboxFooter({ formImage, title, data, onHide, show, onUpdateContent }) {
  const [form, setForm] = useState(data);
  const onChange = (e) => setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  return <Modal verticallyCentered size={formImage ? "w-[500px]" : "w-[450px]"} show={show} onHide={() => onHide && onHide()}>
    <ModalHeader onHide={() => onHide && onHide()}>{title || ""}</ModalHeader>
    <ModalBody >
        <div className="flex flex-col gap-y-4 w-full">
          {
            formImage && <div>
            <ContainerInput>
              <Label className="text-sm font-medium">Gambar</Label>
              <Input
                placeholder="Masukkan URL Gambar"
                name="image"
                value={form?.image || ""}
                onChange={onChange}
              />
            </ContainerInput>
            <span className="text-gray-500 text-xs">Upload Gambar anda <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => window.open("/admin/file-manager")}>disini</span></span>
          </div>
          }
          <ContainerInput>
            <Label className="text-sm font-medium">Text</Label>
            <Input
              placeholder="Masukkan teks"
              name="text"
              value={form?.text || ""}
              onChange={onChange}
            />
          </ContainerInput>
          <ContainerInput>
            <Label className="text-sm font-medium">Link (optional)</Label>
            <Input
              value={form?.link || ""}
              placeholder="Masukkan link"
              name="link"
              onChange={onChange}
            />
          </ContainerInput>
        </div>
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