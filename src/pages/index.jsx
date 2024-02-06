import Meta from "@/components/Meta";
import SectionTitle from "@/components/features/sections/Fragment/SectionTitle";
import SectionHero from "@/components/features/sections/SectionHero";
import ShimmerSectionAboutUs from "@/components/features/sections/Shimmer/SectionAboutUs";
import ShimmerSectionContactUs from "@/components/features/sections/Shimmer/SectionContactUs";
import ShimmerSectionFooter from "@/components/features/sections/Shimmer/SectionFooter";
import ShimmerSectionOurProducts from "@/components/features/sections/Shimmer/SectionOurProducts";
import ShimmerSectionProjects from "@/components/features/sections/Shimmer/SectionProjects";
import ShimmerSectionVisionMision from "@/components/features/sections/Shimmer/SectionVisionMision";
import ShimmerSectionWhyChooseUs from "@/components/features/sections/Shimmer/SectionWhyChooseUs";
import ShimmerSectionArticle from "@/components/features/sections/Shimmer/ShimmerArticle";
import ShimmerSectionMapAddress from "@/components/features/sections/Shimmer/ShimmerSectionMapAddress";
import Banner from "@/components/ui/banner";
import ButtonWa from "@/components/ui/button/ButtonWa";
import { CONTAINER_LP } from "@/lib/constant";
import { TRACK_PAGE } from "@/lib/enum";
import { useTrackPage } from "@/lib/hooks";
import { debounce, getCookieName, setCookie } from "@/lib/utils";
import Section from "@/models/section";
import { Setting } from "@/models/setting";
import cn from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { default as Layload, default as LazyLoad } from "react-lazyload";

const SectionAboutUs = dynamic(() => import("@/components/features/sections/SectionAboutUs"), { ssr: false, loading:() => <ShimmerSectionAboutUs /> });
const SectionContactUs = dynamic(() => import("@/components/features/sections/SectionContactUs"), { ssr: false, loading: () => <ShimmerSectionContactUs /> });
const SectionFooter = dynamic(() => import("@/components/features/sections/SectionFooter"), { ssr: false, loading: () => <ShimmerSectionFooter /> });
const SectionOurProduct = dynamic(() => import("@/components/features/sections/SectionOurProducts"), { ssr: false, loading: () => <ShimmerSectionOurProducts /> });
const SectionProjects = dynamic(() => import("@/components/features/sections/SectionProjects"), { loading: () => <ShimmerSectionProjects /> });
const SectionVisionMision = dynamic(() => import("@/components/features/sections/SectionVisionMision"), { ssr: false, loading: () => <ShimmerSectionVisionMision /> });
const SectionWhyChooseUs = dynamic(() => import("@/components/features/sections/SectionWhyChooseUs"), { ssr: false, loading: () => <ShimmerSectionWhyChooseUs /> });
const SectionArticles = dynamic(() => import("@/components/features/sections/SectionArticles"), { ssr: false, loading: () => <ShimmerSectionArticle /> });
const SectionMapAddress = dynamic(() => import("@/components/features/sections/SectionMapAddress"), { ssr: false, loading: () => <ShimmerSectionMapAddress /> });

export async function getServerSideProps(context) {
  const section = new Section();
  const setting = new Setting();
  const resultSection = await section.getAll();

  const resultSetting = await setting.get();
  const popupCookie = JSON.parse(context.req.cookies?.[getCookieName("popup")] || "null");
  let showPopupCampaign = true;
  if (popupCookie?.status && popupCookie?.date) {
    showPopupCampaign = false;
  }

  return {
    props: {
      sections: resultSection.length ? JSON.parse(JSON.stringify(resultSection)) : [],
      setting: JSON.parse(JSON.stringify(resultSetting || '{}')),
      showPopupCampaign
    }
  }
}
export default function Home({ sections, setting, showPopupCampaign }) {  
  useTrackPage(TRACK_PAGE.LandingPage);
  const [showPopup, setShowPopup] = useState(showPopupCampaign);
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

    const popup = useMemo(() => setting?.popup?.url ? setting.popup : JSON.parse(setting?.popup || "{}"), []);
  return (
    <>
    <Meta title="Pusat Karpet Masjid " description="Ibadah Semakin nyaman"/>
    <main className="min-h-screen">
        {showPopup && popup?.srcImg && <Banner src={popup?.srcImg} redirectTo={popup.url} onClose={() => {
        setCookie("popup", JSON.stringify({ status: "active", date: new Date() }), 3);
        setShowPopup(false)
      }} />}
      <SectionHero mobile={mobile} section={getContentSection("section_hero")} />
        <div className={cn(CONTAINER_LP, "px-4")}>
          <Layload height={400} offset={100} once>
            <SectionAboutUs section={getContentSection("section_about_us")} />
          </Layload>
        </div>
        <SectionProjects section={getContentSection("section_projects")} />
        <div className={cn(CONTAINER_LP, "px-4")}>
          <Layload height={250} offset={100} once>
            <SectionVisionMision section={getContentSection("section_vision_mision")} />
          </Layload>
        </div>

        <div className={cn(CONTAINER_LP, "px-4")}>
          <Layload height={250} offset={100} once>
            <SectionWhyChooseUs section={getContentSection("section_why_choose_us")} />
          </Layload>
        </div>
        <Layload height={500} offset={100} once>
          <SectionContactUs setting={setting} mobile={mobile} section={getContentSection("section_contact_us")} />
        </Layload>

        <div className={cn(CONTAINER_LP, "px-4")}>
          <LazyLoad height={550} offset={150}>
            <SectionArticles mobile={mobile} />
          </LazyLoad>

          <LazyLoad height={300} offset={100}>
            <SectionOurProduct mobile={mobile} />
          </LazyLoad>

          <LazyLoad height={600} offset={100}>
            <SectionMapAddress section={getContentSection("section_map_address")} mobile={mobile} />
          </LazyLoad>
        </div>
        <SectionFooter setting={setting} section={getContentSection("section_footer")} />
        <ButtonWa phone={setting?.no_wa} />
      </main>
    </>
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