import { Button } from "@/components/ui/button";
import { getArticle } from "@/lib/api/articles";
import { MARGIN_EACH_SECTION, placeholderImage } from "@/lib/constant";
import { landingPageQuery } from "@/lib/queryKeys";
import { mediaPath, slugString, strippedStrings } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { AiFillCaretRight } from "react-icons/ai";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


const newsItems = [
  {
    image: "/img/news/news-1.webp",
    title: "A New Destination for kitchen & cabinet, Jakarta",
    createdAt: "2023-10-11",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  },
  {
    image: "/img/news/news-2.webp",
    title: "The Opening of MODULO",
    createdAt: "2023-10-12",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  },
  {
    image: "/img/news/news-3.webp",
    title: "Soft Launching Masjid Al-Jabar",
    createdAt: "2023-10-12",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  },
];

export default function SectionArticles({ mobile, edit, section }) {
  const getSlidePerPreviewByScreen = () => {
    if (mobile?.mobileSm) return 1;
    if (mobile?.mobileMd) return 2;
    return 3;
  }

  const { data: articles } = useQuery({
    queryKey: landingPageQuery.getArticles,
    queryFn: async () => {
      const params = {}
      const response = await getArticle(params);
      return response.data.data || []
    }
  });

  console.log({ articles })

  return (
    <section className={cn(MARGIN_EACH_SECTION)} id="section_articles">
      <div className="flex justify-between items-center mb-3">
        <div
          className="inline border-b text-lg border-b-green-600 font-cinzel tracking-wide"
        >
          Artikel
        </div>
        <Button className="flex items-center justify-center gap-x-2 rounded-none !p-6" onClick={() => Router.push("/berita")}>
          <span className="mt-0.5">VIEW MORE</span>
          <AiFillCaretRight />
        </Button>
      </div>

      <div className="flex gap-x-8">
        {edit ? newsItems.map((item, key) => (<CardNewItem key={key} data={item} />))
          :
          <Swiper
            slidesPerView={getSlidePerPreviewByScreen()}
            spaceBetween={20}
            navigation={true}
            loop
            modules={[Navigation]}
            className="swipper-category"
          >
            {articles?.map((item, key) => (
              <SwiperSlide key={key}>
                <CardNewItem data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        }
      </div>
    </section>
  );
}

function CardNewItem({ data }) {
  return (
    <div className="group shadow-md flex flex-col gap-y-3 transition-all duration-500 hover:scale-105 ease-in-out hover:bg-primary">
      <div className="shrink-0 relative h-[300px]">
        <Image
          src={data?.thumbnail ? mediaPath("articles-thumbnail",data.thumbnail) : placeholderImage}
          layout="fill"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-2 px-4 pb-8">
        <Link href={`/${slugString(data?.title)}`}>
          <a className="mt-2 cursor-pointer line-clamp-2 text-xl font-medium hover:underline tracking-wider text-gray-700 group-hover:text-white">{data.title}</a>
        </Link>
        <span className="text-sm tracking-wide text-gray-400 group-hover:text-white">
          {dayjs(new Date(data.created_at)).format("MMMM DD, YYYY HH:mm WIB")}
        </span>
        <span className="tracking-wide text-justify line-clamp-3 text-slate-600 group-hover:text-white">
          {strippedStrings(data.content || "")}
        </span>
      </div>
    </div>
  );
}
