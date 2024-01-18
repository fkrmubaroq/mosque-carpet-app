import SectionFooter from "@/components/features/sections/SectionFooter";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import ButtonBack from "@/components/ui/button/ButtonBack";
import ButtonWhatsapp from "@/components/ui/button/ButtonWa";
import { getProductByCategory, getProductByName } from "@/lib/api/product";
import { CONTAINER_LP } from "@/lib/constant";
import { useMobile } from "@/lib/hooks";
import { prismaClient } from "@/lib/prisma";
import { productsQuery } from "@/lib/queryKeys";
import { formatNumberToPrice, mediaPath } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaWhatsapp } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export async function getServerSideProps() {

  const prismaSections = await prismaClient.sections.findMany({
    orderBy: {
      position: "asc"
    },
    where: {
      active: "Y"
    }
  });
  const prismaSetting = await prismaClient.setting.findFirst();

  return {
    props: {
      sections: prismaSections || [],
      setting: prismaSetting || {}
    }
  }
}
export default function ProductByName({ sections, setting }) {
  const mobile = useMobile();
  const getContentSection = (sectionName) => {
    const section = sections.find(section => section.section_name === sectionName);
    const content = JSON.parse(section?.content || "{}");
    return {
      ...section,
      content
    };
  }

  const content = getContentSection("section_hero")?.content;


  return <main>
    <Header
      noTransparent
      fixedHeader
      hiddenMenu
      mobile={mobile}
      content={content}
      menus={content?.menus || []}
    />
    <div className={cn("pt-20 lg:pt-32", CONTAINER_LP)}>
      <SectionDetailProduct mobile={mobile} setting={setting} />
    </div>
    <SectionFooter section={getContentSection("section_footer")} />
    <ButtonWhatsapp phone="" />

  </main>

}

function SectionDetailProduct({ mobile, setting }) {
  const router = useRouter()
  const categoryName = router.query?.category;
  const slug = router.query?.slug;

  const { data, isLoading } = useQuery({
    queryKey: productsQuery.detailProduct(slug),
    queryFn: async () => {
      const response = await getProductByName(slug);
      return response.data?.data || []
    }
  });

  const { data: categories } = useQuery({
    queryKey: productsQuery.similarCategory(slug),
    queryFn: async () => {
      const response = await getProductByCategory(categoryName);
      return response.data?.data || []
    }
  });
  const getSlidePerPreviewByScreen = () => {
    if (mobile?.mobileSm) return 1;
    if (mobile?.mobileMd) return 2;
    return 4;
  };

  return <section>
    <ButtonBack
      onClick={() => window.history.back(-1)}
      className="inline-flex !pl-0 items-center cursor-pointer gap-x-2 mb-3 text-lg font-cinzel tracking-wide"
      text="Kembali"
    />
    <div className="flex flex-col lg:flex-row gap-x-10 mb-32">
      <ProductImage data={data} />
      <ProductInfo data={data} setting={setting} />
    </div>

    <div className="mb-32">
      <div className="inline-flex mb-2 border-b text-lg border-b-green-600 font-cinzel tracking-wide">Jenis Serupa</div>
      <Swiper
        slidesPerView={getSlidePerPreviewByScreen()}
        spaceBetween={20}
        navigation={true}
        loop
        modules={[Navigation]}
        className="swipper-category"
      >
        {categories?.map((item, key) => (
          <SwiperSlide
            key={key}
          >
            <PreviewData data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

  </section>
}

function ProductImage({ data }) {
  return <div className="shrink-0 lg:block flex justify-center">
    {data?.image && <Image className="aspect-auto" src={mediaPath("products", data.image)} width={600} height={500} alt="" />}
  </div>
}

function ProductInfo({ data, setting }) {
  return (
    <div className="flex flex-col justify-between w-full">

      <div>
        <div className="flex flex-col gap-y-2 border-b pb-5 mb-5">
          {data?.category_name && <span className="text-gray-500 uppercase text-lg tracking-wider">{data.category_name}</span>}
          {data?.name && <span className="font-semibold text-slate-800 text-xl tracking-wide">{data.name}</span>}
          {data?.price && setting?.no_wa &&
            <div className="text-primary text-2xl font-semibold tracking-wide">
              Rp {formatNumberToPrice(data.price)}
            </div>
          }
        </div>
        {data?.description &&
          <div className="flex flex-col gap-y-3 mb-5">
            <h2 className="text-xl tracking-wide text-gray-600 font-semibold">Deskripsi</h2>
            <span className="text-gray-500 tracking-wide text-justify">{data.description}</span>
          </div>
        }
      </div>
      <div className="lg:mt-0 mt-4 mb-10">
        <Button className="w-full !p-6 !rounded-none flex gap-x-2 uppercase" onClick={() => window.open(`https://wa.me/${setting.no_wa}`)}>
          <FaWhatsapp size={20} />
          <span>Pesan melalui Whatsapp</span>
        </Button>
      </div>
    </div>
  )
}

function PreviewData({ data, onClick, showPrice }) {
  return <div
    onClick={() => onClick(data)}
    className=" lg:max-w-[330px] group mb-2 flex cursor-pointer flex-col shadow transition-all duration-500 ease-in-out hover:scale-105 hover:bg-primary">
    <Image src={mediaPath("products", data.image)} width="400" height="300" alt="" className="w-full object-cover" />
    <div className="pb-5 pl-5 pt-4 flex gap-y-1 flex-col font-poppins tracking-wider text-slate-700 group-hover:bg-primary group-hover:text-white">
      <span className="text-slate-900 group-hover:text-white text-lg">{data.name}</span>
      {data?.description && <span className="text-sm text-gray-400 line-clamp-2">{data?.description || ""}</span>}
      {data?.price && showPrice === "Y" && <div className="text-primary text-xl font-semibold mt-2 group-hover:text-white">Rp {formatNumberToPrice(data?.price)}</div>}
    </div>
  </div>
}
