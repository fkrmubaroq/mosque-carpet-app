
import SectionContainer from "@/components/features/sections";
import { Layout } from "@/components/layout";
import { useEditSection } from "@/lib/hookStore";
import { prismaClient } from "@/lib/prisma";
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
    sectionsLp
  ] = useEditSection(useShallow(state => [
    state.setSectionsLp,
    state.sectionsLp
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

  console.log("section, ", sectionsLp);
  return <Layout title="Sections">
    <div className="flex flex-col gap-y-3 relative">
      {sectionsLp?.map((section, key) => <SectionContainer
        onUpdateContent={(updatedSection) => onUpdateContent(updatedSection, key)}
        section={section}
        sectionName={section.section_name}
      />)}
    </div>
  </Layout>
}