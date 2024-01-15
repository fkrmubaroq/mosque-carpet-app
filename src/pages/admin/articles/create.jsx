import { Layout } from "@/components/layout";
import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Textarea from "@/components/ui/form/Textarea";
import UploadFile from "@/components/ui/form/UploadFile";
import { Input } from "@/components/ui/form/input";
import { createArticle } from "@/lib/api/articles";
import { useDialogStore } from "@/lib/hookStore";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Router from "next/router";
import { useState } from "react";
const Editor = dynamic(
  import("@/components/ui/editor/Editor").then((module) => module.default),
  {
    ssr: false,
  }
);

const initForm = Object.freeze({
  title: "Judul Artikel",
  content: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>",
  writer: "",
  thumbnail: ""
})
export default function CreateArticle() {
  const [form, setForm] = useState(initForm);
  const onChange = (e) => setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  const showToast = useDialogStore(state => state.showToast);

  const { mutate: mutateCreateArticle, isLoading } = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      showToast("success-create-article");
      Router.push("/admin/articles")

    },
    onError: () => showToast("error-create-article")
  })

  const onSave = () => {
    mutateCreateArticle(form);
  }

  return <Layout title="Buat Artikel">
    <ButtonAction isLoading={isLoading} onSave={onSave}/>
    <div className="mt-3 w-[680px] mx-auto flex flex-col gap-y-4">
      <ContainerInput>
        <Label className="font-medium">Judul Artikel</Label>
        <Textarea
          autoSize
          name="title"
          className="!text-2xl font-medium tracking-wide shadow-none hover:bg-white"
          value={form.title}
          onChange={onChange}
          placeholder="Judul"
        />
      </ContainerInput>
      <ContainerInput>
        <Label>Penulis Artikel</Label>
        <Input placeholder="Penulis" name="writer" value={form.writer} onChange={onChange} />
      </ContainerInput>
      <ContainerInput>
        <Label className="font-medium">Thumbnail</Label>
      <UploadFile
        maxFileSizeMb={1.5}
        onChange={(file, next) => {
          next && next(file);
          setForm(form => ({ ...form, thumbnail: file[0] }))
        }}
        placeholder="Thumbnail harus bertipe PNG, JPG, WEBP, GIF (Ukuran Maksimal 1.5Mb)"
        accept={[
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ]}
        />
      </ContainerInput>
      
      <ContainerInput>
        <Label className="font-medium">Isi Konten</Label>
        <Editor className="editor-article" value={form.content} onChange={(content) => setForm(form => ({ ...form, content }))} />
      </ContainerInput>
    </div>
  </Layout>
}

function ButtonAction({ isLoading, onSave }) {
  return <div className="flex gap-x-2 fixed top-5 left-1/2 z-[99999]">
    <Button
      disabled={isLoading}
      className="!rounded-full"
      size="lg"
      onClick={() => onSave()}
    >
      {isLoading ? (
        <SpinnerIcon width="w-4" height="h-4" />
      ) : (
        "Simpan"
      )}
    </Button>
  </div>
}