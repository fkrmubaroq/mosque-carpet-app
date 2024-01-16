import Meta from "@/components/Meta";
import style from "@/components/features/article.module.scss";
import SectionFooter from "@/components/features/sections/SectionFooter";
import HeaderArticle from "@/components/layout/HeaderArticle";
import { getArticleBySlug } from "@/lib/api/articles";
import { CONTAINER_LP, placeholderImage } from "@/lib/constant";
import { prismaClient } from "@/lib/prisma";
import { mediaPath, strippedStrings } from "@/lib/utils";
import cn from "classnames";
import dayjs from "dayjs";
import parser from "html-react-parser";
import Image from "next/image";
import { FiUser } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const response = await getArticleBySlug(slug);
  const prismaSections = await prismaClient.sections.findMany({
    orderBy: {
      position: "asc"
    },
    where: {
      active: "Y"
    }
  });
  return {
    props: {
      article: response.data.data || null,
      sections: prismaSections || []
    }
  }
}
export default function Article({ article, sections }) {
  const getContentSection = (sectionName) => {
    const section = sections.find(section => section.section_name === sectionName);
    const content = JSON.parse(section?.content || "{}");
    return {
      ...section,
      content
    };
  }

  const getDescription = () => {
    const content = strippedStrings(article?.content || "");
    return content.substring(0, 60);
  }
  return <>
    <Meta customTitle={article?.title} description={getDescription()} />
    <main className="min-h-screen">
      <HeaderArticle />
      {!article ? <Notfound /> : <PreviewNews data={article} />}
    </main>
    <SectionFooter section={getContentSection("section_footer")} />
  </>
}

function PreviewNews({ data }) {
  return <div className={cn(CONTAINER_LP, "tiptap-reader mt-8 mb-32")}>
    <div className={cn(style["wrapper-article"])}>
      <div className={cn(style["article__title"])}>{data?.title}</div>

      <div className="flex md:flex-row flex-col md:gap-y-0 gap-y-1  justify-between mt-2.5 mb-3">
        <div className="flex items-center gap-x-1.5 ">
          <FiUser size={14} color="gray" />
          <span className={cn(style["article__writer-name"])}>{data?.writer}</span>
        </div>
        <div className="text-gray-400 text-xs flex gap-x-1 items-center">
          <IoMdTime />
          <span>{dayjs(data.created_at).format("DD MMMM YYYY Pukul HH:mm WIB")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <Image
          className="object-cover rounded-sm w-full "
          alt={data?.title || "-"}
          src={data?.thumbnail ? mediaPath("articles-thumbnail", data.thumbnail) : placeholderImage}
          width={800}
          height={500}
        />
        <div>{parser(data?.content || "")}</div>
      </div>
    </div>

  </div>
}

function Notfound() {
  return <div className="flex justify-center items-center mt-20 flex-col gap-y-3">
    <span className="text-gray-700 tracking-wider font-medium text-2xl">Artikel tidak ditemukan</span>
    <Image src="/img/empty-article.png" width={360} height={320} />
    <span className="text-gray-400 tracking-wider font-medium text-lg">Yuk Baca artikel lainnya{" "}
      <span className="text-primary font-semibold cursor-pointer hover:underline"
        onClick={() => {
          location.href = "/news";
        }}>
        disini
      </span>
    </span>

  </div>
}