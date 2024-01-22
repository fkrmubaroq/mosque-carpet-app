import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Form from "@/components/ui/form";
import UploadFile from "@/components/ui/form/UploadFile";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalBody,
  ModalHeader
} from "@/components/ui/modal";
import { MIME_TYPE_IMAGE } from "@/lib/constant";
import Image from "next/image";
import { useRef, useState } from "react";

const titleType = {
  add: "Tambah",
};

export default function ModalForm({
  onHide,
  type = "add",
  show,
  data,
  isLoading,
  onSave,
}) {
  const formRef = useRef(null);
  const [form, setForm] = useState(data);
  const [validated, setValidated] = useState(false);

  const onChange = (e) => {
    setForm((form) => ({
      ...form,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    const valid = formRef.current?.checkValidity();
    setValidated(true);
    if (!valid) return;

    setValidated(false);
    if (!form.image?.name) {
      delete form.image;
    }
    onSave(form);
  };
  return (
    <Modal show={show} size="md" onHide={onHide}>
      <ModalHeader
        className="bg-primary text-white"
        onHide={() => onHide && onHide()}
      >
        {titleType[type]} Kategori
      </ModalHeader>
      <ModalBody>
        <Form ref={formRef} validated={validated} onSubmit={onSubmitForm}>
          <div className="flex flex-col gap-y-3">
          <ContainerInput>
            <Label>Nama Kategori</Label>
            <Input
              required
              invalid="Kategori produk wajib diisi"
              name="category_name"
              placeholder="Kategori"
              value={form.category_name}
              onChange={onChange}
            />
          </ContainerInput>
          <ContainerInput>
            <Label>Gambar</Label>
            <UploadFile
              maxFileSizeMb={1.5}
              onChange={(file, next) => {
                next && next(file);
                setForm(form => ({ ...form, image: file[0] }))
              }}
              placeholder="PNG, JPG, WEBP, GIF (Ukuran Maksimal 1.5Mb)"
              accept={Object.keys(MIME_TYPE_IMAGE)}
            />
            {type === "edit" && form.image && <div className="flex flex-col items-center gap-y-2 mt-3">
              <Label>Gambar sebelumnya</Label>
                <div>
                {
                  data?.image
                  ? <Image src={`/api/files/categories/${data.image}`} width={110} height={110} className="rounded-md" alt="" />
                  : <></>
                }
                </div>
            </div>}
          </ContainerInput>
        
          </div>
          <div className="flex justify-end gap-x-2 mt-3">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => onHide && onHide()}
            >
              Batal
            </Button>
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? <SpinnerIcon width="w-4" height="h-4" /> : "Simpan"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
}
