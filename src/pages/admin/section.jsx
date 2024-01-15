
import SectionContainer from "@/components/features/sections";
import { Layout } from "@/components/layout";
import { useEditSection } from "@/lib/hookStore";
import { prismaClient } from "@/lib/prisma";
import cn from "classnames";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export async function getServerSideProps() {
  const prismaSections = await prismaClient.sections.findMany({
    orderBy: {
      position: "asc"
    },
    where: {
      active: "Y"
    }
  });
  return {
    props: {
      sections: prismaSections || []
    }
  }
}

export default function Section({ sections }) {
  const [
    setSectionsLp,
    sectionsLp,
    viewIdSection
  ] = useEditSection(useShallow(state => [
    state.setSectionsLp,
    state.sectionsLp,
    state.viewIdSection
  ]));
  useEffect(() => {
    const parsedSections = sections.map(section => {
      const parsedContent = JSON.parse(section.content || "{}");
      return { ...section, content: parsedContent };
    })
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

  console.log("sectionsLp ", sectionsLp);

  return <Layout title="Sections">
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