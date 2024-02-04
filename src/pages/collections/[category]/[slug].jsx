import Meta from "@/components/Meta";
import SectionFooter from "@/components/features/sections/SectionFooter";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import ButtonBack from "@/components/ui/button/ButtonBack";
import ButtonWhatsapp from "@/components/ui/button/ButtonWa";
import Ribbon from "@/components/ui/card/ribbon";
import { getProductByCategory, getProductByName } from "@/lib/api/product";
import { CONTAINER_LP } from "@/lib/constant";
import { useMobile } from "@/lib/hooks";
import { productsQuery } from "@/lib/queryKeys";
import { formatNumberToPrice, slugString } from "@/lib/utils";
import Section from "@/models/section";
import { Setting } from "@/models/setting";
import { useQuery } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export async function getServerSideProps() {

  const section = new Section();
  const setting = new Setting();

  const resultSections = await section.getAll();
  const parsedSection = JSON.parse(JSON.stringify(resultSections));

  const resultSetting = await setting.get();
  const parsedSetting = JSON.parse(JSON.stringify(resultSetting));

  return {
    props: {
      sections: parsedSection || [],
      setting: parsedSetting || {}
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
    <ButtonWhatsapp phone={setting?.no_wa} />

  </main>

}

function SectionDetailProduct({ mobile, setting }) {
  const router = useRouter()
  const categoryName = router.query?.category;
  const slug = router.query?.slug;

  const { data } = useQuery({
    queryKey: productsQuery.detailProduct(slug),
    queryFn: async () => {
      const response = await getProductByName(slug);
      return response.data?.data || {}
    }
  });

  const { data: products } = useQuery({
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

  const onClick = (data) => {
    const slug = slugString(data.name);
    const category = slugString(categoryName);
    Router.push(`/collections/${category}/${slug}-${data.id}`);
  }

  const image = JSON.parse(data?.image || "[]");
  const productSimilar = products?.filter(item => item.id !== data?.id);
  return <section>
    <Meta customTitle={data?.name} />
    <ButtonBack
      onClick={() => window.history.back(-1)}
      className="inline-flex !pl-0 items-center cursor-pointer gap-x-2 mb-3 text-lg font-cinzel tracking-wide"
      text="Kembali"
    />
    <div className="flex flex-col lg:flex-row gap-x-10 mb-32">
      <ProductImage image={image || []} />
      <ProductInfo data={data} setting={setting} />
    </div>

    {productSimilar?.length > 0 &&
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
          {data?.id && productSimilar.filter(item => item.id !== data.id)?.map((item, key) => (
            <SwiperSlide
              key={key}
            >
              <PreviewData data={item} setting={setting} showPrice={setting?.show_price} onClick={onClick} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    }

  </section>
}

function ProductImage({ image }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return <div className="max-w-[500px]">
    <Swiper
    slidesPerView={1}
    style={{
      '--swiper-navigation-color': '#fff',
      '--swiper-pagination-color': '#fff',
    }}
    spaceBetween={10}
    navigation={true}
    thumbs={{ swiper: thumbsSwiper }}
    modules={[FreeMode, Navigation, Thumbs]}
    className="mySwiper2"
  >
    {image.map((src, key) => <SwiperSlide key={key} className="relative">
      {image && <Image src={src} width={500} height={400} alt="" className="rounded-md" />}
    </SwiperSlide>
    )}
    </Swiper>
    <div >
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="swipper-gallery"
      >
        {image.map((src, key) => <SwiperSlide key={key} className="relative">
          {image && <Image src={src} width={500} height={400} alt="" className="rounded-md" />}
        </SwiperSlide>
        )}
      </Swiper>
    </div>
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

function PreviewData({ data, onClick, showPrice, setting }) {
  const image = JSON.parse(data?.image || "[]");
  const variantRibbon = setting?.ribbon?.split(".")?.[1] || "primary";
  const discountPrice = data.price - ((data.discount / 100) * data.price);

  return <div
    onClick={() => onClick(data)}
    className="lg:max-w-[330px] relative group mb-2 flex cursor-pointer flex-col shadow mt-2">
    {data?.discount && <Ribbon text={<span className="font-semibold">DISKON {data.discount}%</span>} variant={variantRibbon} />}
    {image?.[0] && <Image src={image[0]} width="400" height="300" alt="" className="w-full object-cover" />}
    <div className="pb-5 pl-5 pt-4 flex gap-y-1 flex-col font-poppins tracking-wider text-slate-700 group-hover:bg-primary group-hover:text-white">
      <span className="text-slate-900 group-hover:text-white text-lg font-semibold">{data.name}</span>
      {data?.description && <span className="text-sm text-gray-400 line-clamp-2">{data?.description || ""}</span>}
      {data?.price && showPrice === "Y" && 
        <>
          <div className={cn(" mt-2 group-hover:text-white", {
            "line-through text-gray-400 ": data.discount,
            "text-primary text-xl font-semibold ": !data.discount
          })}>Rp {formatNumberToPrice(data?.price)}
          </div>
          {data.discount && <div className="text-primary text-xl font-semibold group-hover:text-white">Rp {formatNumberToPrice(discountPrice)}</div>}
        </>

      }
    </div>
  </div>
}
