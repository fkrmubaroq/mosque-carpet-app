import style from "@/components/features/article.module.scss";
import ModalThumbnail from "@/components/features/article/ModalThumbnail";
import { Layout } from "@/components/layout";
import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import ButtonBack from "@/components/ui/button/ButtonBack";
import Editor from "@/components/ui/editor/Editor";
import { getArticleById, updateArticle } from "@/lib/api/articles";
import { useDialogStore } from "@/lib/hookStore";
import { mediaPath } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import ContentEditable from "react-contenteditable";
import { CiImageOn } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { IoIosGlobe, IoMdTime } from "react-icons/io";

const initModal = Object.freeze({
  type: "",
  show: false
});

export async function getServerSideProps(context) {
  const id = context.params.id;

  const response = await getArticleById(+id);
  console.log("res", response.data);
  if (!response.data?.data) return { notFound: true };

  return {
    props: {
      data: response.data.data || {}
  } };
}
export default function Edit({ data }) {
  const router = useRouter();
  const id = router.query?.id;
  const [article, setArticle] = useState(data);
  const [modal, setModal] = useState(initModal);
  const [tempThumbnail, setTempThumbnail] = useState("");
  const showToast = useDialogStore(state => state.showToast);


  const { mutate: mutateUpdateArticle, isLoading } = useMutation({
    mutationFn: (payload) => updateArticle(+id, payload),
    onSuccess: () => {
      showToast("success-update-article");
      Router.push("/admin/articles")
    },
    onError: () => showToast("error-update-article")
  });

  const onClickThumbnail = (thumbnail) => {
    setModal({
      show: true,
      type: "thumbnail",
      data: thumbnail
    })
  }

  const onSaveThumbnail = (file) => {
    setModal(initModal);
    setTempThumbnail(file);
  }

  const onUpdateContent = (name, value) => {
    setArticle(article => ({ 
      ...article,
      [name]: value
    }))
  }

  const onSave = () => {
    const { created_at, id, slug, updated_at, viewers_id, thumbnail, ...payload } = article

    if (tempThumbnail) {
      payload.thumbnail = tempThumbnail;
    }
    mutateUpdateArticle(payload);
  }

  const getThumbnail = (thumbnail) => {
    return URL.createObjectURL(thumbnail);
  }

  return <Layout title="Ubah Artikel">
    <ButtonAction article={article} isLoading={isLoading} onSave={onSave} />
    {modal.show && modal.type === "thumbnail" &&
      <ModalThumbnail
        show
        onHide={() => setModal(initModal)}
        onSave={onSaveThumbnail}
      />
    }
    <ButtonBack onClick={() => Router.push("/admin/articles")}/>
    <div className={style["wrapper-article"]}>
      <ContentEditable
        tagName="div"
        className={cn(style["article__title"], "hover:border-primary border-2 pl-1.5 pr-3 border-transparent")}
        html={article.title}
        onChange={(e) => onUpdateContent("title", e.target.value)}
      />
      <div className="flex justify-between mt-2.5 mb-3">

        <div className="flex items-center gap-x-1.5 ">
          <FiUser size={14} color="gray" />
          <ContentEditable
            tagName="span"
            className={cn(style["article__writer-name"], "hover:border-primary border-2 pl-1.5 pr-3 border-transparent")}
            html={article.writer}
            onChange={(e) => onUpdateContent("writer", e.target.value)}
          />
        </div>
        <div className="text-gray-400 text-xs flex gap-x-1 items-center">
          <IoMdTime />
          <span>{dayjs(article.created_at).format("DD MMMM YYYY Pukul HH:mm WIB")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <div        
          className="relative group hover:border-primary border-4 border-transparent cursor-pointer hover:border-4 hover:rounded-sm">
          <Image
            className="object-cover rounded-sm "
            alt={article.title || "-"}
            src={tempThumbnail ? getThumbnail(tempThumbnail) : mediaPath("articles-thumbnail", article.thumbnail)}
            width={800}
            height={500}
          />
          <div className="hidden group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Button className="flex gap-x-2" onClick={() => onClickThumbnail(article.thumbnail)}>
              <CiImageOn size={20}/>
              <span className="text-sm">Ganti Thumbnail</span>
            </Button>
          </div>
        </div>
        <Editor value={data.content} onChange={(content) => onUpdateContent("content", content)}/>
      </div>      
    </div>
  </Layout>
}

function ButtonAction({ article, isLoading, onSave }) {
  return <div className="flex gap-x-2 fixed top-5 left-1/2 z-[99999]">
    <Button
      onClick={() => window.open(`/${article.slug}`)}
      variant="ghost"
      className="border border-gray-600 gap-x-2 flex items-center justify-center !rounded-full">
      <IoIosGlobe size={20} />
      <span>Lihat Artikel</span>
    </Button>
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