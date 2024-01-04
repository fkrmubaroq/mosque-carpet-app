import { Button } from "@/components/ui/button";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AiFillCaretRight
} from "react-icons/ai";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import SectionTitle from "@/components/features/sections/Fragment/SectionTitle";
import SectionAboutUs from "@/components/features/sections/SectionAboutUs";
import SectionContactUs from "@/components/features/sections/SectionContactUs";
import SectionFooter from "@/components/features/sections/SectionFooter";
import SectionHero from "@/components/features/sections/SectionHero";
import SectionVisionMision from "@/components/features/sections/SectionVisionMision";
import SectionWhyChooseUs from "@/components/features/sections/SectionWhyChooseUs";
import ButtonWa from "@/components/ui/button/ButtonWa";
import { CONTAINER_LP, MARGIN_EACH_SECTION } from "@/lib/constant";
import { prismaClient } from "@/lib/prisma";
import { debounce, mediaPath } from "@/lib/utils";
import { Navigation } from 'swiper/modules';

export async function getServerSideProps() {
  const prismaCategories = await prismaClient.category.findMany({
    orderBy: {
      id: "desc"
    },
    take: 5
  });

  const prismaSections = await prismaClient.sections.findMany({
    orderBy: {
      position:"asc"
    },
    where: {
      active: "Y"
    }
  })
  return {
    props: {
      categories: prismaCategories || [],
      sections: prismaSections || []
    }
  }
}
export default function Home({ categories, sections }) {  
  const [mobileMd, setMobileMdWidth] = useState(false);
  const [mobileSm, setMobileSm] = useState(false);
  const mobile = {
    mobileMd,
    mobileSm,
  };

  const getContentSection = (sectionName) => {
    const section = sections.find(section => section.section_name === sectionName);
    const content = JSON.parse(section?.content || "{}");
    return {
      ...section,
      content
    };
  }
  useEffect(() => {
    const checkScreenWidth = () => {
      const width = window.innerWidth;
      const mobileMdWidth = width <= 968;
      const mobileSmWidth = width <= 640;
      if (mobileSmWidth) {
        setMobileSm(true);
        setMobileMdWidth(false);
        return;
      }
      setMobileSm(false);
      setMobileMdWidth(mobileMdWidth);
    };
    const debounceCheckScreenWidth = debounce(checkScreenWidth);
    debounceCheckScreenWidth();
    window.addEventListener("resize", debounceCheckScreenWidth);
    return () => window.removeEventListener("resize", debounceCheckScreenWidth);
  }, [mobile]);

  useEffect(() => {
    document.body.classList.add("bg-slate-50");
  }, []);
  return (
    <main className="min-h-screen">
      <SectionHero mobile={mobile} section={getContentSection("section_hero")} />
      <div className={cn(CONTAINER_LP, "px-4")}>
        <SectionAboutUs section={getContentSection("section_about_us")} />
        <SectionVisionMision section={getContentSection("section_vision_mision")} />
        <SectionWhyChooseUs section={getContentSection("section_why_choose_us")} />
        <SectionContactUs mobile={mobile} section={getContentSection("section_contact_us")} />
        <SectionRecentNews mobile={mobile} />
        <SectionOurProduct mobile={mobile} categories={categories} />
      </div>
      <SectionFooter content={getContentSection("section_footer")} />
      <ButtonWa phone=""/>
    </main>
  );
}

const partners = [
  "partner-1.webp",
  "partner-2.webp",
  "partner-3.webp",
  "partner-4.webp",
]
function SectionOurPartner() {
  return (
    <section className="lg:mb-[100px]">
      <SectionTitle
        context="BRAND"
        title={
          <>
            Our Brand <span className="text-green-700">PARTNERS</span>
          </>
        }
      />
      <div className="flex gap-x-3 justify-around">{partners.map((fileName, key) =>
        <Image
          key={key}
          src={`/img/partners/${fileName}`}
          width="240"
          height="100"
          alt=""
          className="object-contain"
        />)}</div>
    </section>
  );
}


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
function SectionRecentNews({ mobile }) {
  const getSlidePerPreviewByScreen = () => {
    if (mobile.mobileSm) return 1;
    if (mobile.mobileMd) return 2;
    return 3;
  }
  return (
    <section className={cn(MARGIN_EACH_SECTION)}>
      <SectionTitle
        context="ARTICLES"
        title={
          <div className="flex justify-between">
            <div>
              Explore What’s <span className="text-green-700">New Here</span>
            </div>
            <span>
              <Button className="flex items-center justify-center gap-x-2 rounded-none !p-6">
                <span className="mt-0.5">VIEW MORE</span>
                <AiFillCaretRight />
              </Button>
            </span>
          </div>
        }
      />
      <div className="flex gap-x-8">
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
      </div>
    </section>
  );
}

function CardNewItem({ data }) {
  return (
    <div className="group flex flex-col gap-y-3 transition-all duration-500 hover:scale-105 ease-in-out hover:bg-primary">
      <div className="image w-full">
        <Image
          src={data.image}
          width="450"
          className="w-full shrink-0 object-cover"
          height="300"
          alt=""
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


function SectionOurProduct({ mobile, categories }) {
  const getSlidePerPreviewByScreen = () => {
    if (mobile.mobileSm) return 1;
    if (mobile.mobileMd) return 2;
    return 4;
  };
  return (
    <section className={MARGIN_EACH_SECTION}>
      <SectionTitle
        context="OUR PRODUCTS"
        title={
          <div className="mb-3 flex items-center justify-between">
            <div>
              Shop by <span className="text-green-700">Category</span>
            </div>
            <span>
              <Button className="flex items-center justify-center gap-x-2 rounded-none !p-6">
                <span className="mt-0.5">VIEW MORE</span>
                <AiFillCaretRight />
              </Button>
            </span>
          </div>
        }
      />
      <Swiper
        slidesPerView={getSlidePerPreviewByScreen()}
        spaceBetween={20}
        navigation={true}
        loop
        modules={[Navigation]}
        className="swipper-category"
      >
        {categories.map((item, key) => (
          <SwiperSlide
            key={key}
            className="group mb-2 flex cursor-pointer flex-col shadow transition-all duration-500 ease-in-out hover:scale-105 hover:bg-primary"
          >
            <Image src={mediaPath("categories",item.image)} width="400" height="300" alt="" className="w-full" />
            <div className="pb-5 pt-4 text-center font-poppins tracking-wider text-slate-700 group-hover:bg-primary group-hover:text-white">
              {item.category_name}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
