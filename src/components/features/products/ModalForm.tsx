import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalBody, ModalHeader, TTypeModalProps } from "@/components/ui/modal";
import { Selection, SelectionDataItem } from "@/components/ui/form/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { productQuery } from "@/lib/queryKeys";
import { getCategory } from "@/lib/api/category";
import { SelectionCategory } from "../SelectionFeature";
import { useContext, useRef, useState } from "react";
import Textarea from "@/components/ui/form/Textarea";
import UploadFile from "@/components/ui/form/UploadFile";
import { MIME_TYPE_IMAGE } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import { TPayloadProduct, insertProduct } from "@/lib/api/product";
import { postMethod } from "@/lib/api";
import { SpinnerIcon } from "@/components/ui/Spinner";
import { sleep } from "@/lib/utils";
import { DialogContextStore } from "@/components/context/dialog";
import { useDialogStore } from "@/lib/hookStore";

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
  type="add",
  show,
  data
}: TTypeModalProps & { type: TTypeDialog, data: TProductForm }) {
  const showToast = useDialogStore(state => state.showToast)

  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<TProductForm>(data);
  const [validated, setValidated] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<SelectionDataItem>();

  const { mutate, isLoading } = useMutation({
    mutationFn: insertProduct,
    onSuccess: (data) => {
      showToast("success-insert-product");
    },
    onError: () => showToast("error-insert-product"),
    onSettled: () => onHide && onHide(),
  });
  const onClickCategory = (selected: SelectionDataItem) => {
    setForm(form => ({
      ...form,
      category_id: +selected.id
    }))
    setSelectedCategory(selected);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(form => ({
      ...form,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const valid = formRef.current?.checkValidity();
    setValidated(true);
    if (!valid) return;
    
    setValidated(false);
    mutate(form);
  };
  return (
    <Modal show={show} size="w-[800px]" onHide={onHide}>
      <ModalHeader
        className="bg-primary text-white"
        onHide={() => onHide && onHide()}
      >
        {titleType[type]} Produk
      </ModalHeader>
      <ModalBody>
        <Form ref={formRef} validated={validated} onSubmit={onSubmit}>
          <div className="mb-4 flex items-center gap-x-7">
            <div className="w-[320px] shrink-0">
              <Label>Gambar</Label>
              <UploadFile
                onChange={(file, next) => {
                  const fileUrl = window.URL.createObjectURL(file);
                  next && next(file);
                  console.log("file ", fileUrl);
                }}
                placeholder="PNG, JPG, WEBP, GIF (Ukuran Maksimal 2Mb)"
                accept={[
                  "image/jpeg",
                  "image/jpg",
                  "image/png",
                  "image/webp",
                  "image/gif",
                ]}
              />
            </div>
            <div className="flex w-full flex-col gap-y-4">
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

              <ContainerInput>
                <Label>Kategori</Label>
                <SelectionCategory
                  required
                  invalid="Kategori wajib diisi"
                  placeholder="Pilih Kategori"
                  value={selectedCategory?.id ? selectedCategory?.text : ""}
                  onClickOption={onClickCategory}
                />
              </ContainerInput>

              <ContainerInput>
                <Label>Harga</Label>
                <Input
                  name="price"
                  type="number"
                  placeholder="Harga"
                  value={form.price || ""}
                  onChange={onChange}
                />
              </ContainerInput>

              <ContainerInput>
                <Label>Stok</Label>
                <Input
                  name="stock"
                  placeholder="Stock"
                  value={form.stock || ""}
                  onChange={onChange}
                />
              </ContainerInput>

              <ContainerInput>
                <Label>Deskripsi</Label>
                <Textarea
                  name="description"
                  autoSize
                  value={form.description}
                  onChange={onChange}
                />
              </ContainerInput>
            </div>
          </div>
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