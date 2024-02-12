
import SectionContainer from "@/components/features/sections";
import { Layout } from "@/components/layout";
import PingAnimation from "@/components/ui/Ping";
import { INIT_SECTIONS } from "@/lib/constant";
import { useEditSection } from "@/lib/hookStore";
import Section from "@/models/section";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export async function getServerSideProps() {
  const section = new Section();

  const resultSections = await section.getAll();
  const parsedSection = JSON.parse(JSON.stringify(resultSections));


  return {
    props: {
      sections: parsedSection || []
    }
  }
}


export default function Sections({ sections }) {
  const [
    setSectionsLp,
    sectionsLp,
    viewIdSection
  ] = useEditSection(useShallow(state => [
    state.setSectionsLp,
    state.sectionsLp,
    state.viewIdSection
  ]));

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const parsedSections = sections.map(section => {
      const parsedContent = JSON.parse(section.content || "{}");
      return { ...section, content: parsedContent };
    })
    setIsLoading(false);
    if (!parsedSections.length) {
      setSectionsLp(INIT_SECTIONS);
      return;
    }
    setSectionsLp(parsedSections);
  }, []);

  const onUpdateContent = (updatedSection, keyUpdate) => {
    setSectionsLp(
      sectionsLp.map((section, key) => {
        if (key === keyUpdate) return { ...updatedSection };
        return section;
      })
    )
  }

  return <Layout title="Sections">
    {isLoading && <LoaderOverlay />}
    <div className="flex flex-col gap-y-3 relative">
      {sectionsLp?.map((section, key) => <div key={key} className="relative">
        <SectionId name={section.section_name} show={viewIdSection} />
        <SectionContainer
          onUpdateContent={(updatedSection) => onUpdateContent(updatedSection, key)}
          section={section}
          sectionName={section.section_name}
        />
      </div>
      )}
    </div>
  </Layout>
}

function SectionId({ name, show }) {
  if (!name || !show) return <></>;

  return <div className={cn("absolute z-[9999] right-3 bg-secondary p-2 text-white",
    {
      "top-1/2": name === "section_articles" || name === "section_categories",
      "top-0": name !== "section_articles" && name !== "section_categories",
    }
  )}>
    #{name}
  </div>
}

function LoaderOverlay() {

  return <div className="fixed flex flex-col justify-center gap-y-4 items-center inset-0 z-[9999999]">
    <div className="fixed inset-0 h-full w-full bg-black opacity-70"></div>
    <PingAnimation width="w-7" height="h-7" />
    <div className="text-white z-[99999999] tracking-wide">Tunggu Sebentar</div>
  </div>
}