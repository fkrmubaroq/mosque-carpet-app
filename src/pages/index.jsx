import cn from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";

// import required modules
import SectionTitle from "@/components/features/sections/Fragment/SectionTitle";
import SectionAboutUs from "@/components/features/sections/SectionAboutUs";
import SectionArticles from "@/components/features/sections/SectionArticles";
import SectionContactUs from "@/components/features/sections/SectionContactUs";
import SectionFooter from "@/components/features/sections/SectionFooter";
import SectionHero from "@/components/features/sections/SectionHero";
import SectionOurProduct from "@/components/features/sections/SectionOurProducts";
import SectionVisionMision from "@/components/features/sections/SectionVisionMision";
import SectionWhyChooseUs from "@/components/features/sections/SectionWhyChooseUs";
import ButtonWa from "@/components/ui/button/ButtonWa";
import { CONTAINER_LP } from "@/lib/constant";
import { prismaClient } from "@/lib/prisma";
import { debounce } from "@/lib/utils";


export async function getServerSideProps() {

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
      sections: prismaSections || []
    }
  }
}
export default function Home({ sections }) {  
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
        <SectionArticles mobile={mobile} />
        <SectionOurProduct mobile={mobile} />
      </div>
      <SectionFooter section={getContentSection("section_footer")} />
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