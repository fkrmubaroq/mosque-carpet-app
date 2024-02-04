import cn from "classnames";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// import required modules
import Meta from "@/components/Meta";
import SectionTitle from "@/components/features/sections/Fragment/SectionTitle";
import SectionAboutUs from "@/components/features/sections/SectionAboutUs";
import SectionArticles from "@/components/features/sections/SectionArticles";
import SectionContactUs from "@/components/features/sections/SectionContactUs";
import SectionFooter from "@/components/features/sections/SectionFooter";
import SectionHero from "@/components/features/sections/SectionHero";
import SectionMapAddress from "@/components/features/sections/SectionMapAddress";
import SectionOurProduct from "@/components/features/sections/SectionOurProducts";
import SectionProjects from "@/components/features/sections/SectionProjects";
import SectionVisionMision from "@/components/features/sections/SectionVisionMision";
import SectionWhyChooseUs from "@/components/features/sections/SectionWhyChooseUs";
import Banner from "@/components/ui/banner";
import ButtonWa from "@/components/ui/button/ButtonWa";
import { getInformationIp, visitorPage } from "@/lib/api/visitor";
import { CONTAINER_LP } from "@/lib/constant";
import { landingPageQuery } from "@/lib/queryKeys";
import { debounce, getCookieName, setCookie } from "@/lib/utils";
import Section from "@/models/section";
import { Setting } from "@/models/setting";
import { useQuery } from "@tanstack/react-query";

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
      setting: JSON.parse(JSON.stringify(resultSetting?.[0] || '{}')),
      showPopupCampaign:false
    }
  }
}
export default function Home({ sections, setting, showPopupCampaign }) {  
  const [showPopup, setShowPopup] = useState(showPopupCampaign);
  const [mobileMd, setMobileMdWidth] = useState(false);
  const [mobileSm, setMobileSm] = useState(false);
  const mobile = {
    mobileMd,
    mobileSm,
  };

  const { data: ip } = useQuery({
    queryKey: landingPageQuery.informationIp,
    queryFn: async () => {
      const response = await getInformationIp();
      const data = await response.json();
      return data?.ip || null
    },
  });

  const { data: visitor } = useQuery({
    enabled: !!ip,
    queryKey: landingPageQuery.visitorPage,
    queryFn: visitorPage,
  });

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

  
  console.log("sections", sections);
  const popup = useMemo(() => setting?.popup?.url ? setting.popup : JSON.parse(setting?.popup || "{}"), []);
  return (
    <>
    <Meta title="Pusat Karpet Masjid " description="Ibadah Semakin nyaman"/>
    <main className="min-h-screen">
      {showPopup && <Banner src={popup?.srcImg} redirectTo={popup.url} onClose={() => {
        setCookie("popup", JSON.stringify({ status: "active", date: new Date() }), 3);
        setShowPopup(false)
      }} />}
      <SectionHero mobile={mobile} section={getContentSection("section_hero")} />
      <div className={cn(CONTAINER_LP, "px-4")}>
          <SectionAboutUs section={getContentSection("section_about_us")} />
      </div>
        <SectionProjects section={getContentSection("section_projects")} />
      <div className={cn(CONTAINER_LP, "px-4")}>
        <SectionVisionMision section={getContentSection("section_vision_mision")} />
        <SectionWhyChooseUs section={getContentSection("section_why_choose_us")} />
        <SectionContactUs setting={setting} mobile={mobile} section={getContentSection("section_contact_us")} />
        <SectionArticles mobile={mobile} />
        <SectionOurProduct mobile={mobile} />
        <SectionMapAddress section={getContentSection("section_map_address")} mobile={mobile} />
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