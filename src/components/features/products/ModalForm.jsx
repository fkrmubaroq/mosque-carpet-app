import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Form from "@/components/ui/form";
import Textarea from "@/components/ui/form/Textarea";
import { Input } from "@/components/ui/form/input";
import SrcFileManager from "@/components/ui/form/input/SrcFileManager";
import { Label } from "@/components/ui/label";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const formRef = useRef(null);
  const [form, setForm] = useState(data);
  const [validated, setValidated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    if (type === "edit") {
      if (form.image) {
        setSelectedFiles(JSON.parse(form.image))
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

    const payload = { ...form };

    if (selectedFiles.length) {
      payload.image = JSON.stringify(selectedFiles); 
    }
    setValidated(false);
    type === "add" && onSave(payload);
    if (type === "edit") {
      delete payload.category_name;
      onEdit(payload);
    }
  };

  return (
    <Modal show={show} size="w-[500px]" onHide={onHide}>
      <ModalHeader onHide={() => onHide && onHide()}>
        {titleType[type]} Produk
      </ModalHeader>
      <ModalBody>
        <Form ref={formRef} validated={validated} onSubmit={onSubmitForm}>
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

            <ContainerInput direction="row">
              <div className="flex flex-col gap-y-2 w-full">
                <Label>Harga</Label>
                <Input
                  name="price"
                  type="number"
                  placeholder="Harga"
                  value={form.price || ""}
                  onChange={onChange}
                  />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Diskon</Label>
                <Input
                  name="discount"
                  type="number"
                  placeholder="%"
                  className="w-[100px]"
                  value={form.discount || ""}
                  onChange={onChange}
                />
              </div>
            </ContainerInput>

            <ContainerInput>
              <Label>Gambar</Label>
              <SrcFileManager
                onSave={setSelectedFiles}
                values={selectedFiles}
                onRemoveFile={(index) => {
                  const clone = [...selectedFiles];
                  clone.splice(index, 1);
                  setSelectedFiles(clone);
                }}
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
          <div className="flex justify-end gap-x-2 mt-4">
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