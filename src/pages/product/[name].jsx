import { Header } from "@/components/layout/Header";
import { useMobile } from "@/lib/hooks";
import { prismaClient } from "@/lib/prisma";

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
      mobile={mobile}
      content={content}
      menus={content?.menus || []}
    />
    {/* <SectionDetailProduct /> */}
  </main>

}