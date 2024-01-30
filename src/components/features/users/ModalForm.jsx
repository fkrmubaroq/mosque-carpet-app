import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Form from "@/components/ui/form";
import { Selection } from "@/components/ui/form/Select";
import { Input } from "@/components/ui/form/input";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { convertObjToDataSelection } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useRef, useState } from "react";

const roleObj = {
  "STAFF": "Staff",
  "ADMIN": "Admin",
}

const modalType = {
  edit: "Ubah",
  add: "Tambah",
}

const initForm = {
  username: "",
  password: "",
  role: ""
}
export default function ModalForm({ data, onHide, show, type = "add", onSave, isLoading }) {
  const formRef = useRef();
  const [form, setForm] = useState(data || initForm);
  const [validated, setValidated] = useState(false);

  const onChange = e => setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault();
    setValidated(true);
    const valid = formRef.current.checkValidity();
    if (!valid) return;
    setValidated(false);
    onSave(form);
  }

  const isEdit = type === "edit";

  return <Modal show={show} onHide={onHide}>
    <ModalHeader onHide={onHide}>{modalType[type]} User</ModalHeader>
    <ModalBody className="flex flex-col gap-y-4">
      <Form className="flex flex-col gap-y-4" validated={validated} onSubmit={onSubmit} ref={formRef}>
      <ContainerInput>
          <Label className="font-medium">Username</Label>
          <div>
            <Input readOnly={type === "edit"} required invalid="Username wajib diisi" placeholder="Masukan username" name="username" value={form.username} onChange={onChange} />
          </div>
      </ContainerInput>
      <ContainerInput>
          <Label className="font-medium">Nama Lengkap</Label>
          <div>
            <Input required invalid="Nama lengkap wajib diisi" placeholder="Masukan nama lengkap" name="name" value={form.name} onChange={onChange} />
          </div>
      </ContainerInput>

      <ContainerInput>
        <Label className="font-medium">Role</Label>
          <Selection
            required
            invalid="Role wajib diisi"
            placeholder="Pilih Role"
            options={convertObjToDataSelection(roleObj)}
            onClickOption={selected => {
              setForm(form => ({ ...form, role: selected.id }))
            }}
            value={roleObj?.[form.role] || ""}
          />
      </ContainerInput>

      <ContainerInput>
        <Label className="font-medium">Password</Label>
        <div>
            <Input required={!isEdit} invalid="Password wajib diisi" type="password" placeholder="Masukan password" name="password" value={form?.password || ""} onChange={onChange} />
        </div>
          {isEdit && <i className="text-gray-400 text-sm">* kosongkan password jika tidak ingin diubah</i>}
      </ContainerInput>
      <div className="flex justify-end mt-3 gap-x-3">
        <Button type="button" variant="ghost" onClick={() => onHide()}>Batal</Button>
          <Button type="submit">
            {isLoading ? <SpinnerIcon width="w-4" height="h-4" /> : "Simpan"}
        </Button>
        </div>
      </Form>
    </ModalBody>
  </Modal>
}