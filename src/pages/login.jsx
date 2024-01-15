import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/form/input";
import { loginAdmin } from "@/lib/api/login";
import { useDialogStore } from "@/lib/hookStore";
import { setCookie } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRef, useState } from "react";

const initForm = Object.freeze({ username: "", password: "" });
export default function Login() {
  const formRef = useRef();
  const [form, setForm] = useState(initForm);
  const [validated, setValidate] = useState(false);
  const showToast = useDialogStore(state => state.showToast);
  const { mutate:mutateLogin, isLoading } = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (response) => {
      console.log({ response })
      const data = JSON.stringify(response.data.data);
      setCookie("adm", data, 7);
      location.href = "/admin/dashboard";
    },
    onError: () => showToast("error-wrong-password")
  });
  
  const onChange = e => setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    setValidate(true);
    const valid = formRef.current.checkValidity();
    if (!valid) return;

    mutateLogin(form);
    setValidate(false);
  }

  return <div className="min-h-screen lg:px-0 px-5 flex justify-center items-center bg-gray-50">
    <div className="lg:block hidden"> 
      <Image src="/img/login.png" width={350} height={250}/>
    </div>
    <Card className="w-[400px] bg-white shadow-md border-none">
      <CardHeader>
        <div className="text-2xl text-center font-medium">Login</div>
      </CardHeader>
      <CardContent >
        <Form className="flex flex-col gap-y-4 pt-3" ref={formRef} validated={validated} onSubmit={onSubmit}>
        <ContainerInput>
            <Label className="font-medium text-sm text-gray-700">Username</Label>
            <div>
              <Input required invalid="Username wajib diisi" name="username" value={form.username} onChange={onChange} placeholder="Username"/>
            </div>
        </ContainerInput>
        <ContainerInput>
            <Label className="font-medium text-sm text-gray-700">Password</Label>
            <div>
              <Input type="password" required invalid="Password wajib diisi" name="password" value={form.password} onChange={onChange} placeholder="Password"/>
            </div>
        </ContainerInput>
          <Button disabled={isLoading} type="submit" className="tracking-wide w-full">
            {isLoading ? <SpinnerIcon width="w-4" height="h-4" /> : "Masuk"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  </div>
}
