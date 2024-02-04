import Meta from "@/components/Meta";
import SectionFooter from "@/components/features/sections/SectionFooter";
import HeaderArticle from "@/components/layout/HeaderArticle";
import { Card, CardContent } from "@/components/ui/card";
import { getArticle } from "@/lib/api/articles";
import { CONTAINER_LP } from "@/lib/constant";
import { prismaClient } from "@/lib/prisma";
import { landingPageQuery } from "@/lib/queryKeys";
import { getArticleTime, getWord, mediaPath, slugString, strippedStrings } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import cn from "classnames";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";

dayjs.locale("id");
dayjs.extend(relativeTimePlugin);

export async function getServerSideProps() {
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
      sections: prismaSections || []
    }
  }
}
export default function Berita({ sections }) {
  const { data: articles, isLoading } = useQuery({
    queryKey: landingPageQuery.getAllArticles,
    queryFn: async () => {
      const response = await getArticle();
      return response.data.data || []
    }
  });

  const getContentSection = (sectionName) => {
    const section = sections.find(section => section.section_name === sectionName);
    const content = JSON.parse(section?.content || "{}");
    return {
      ...section,
      content
    };
  }
  const [mainArticle, ...restArticles] = articles || [];
  return <>
    <Meta customTitle="Semua Berita" description="Semua Berita" />
    <main className="min-h-screen font-jasans">
      <HeaderArticle />
      <div className={cn(CONTAINER_LP, "mt-10 mb-32")}>
        {mainArticle && <MainArticle data={mainArticle} />}
        <div className="text-2xl font-semibold tracking-wide mt-8">Berita Terkini</div>
        <div className={cn("gap-5 mt-5","grid min-[530px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4")}>
          {isLoading ? <ShimmerNews /> : <NewsItems data={restArticles} />}
        </div>
      </div>
    </main>
    <SectionFooter section={getContentSection("section_footer")} />
  </>
}

function ShimmerNews() {
  return <></>
}

function MainArticle({ data }) {
  return <div className="flex min-[880px]:flex-row flex-col gap-x-10">
    <div className={cn("shrink-0 relative",
      "min-[1616px]:w-[670px] lg:w-[570px] xl:w-[550px] min-[880px]:w-[440px] w-full",
      "md:h-[400px] lg:h-[450px] h-[400px]"
    )}>
      <Image
        layout="fill"
        className="rounded-xl object-cover"
        src={mediaPath("articles-thumbnail", data.thumbnail)}
      />
      <div
        className="absolute rounded-b-xl inset-0 min-[880px]:hidden block"
        style={{
          backgroundImage:
            "linear-gradient(0deg, #000000 0%, #00000000 50%)",
        }}
      ></div>
      <div className="absolute flex flex-col text-white bottom-8 min-[440px]:left-8 left-3 sm:right-24 min-[880px]:hidden  ">
        <Link  title={data.title} href={`/${slugString(data.title)}`}>
          <a className="min-[440px]:text-xl text-base min-[380px]:text-lg font-semibold line-clamp-2 sm:text-2xl">{data.title}</a>
        </Link>
      </div>
    </div>
    <div className="flex-col gap-y-3 min-[880px]:flex hidden">
        <div className="flex gap-x-3 text-gray-500 text-sm">
          <div className="flex items-center gap-x-1">
            <FiUser size={17} color="gray" />
            <span>{data.writer}</span>
          </div>
          <span className="first-letter:capitalize text-gray-400 ">{getArticleTime(data.created_at)}</span>
        </div>
        <div className="min-[1347px]:text-4xl font-semibold mb-1 xl:pr-10 lg:text-3xl md:text-2xl ">{data.title}</div>
        <div className="flex flex-col gap-y-4 font-soserif xl:pr-10">
          <div className="flex flex-col justify-between">
            <div className="text-gray-400 line-clamp-[7] md:text-lg lg:text-xl font-normal mb-5 min-h-[200px] text-justify">{strippedStrings(data.content)}</div>
            <Link href={`/${slugString(data.title)}`}>
              <a className="text-lg gap-x-2  font-soserif hover:bg-primary-hover bg-primary text-white p-3 w-[200px] flex justify-center items-center rounded-full">
                <span>Selengkapnya</span>
                <FaArrowRightLong />
              </a>
            </Link>
          </div>
        </div>
      </div>
  </div>
}

function NewsItems({ data }) {

  return data.map((item, key) =>
    <Card
      key={key}
      style={{ boxShadow: "0px 0px 0px transparent" }}
      className={cn("flex rounded-none border-none flex-col  relative")}>
          <Image className="rounded-xl object-cover" src={mediaPath("articles-thumbnail", item.thumbnail)} width={300} height={200} />
          <CardContent className="pl-2 !pt-3 pr-0">
            <div className="flex justify-between mb-3">
              <div className="flex gap-x-1 items-center">
                <IoMdTime color="gray" size={14} />
                <span className="text-xs text-gray-500 line-clamp-1">{getArticleTime(item.created_at)}</span>
              </div>
              <div className="flex gap-x-1 items-center">
                <FiUser color="gray" />
                <span className="text-xs text-gray-500 line-clamp-1" title={item.writer}>{getWord(item.writer, 2) || ""}</span>
              </div>
            </div>
            <Link href={slugString(item.title)}>
              <a className="font-bold font-jasans text-slate-700 cursor-pointer hover:underline mb-2 line-clamp-2">{item.title}</a>
            </Link>
            <div className="text-gray-400 line-clamp-4 text-sm font-soserif">{strippedStrings(item.content)}</div>
          </CardContent>
        </Card>
  )
}