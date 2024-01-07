import SectionFooter from "@/components/features/sections/SectionFooter";
import { Header } from "@/components/layout/Header";
import ButtonWhatsapp from "@/components/ui/button/ButtonWa";
import { getCategory } from "@/lib/api/category";
import { CONTAINER_LP, MARGIN_EACH_SECTION } from "@/lib/constant";
import { prismaClient } from "@/lib/prisma";
import { collectionsQuery } from "@/lib/queryKeys";
import { debounce, mediaPath } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";

export async function getServerSideProps() {

  const prismaSections = await prismaClient.sections.findMany({
    orderBy: {
      position: "asc"
    },
    where: {
      active: "Y"
    }
  })
  return {
    props: {
      sections: prismaSections || []
    }
  }
}

export default function Collections({ sections }) {
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

  const content = getContentSection("section_hero")?.content;
  console.log("g", getContentSection("section_hero"));
  return <main className="min-h-screen">
    <div className="h-[250px] w-full mb-12  lg:mb-20 lg:h-[350px]">
      <Header
        mobile={mobile}
        content={content}
        menus={content?.menus || []}
      />
      <div
        className={cn(
          "absolute h-[250px] group w-full bg-black bg-top object-cover lg:h-[350px]",
        )}
        style={{
          backgroundImage: `url('${content?.banner}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `100% ${mobile?.mobileSm ? "100%" : ""}`,
        }}
      >
        <div className={cn("pt-28 lg:pt-48 relative", CONTAINER_LP)}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #000000 0%, #00000000 90%)",
            }}
          ></div>
          <h1
            className={cn(
              "lg:mb-24 lg:w-full lg:max-w-[750px] lg:px-0 lg:text-5xl",
              "text-3xl font-light tracking-wider text-white",
              "relative mx-auto mb-6 max-w-[450px] px-3 text-center font-poppins ",
            )}>
            COLLECTIONS
          </h1>
        </div>
      </div>
    </div>
    <div className={cn(CONTAINER_LP, "px-4")}>
     <SectionOurProduct />
    </div>
    <SectionFooter section={getContentSection("section_footer")} />
    <ButtonWhatsapp phone="" />

  </main>
}

function SectionOurProduct() {

  const { data: categories } = useQuery({
    queryKey: collectionsQuery.getCategories,
    queryFn: async () => {
      const response = await getCategory();
      if (response.status !== 200) throw new Error();
      return response.data || [];
    }
  });

  const onClickCard = (data) => {
    const slug = data.category_name?.split(" ").join("-");
    Router.push(`/product-category/${slug.toLowerCase()}`);
  };

  return <section className={MARGIN_EACH_SECTION}>
    <div
    className="inline border-b text-lg border-b-green-600 font-cinzel tracking-wide"
  >
    Our <span className="text0primary">Collections</span>
  </div>
    <div className="flex gap-x-5 gap-y-5 flex-wrap mt-5">
      {
        categories?.data?.map((item, key) => <PreviewData key={key} data={item} onClick={onClickCard} />)
    }
    </div>
  </section>
}

function PreviewData({ data, onClick }) {
  return <div
    onClick={() => onClick(data)}
    className="max-w-[380px] group mb-2 flex cursor-pointer flex-col shadow transition-all duration-500 ease-in-out hover:scale-105 hover:bg-primary">
    <Image src={mediaPath("categories", data.image)} width="400" height="300" alt="" className="w-full object-cover" />
    <div className="pb-5 pt-4 text-center font-poppins tracking-wider text-slate-700 group-hover:bg-primary group-hover:text-white">
      {data.category_name}
    </div>
  </div>
}
