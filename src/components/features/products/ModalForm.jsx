import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Form from "@/components/ui/form";
import Textarea from "@/components/ui/form/Textarea";
import UploadFile from "@/components/ui/form/UploadFile";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SelectionCategory } from "../SelectionFeature";

const titleType = {
  add: "Tambah",
  edit: "Ubah"
};

export default function ModalForm({
  onHide,
  type = "add",
  show,
  data,
  onSave,
  isLoading,
  onEdit,
}) {
  const formRef = useRef(null);
  const [prevImage, setPrevImage] = useState();
  const [form, setForm] = useState(data);
  const [validated, setValidated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    if (type === "edit") {
      if (form.image) {
        setPrevImage(form.image);
      }
      const categoryName = (form)?.category_name;
      if (!categoryName || !form.category_id) return;
      setSelectedCategory({
        id: form.category_id,
        text: categoryName,
      });
    }
  }, [type]);

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
    type === "add" && onSave(form);
    type === "edit" && onEdit(form);
  };

  return (
    <Modal show={show} size="w-[800px]" onHide={onHide}>
      <ModalHeader onHide={() => onHide && onHide()}>
        {titleType[type]} Produk
      </ModalHeader>
      <ModalBody>
        <Form ref={formRef} validated={validated} onSubmit={onSubmitForm}>
          <div className="mb-4 flex items-center gap-x-7">
            <div className="w-[320px] shrink-0">            
              <Label>Gambar</Label>
              <UploadFile
                maxFileSizeMb={1.5}
                onChange={(file, next) => {
                  next && next(file);
                  setForm(form => ({ ...form, image: file[0]}))
                }}
                placeholder="PNG, JPG, WEBP, GIF (Ukuran Maksimal 1.5Mb)"
                accept={[
                  "image/jpeg",
                  "image/jpg",
                  "image/png",
                  "image/webp",
                  "image/gif",
                ]}
              />
            {type === "edit" && form.image && <div className="flex flex-col items-center gap-y-2 mt-3">
              <Label>Gambar sebelumnya</Label>
                <div>{<Image src={`/api/files/products/${prevImage}`} width={110} height={110} className="rounded-md" alt="" />}</div>
            </div>}
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