import SectionFooter from "@/components/features/sections/SectionFooter";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import ButtonBack from "@/components/ui/button/ButtonBack";
import ButtonWhatsapp from "@/components/ui/button/ButtonWa";
import { getProductByName } from "@/lib/api/product";
import { CONTAINER_LP } from "@/lib/constant";
import { useMobile } from "@/lib/hooks";
import { prismaClient } from "@/lib/prisma";
import { productsQuery } from "@/lib/queryKeys";
import { formatNumberToPrice, mediaPath } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { FaWhatsapp } from "react-icons/fa";

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
export default function ProductByName({ sections }) {
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
      mobile={mobile}
      content={content}
      menus={content?.menus || []}
    />
    <div className={cn("pt-20 lg:pt-32",CONTAINER_LP)}>
      <SectionDetailProduct />
    </div>
    <SectionFooter section={getContentSection("section_footer")} />
    <ButtonWhatsapp phone="" />

  </main>

}

function SectionDetailProduct() {
  const router = useRouter()
  const slug = router.query?.name;

  const { data, isLoading } = useQuery({
    queryKey: productsQuery.detailProduct(slug),
    queryFn: async () => {
      const response = await getProductByName(slug);
      return response.data?.data || []
    }
  })

  return <section>
    <ButtonBack
      className="mb-3 pl-0 hover:bg-transparent"
      onClick={() => Router.push("/")}
      text="Kembali Ke Halaman utama"
    />
    <div className="flex flex-col lg:flex-row gap-x-10 mb-32">
      <ProductImage data={data} />
      <ProductInfo data={data} />
    </div>
  </section>
}

function ProductImage({ data }) {
  return <div className="shrink-0 lg:block flex justify-center">
    {data?.image && <Image className="aspect-auto" src={mediaPath("products",data.image)} width={600} height={500} alt="" />}
  </div>
}

function ProductInfo({ data }) {
  return (
    <div className="flex flex-col justify-between w-full">

    <div>
      <div className="flex flex-col gap-y-2 border-b pb-5 mb-5">
        {data?.category_name && <span className="text-gray-500 uppercase text-lg tracking-wider">{data.category_name}</span>}
        {data?.name && <span className="font-semibold text-slate-800 text-xl">{data.name}</span>}
        </div>
        {data?.description &&
          <div className="flex flex-col gap-y-3 mb-5">
            <h2 className="text-xl tracking-wide text-gray-600 font-semibold">Deskripsi</h2>
            <span className="text-gray-500">{data.description}</span>
          </div>
        }
        {data?.price &&
        <div className="text-primary text-2xl font-semibold">
          Rp {formatNumberToPrice(data.price)}
        </div>
        }
      </div>
      <div className="lg:mt-0 mt-4 mb-10">
        <Button className="w-full !p-6 !rounded-none flex gap-x-2 uppercase">
          <FaWhatsapp size={20}/>
        <span>Pesan melalui Whatsapp</span>  
        </Button>
      </div>
  </div>
  )
}