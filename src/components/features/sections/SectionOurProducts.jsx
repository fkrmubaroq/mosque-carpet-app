import { Button } from "@/components/ui/button";
import { getCategory } from "@/lib/api/category";
import { MARGIN_EACH_SECTION } from "@/lib/constant";
import { landingPageQuery } from "@/lib/queryKeys";
import { mediaPath, slugString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import Router from "next/router";
import { AiFillCaretRight } from "react-icons/ai";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ShimmerSectionOurProducts from "./Shimmer/SectionOurProducts";

export default function SectionOurProduct({ edit, mobile }) {
  const getSlidePerPreviewByScreen = () => {
    if (mobile?.mobileSm) return 1;
    if (mobile?.mobileMd) return 2;
    return 4;
  };

  const { data: categories, isLoading } = useQuery({
    queryKey: landingPageQuery.getCategories,
    queryFn: async () => {
      const params = {};
      const response = await getCategory(params);
      if (response.status !== 200) throw new Error();
      return response.data || [];
    }
  });



  if (isLoading) {
    return <ShimmerSectionOurProducts />
  }
  return (
    <section className={cn(MARGIN_EACH_SECTION, "@xs/mobile:!px-4")} id="section_categories">
      <div className="flex justify-between items-center">
        <div
          className="inline border-b text-lg border-b-green-600 font-cinzel tracking-wide"
        >
          Our Products
        </div>
        <div className="mb-3 font-cinzel text-3xl font-medium">
          <Button className="flex items-center justify-center gap-x-2 rounded-none !p-6" onClick={() => !edit && Router.push("/collections")}>
            <span className="mt-0.5">VIEW MORE</span>
            <AiFillCaretRight />
          </Button>
        </div>
      </div>
      <Swiper
        slidesPerView={getSlidePerPreviewByScreen()}
        spaceBetween={20}
        navigation={true}
        loop
        modules={[Navigation]}
        className="swipper-category"
      >
        {categories?.data?.map((item, key) => (
          <SwiperSlide key={key}>
            <PreviewData data={item} edit={edit} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function PreviewData({ data, edit }) {
  return <div
    onClick={() => {
      if (edit) return;
      const slug = slugString(data.category_name);
      Router.push(`/collections/${slug}`);
    }}
    className="group w-full mb-2 flex cursor-pointer flex-col shadow transition-all duration-500 ease-in-out hover:scale-105 hover:bg-primary">
    <div className="shrink-0 relative h-[200px]">
      <Image
        src={mediaPath("categories", data.image)}
        alt=""
        layout="fill"
        className="object-cover"
      />
    </div>
    <div className="pb-5 pt-4 text-center font-poppins tracking-wider text-slate-700 group-hover:bg-primary group-hover:text-white">
      {data.category_name}
    </div>
  </div>
}
