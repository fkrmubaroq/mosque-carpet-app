import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalBody,
  ModalHeader,
  TTypeModalProps,
} from "@/components/ui/modal";
import { SelectionDataItem } from "@/components/ui/form/Select";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import { SpinnerIcon } from "@/components/ui/Spinner";

type TTypeDialog = "add";

export type TProductForm = {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image?: string;
};

const titleType = {
  add: "Tambah",
};

export default function ModalForm({
  onHide,
  type = "add",
  show,
  data,
  onSubmit,
}: TTypeModalProps & { type: TTypeDialog; data: TProductForm; onSubmit: (form: TProductForm) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<TProductForm>(data);
  const [validated, setValidated] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<SelectionDataItem>();

  const onClickCategory = (selected: SelectionDataItem) => {
    setForm((form) => ({
      ...form,
      category_id: +selected.id,
    }));
    setSelectedCategory(selected);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((form) => ({
      ...form,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitForm = (e: React.SyntheticEvent) => {
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
