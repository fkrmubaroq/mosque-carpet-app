import { MARGIN_EACH_SECTION, placeholderImage } from "@/lib/constant";
import cn from "classnames";
import parser from "html-react-parser";
import Image from "next/image";
import { memo } from "react";
import ContentEditableSection from "./ContentEditable";
import SectionTitle from "./Fragment/SectionTitle";
import ToolboxImage from "./Fragment/Toolbox/ToolboxImage";

function SectionAboutUsMemo({ section, edit, onUpdateContent }) {
  const content = section?.content || {};

  const onUpdate = (name, value) => {
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        [name]: value
      }
    })
  }

  return (
    <section
      id="section_about_us"
      className={cn(
        "mb-16 flex flex-col items-center gap-x-3 pt-20 lg:flex-row",
        "@xs/mobile:!flex-col @xs/mobile:!mb-16 @xs/mobile:px-4",
        MARGIN_EACH_SECTION,
      )}
    >
      <div className="lg:pr-20 xl:pr-40 @xs/mobile:!pr-0">
        <SectionTitle
          context={content?.heading || ""}
          title={content?.title || ""}
          onUpdateContent={onUpdate}
          edit={edit}
        />

        {edit ? <ContentEditableSection
          html={content?.text}
          className="mb-5 font-poppins text-lg tracking-wide text-gray-500 @xs/mobile:!mb-5 lg:mb-0 section-mode-edit"
          onChange={(value) => onUpdate("text", value)}
        /> :
          <div className="mb-5 font-poppins text-lg tracking-wide text-gray-500 lg:mb-0">
            {parser(content?.text || "")}
          </div>
        }
      </div>

      <div className="relative shrink-0 flex justify-center w-full lg:w-[500px] group @xs/mobile:w-full">
        {edit && <ToolboxImage value={content.image} name="image" onUpdateContent={onUpdate} className="group-hover:block hidden" />}
        <div className={cn("relative w-[450px] h-[300px] @xs/mobile:!px-4 @xs/mobile:!w-[320px] ", { "section-mode-edit p-1": edit })}>
          <Image
            className="rounded-lg"
            src={content?.image || placeholderImage}
            fill
            alt=""
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}

const SectionAboutUs = memo(SectionAboutUsMemo);
export default SectionAboutUs;