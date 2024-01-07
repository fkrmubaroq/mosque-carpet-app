import { Button } from "@/components/ui/button";
import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
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

  return (
    <section className={cn(MARGIN_EACH_SECTION)}>
      <div className="flex justify-between items-center">
        <div
          className="inline border-b text-lg border-b-green-600 font-cinzel tracking-wide"
        >
          Artikel
        </div>
        <div className="mb-3 font-cinzel text-3xl font-medium">
          <Button className="flex items-center justify-center gap-x-2 rounded-none !p-6">
            <span className="mt-0.5">VIEW MORE</span>
            <AiFillCaretRight />
          </Button>
        </div>
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
            {newsItems.map((item, key) => (
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
    <div className="group flex flex-col gap-y-3 transition-all duration-500 hover:scale-105 ease-in-out hover:bg-primary">
      <div className="shrink-0 relative h-[300px]">
        <Image
          src={data?.image}
          layout="fill"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-2 px-4 pb-8">
        <span className="mt-2 cursor-pointer text-xl font-medium hover:underline tracking-wider text-gray-700 group-hover:text-white">
          {data.title}
        </span>
        <span className="text-sm tracking-wide text-gray-400 group-hover:text-white">
          {dayjs(new Date(data.createdAt)).format("MMMM DD, YYYY")}
        </span>
        <span className="tracking-wide text-slate-600 group-hover:text-white">
          {data.description}
        </span>
      </div>
    </div>
  );
}
