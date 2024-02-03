import Meta from "@/components/Meta";
import SectionFooter from "@/components/features/sections/SectionFooter";
import { Header } from "@/components/layout/Header";
import ButtonBack from "@/components/ui/button/ButtonBack";
import ButtonWhatsapp from "@/components/ui/button/ButtonWa";
import ModalImage from "@/components/ui/modal/ModalImage";
import { CONTAINER_LP } from "@/lib/constant";
import { useMobile } from "@/lib/hooks";
import { slugString } from "@/lib/utils";
import cn from "classnames";
import parser from "html-react-parser";
import Image from "next/image";
import Router from "next/router";
import { useState } from "react";


const getSection = (sections, sectionName) => {
  return sections.find(section => section.section_name === sectionName);
};

export async function getServerSideProps({ params }) {
  const slug = params?.slug;
  const prismaSections = await prismaClient.sections.findMany({
    orderBy: {
      position: "asc"
    },
    where: {
      active: "Y"
    }
  });
  const prismaSetting = await prismaClient.setting.findFirst();

  const sectionProject = getSection(prismaSections, "section_projects");
  const contentProject = JSON.parse(sectionProject?.content || "{}");
  const project = contentProject.projects.find(project => slugString(project.title).includes(slug));

  return {
    props: {
      project,
      sections: prismaSections || [],
      setting: prismaSetting || {}
    }
  }  
}

export default function Project({ project, sections, setting }) {
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
    <Meta customTitle={`Projek Kami | ${project.title}`} />
    <Header
      noTransparent
      fixedHeader
      hiddenMenu
      mobile={mobile}
      content={content}
      menus={content?.menus || []}
    />
    <div className={cn("pt-20 lg:pt-32", CONTAINER_LP)}>
      <SectionProject data={project} />
    </div>
    <SectionFooter section={getContentSection("section_footer")} />
    <ButtonWhatsapp phone={setting?.no_wa} />
  </main>
}

function SectionProject({ data }) {
  const [images] = useState(data?.images || []);
  const [activeImage, setActiveImage] = useState();

  return <>
    {activeImage && <ModalImage gallery={images} src={activeImage} onHide={() => setActiveImage("")} />}
    <section>
      <ButtonBack className="pl-0" onClick={() => Router.push("/#section_projects")} />
      <div className="flex lg:flex-row flex-col gap-x-16 mt-4 mb-32">
        <div className="shrink-0 lg:block hidden relative w-[250px] h-[250px] md:w-[400px] md:h-[300px] xl:w-[550px] xl:h-[450px]">
          <Image className="rounded-xl" src={data?.images?.[0]} objectFit="cover" layout="fill" alt={data?.title} />
        </div>
        <div className="flex flex-col gap-y-4 max-w-[650px]">
          <span className="font-cinzel text-lg mb-1 after:border-b-2 after:content-[''] after:border-b-gray-600 after:block after:w-8 after:h-1 ">Project</span>
          <div data-first-word={data?.title?.split(" ")?.[0]} className="text-2xl lg:text-4xl font-medium font-cinzel tracking-wide text-gray-900">{data?.title || ""}</div>
          <div className="shrink-0 lg:hidden block w-[250px] h-[240px] md:w-[550px] md:h-[450px] relative">
            <Image className="rounded-xl" src={data?.images?.[0]} objectFit="cover" layout="fill" alt={data?.title} />
          </div>
          <div className="text-gray-400 max-w-[700px] mt-4">
            {parser(data?.description || "")}
          </div>
        </div>
        </div>
      <div className="text-xl tracking-wider text-center mb-4 text-gray-500 font-cinzel">GALLERY</div>
      <div className="flex flex-wrap gap-4 mb-32 min-[500px]:justify-center">
        {data?.images?.map((image, key) =>
          <div
            onClick={() => setActiveImage(image)}
            key={key}
            className="shrink-0 hover:opacity-80 cursor-pointer rounded-xl relative w-full  h-[200px] min-[500px]:w-[330px] min-[500px]:h-[230px]"
          >
            <Image
              key={key}
              src={image}
              alt={data?.title}
              objectFit="cover"
              className="h-auto max-w-full rounded-lg"
              layout="fill"
            />
          </div>
        )}
      </div>
    </section>
  </>
}