import { Layout } from "@/components/layout";
import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Ribbon from "@/components/ui/card/ribbon";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/form/input";
import { logout, updateUser } from "@/lib/api/users";
import { useDialogStore } from "@/lib/hookStore";
import { useUserData } from "@/lib/hooks";
import { eraseCookie } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";

export default function Profile() {
  const { data } = useUserData();
  const formRef = useRef();
  const [form, setForm] = useState();
  const [validated, setValidated] = useState();
  const showToast = useDialogStore(state => state.showToast);

  const { mutate: logoutApp } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      eraseCookie("adm");
      window.location.href = "/login"
    },
    onError: () => showToast("error-logout")
  })

  const { mutate: mutateUpdateUser, isLoading } = useMutation({
    mutationFn: ({ username, ...payload }) => {
      return updateUser(username, payload);
    },
    onSuccess: () => {
      showToast("success-update-user")
      logoutApp();
    },
    onError: () => showToast("error-update-user"),
  });

  useEffect(() => {
    if (!data?.username) return;
    const { role, ...rest } = data
    setForm(rest);
  }, [data]);
  
  const onChange = (e) => setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault();
    const valid = formRef.current?.checkValidity();
    setValidated(true);
    if (!valid) return;
    setValidated(false);

    mutateUpdateUser(form);
  }
  
  return <Layout title="Profil">
    <Card className="max-w-[800px] mx-auto relative">
      <Ribbon text={data?.role} variant="red" />
      <CardContent className="pt-10">
        <Form ref={formRef} validated={validated} onSubmit={onSubmit}>
        <div className="flex gap-x-3">
          <div>
            <AiOutlineUser size={250} color="gray"/>
          </div>
          <div className="flex flex-col gap-y-3 w-full px-8">
            <ContainerInput>
              <Label>Username</Label>
              <div>
                <Input readOnly name="username" placeholder="Username" value={form?.username || ""} />
              </div>
            </ContainerInput>
            <ContainerInput>
              <Label>Nama Lengkap</Label>
              <div>
                <Input required invalid="Nama Lengkap wajib diisi" name="name" placeholder="Nama Lengkap" value={form?.name || ""} onChange={onChange} />
              </div>
            </ContainerInput>
            <ContainerInput>
              <Label>Password</Label>
              <div>
                <Input name="password" placeholder="Password" type="password" value={form?.password || ""} onChange={onChange} />
              </div>
              <i className="text-gray-400 text-sm">* kosongkan password jika tidak ingin diubah</i>
            </ContainerInput>
          </div>

        </div>

          <div className="flex justify-end mt-5 pr-8">
            <Button disabled={isLoading} size="lg" className="w-[150px]">
              {isLoading ? <SpinnerIcon width="w-4" height="h-4" /> : "Simpan"}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  </Layout>
}