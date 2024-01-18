import SectionFooter from "@/components/features/sections/SectionFooter";
import { Header } from "@/components/layout/Header";
import ButtonBack from "@/components/ui/button/ButtonBack";
import ButtonWhatsapp from "@/components/ui/button/ButtonWa";
import { Card, CardContent } from "@/components/ui/card";
import { Line, Shimmer } from "@/components/ui/shimmer";
import { getProductByCategory } from "@/lib/api/product";
import { CONTAINER_LP, MARGIN_EACH_SECTION } from "@/lib/constant";
import { useMobile } from "@/lib/hooks";
import { prismaClient } from "@/lib/prisma";
import { productsQuery } from "@/lib/queryKeys";
import { formatNumberToPrice, mediaPath, slugString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import Router, { useRouter } from "next/router";

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

export default function ProductCategory({ sections, setting }) {
  const mobile = useMobile();

  const router = useRouter()
  const categoryName = router.query?.category;

  const { data, isLoading } = useQuery({
    queryKey: productsQuery.getProducts,
    queryFn: async () => {
      const response = await getProductByCategory(categoryName);
      return response.data?.data || []
    }
  })

  const getContentSection = (sectionName) => {
    const section = sections.find(section => section.section_name === sectionName);
    const content = JSON.parse(section?.content || "{}");
    return {
      ...section,
      content
    };
  }

  const removeSlug = categoryName?.split("-").join(" ");
  const content = getContentSection("section_hero")?.content;

  return <main className="min-h-screen">
    <div className="h-[250px] w-full mb-12 lg:mb-20 lg:h-[350px]">
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
        <div className={cn("pt-28 lg:pt-48 relative")}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #000000 0%, #00000000 100%)",
            }}
          ></div>
          <h1
            className={cn(
              "lg:mb-24 lg:px-0 lg:text-5xl",
              "text-3xl font-light tracking-wider text-white",
              "relative text-center mb-6 font-poppins ",
              "uppercase",
            )}>
            {removeSlug}
          </h1>
        </div>
      </div>
    </div>
    <div className={cn(CONTAINER_LP, "px-4")}>
      {isLoading ? <ShimmerSection total={8} /> :
        <SectionOurProduct data={data} isLoading={isLoading} showPrice={setting?.show_price} />
      }
    </div>
    <SectionFooter section={getContentSection("section_footer")} />
    <ButtonWhatsapp phone="" />

  </main>
}

function SectionOurProduct({ data, showPrice }) {
  const router = useRouter();
  const categoryName = router.query?.category;
  const onClick = (data) => {
    const slug = slugString(data.name);
    const category = slugString(categoryName);
    Router.push(`/collections/${category}/${slug}-${data.id}`);
  }

  return <section className={MARGIN_EACH_SECTION}>
    <ButtonBack
      onClick={() => Router.push("/collections")}
      className="inline-flex !pl-0 items-center cursor-pointer gap-x-2 text-lg font-cinzel tracking-wide"
      text="Kembali"
    />
    <div className="flex gap-x-5 gap-y-5 flex-wrap mt-5">
      {
        data?.map((item, key) => <PreviewData key={key} data={item} onClick={onClick} showPrice={showPrice} />)
      }
    </div>
  </section>
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

function ShimmerSection({ total }) {
  return <div className="flex gap-x-5 gap-y-5 flex-wrap">
    {Array(total).fill(1).map((item, key) =>
    <Shimmer>
      <Card key={key} className="lg:w-[330px]">
          <Line width="w-full" height="h-[247px]" />
          <CardContent className="flex flex-col mt-5 gap-y-5">
            <Line width="w-[150px]" />
            <div className="flex flex-col gap-y-3">
              <Line width="w-full" />
              <Line width="w-full" />
            </div>
            </CardContent>
      </Card>
    </Shimmer>
    )
  }
  </div>
}