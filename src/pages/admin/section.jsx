
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
    isEditing,
    setIsEditing,
    editingIndex,
    setSectionsLp,
    sectionsLp
  ] = useEditSection(useShallow(state => [
    state.isEditing,
    state.setIsEditing,
    state.editingIndex,
    state.setSectionsLp,
    state.sectionsLp
  ]));
  useEffect(() => {
    console.log("Sections ", sections);
    const parsedSections = sections.map(section => {
      const parsedContent = JSON.parse(section.content || "{}");
      return { ...section, content: parsedContent };
    })
    setSectionsLp(parsedSections);

    const clickOutside = (e) => {
      console.log("e ", e);
      const sectionModeEdit = "section-mode-edit";

      if (e.target.closest(`.${sectionModeEdit}`) || e.target.classList.contains(sectionModeEdit)) return;
      setIsEditing(false, null);
      
    }
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    }
  }, []);

  const onUpdateContent = (updatedSection, keyUpdate) => {
    setSectionsLp(
      sectionsLp.map((section, key) => {
        if (key === keyUpdate) return { ...updatedSection };
        return section;
      })
    )
  }

  console.log("sectionLp ", sectionsLp);

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