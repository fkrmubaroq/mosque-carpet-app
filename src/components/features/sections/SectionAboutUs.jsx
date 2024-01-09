import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";
import Image from "next/image";
import { memo } from "react";
import ContentEditable from "react-contenteditable";
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
        MARGIN_EACH_SECTION
      )}
    >
      <div className="lg:pr-40">
        <SectionTitle
          context={content?.heading || ""}
          title={content?.title || ""}
          onUpdateContent={onUpdate}
          edit={edit}
        />

        {edit ? <ContentEditable
          html={content?.text}
          className="mb-5 font-poppins text-lg tracking-wide text-gray-500 lg:mb-0 section-mode-edit"
          onChange={(e) => onUpdate("text", e.target.value)}
        /> :
          <div className="mb-5 font-poppins text-lg tracking-wide text-gray-500 lg:mb-0">
            {content?.text || ""}
          </div>
        }
      </div>

      <div className="relative shrink-0 flex justify-center w-full lg:w-[500px] group ">
        {edit && <ToolboxImage value={content.image} name="image" onUpdateContent={onUpdate} className="group-hover:block hidden"/>}
        {content?.image &&
          <div className={cn({ "section-mode-edit p-1": edit })}>
            <Image
              className="rounded-lg"
              src={content?.image}
              width="450"
              height="300"
              alt=""
            />
          </div>
          }
      </div>
    </section>
  );
}

const SectionAboutUs = memo(SectionAboutUsMemo);
export default SectionAboutUs;