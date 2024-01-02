import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalBody,
  ModalHeader
} from "@/components/ui/modal";
import { useRef, useState } from "react";

const titleType = {
  add: "Tambah",
};

export default function ModalForm({
  onHide,
  type = "add",
  show,
  data,
  onSubmit,
}) {
  const formRef = useRef(null);
  const [form, setForm] = useState(data);
  const [validated, setValidated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

  const onClickCategory = (selected) => {
    setForm((form) => ({
      ...form,
      category_id: +selected.id,
    }));
    setSelectedCategory(selected);
  };

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
    onSubmit(form);
  };
  return (
    <Modal show={show} size="w-[800px]" onHide={onHide}>
      <ModalHeader
        className="bg-primary text-white"
        onHide={() => onHide && onHide()}
      >
        {titleType[type]} Kategori Produk
      </ModalHeader>
      <ModalBody>
        <Form ref={formRef} validated={validated} onSubmit={onSubmitForm}>
          <ContainerInput>
            <Label>Nama Produk</Label>
            <Input
              required
              invalid="Nama produk wajib diisi"
              name="name"
              placeholder="Nama"
              value={form.name}
              onChange={onChange}
            />
          </ContainerInput>
          <div className="flex justify-end gap-x-2">
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
