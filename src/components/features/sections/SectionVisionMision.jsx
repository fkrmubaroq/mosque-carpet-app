import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";
import { memo } from "react";
import ContentEditable from "react-contenteditable";
import { AiOutlineAim } from "react-icons/ai";
import { FiTrendingUp } from "react-icons/fi";
import ContentEditableSection from "./ContentEditable";

function SectionVisionMisionMemo({ section, edit, onUpdateContent, sectionName }) {
  const content = section?.content || {};

  return (
    <section
      id="section_vision_mision"
      className={cn(
        "flex flex-col gap-x-12 lg:flex-row",
        MARGIN_EACH_SECTION
      )}
    >
      <CardContent
        edit={edit}
        className="w-full bg-secondary text-white"
        icon={<AiOutlineAim color="white" size={50} />}
        title={content?.vision?.title || ""}
        description={content?.vision?.text}
        onUpdateContent={(name, value) => onUpdateContent({
          ...section,
          content: {
            ...section.content,
            vision: {
              ...section.content.vision,
              [name]: value
            }
          }
        })}
      />
      <CardContent
        textGray
        edit={edit}
        className="w-full"
        icon={<FiTrendingUp size={50} color="#eab308" />}
        title={content?.mision?.title || ""}
        onUpdateContent={(name, value) => onUpdateContent({
          ...section,
          content: {
            ...section.content,
            mision: {
              ...section.content.mision,
              [name]: value
            }
          }
        })}
        description={content?.mision?.text}
      />
    </section>
  );
}

function CardContent({ textGray, className, icon, title, description, edit, onUpdateContent }) {
  return (
    <div className={cn("flex flex-col gap-y-2 py-7 px-8", className)}>
      {icon && icon}
      {
        edit ?
          <ContentEditable
            html={title}
            className="text-2xl font-cinzel section-mode-edit"
            onChange={(e) => onUpdateContent("title", e.currentTarget.textContent)}
          />
          : <span className="text-2xl font-cinzel">{title}</span>
      }

      {
        edit ?
          <ContentEditableSection
            html={description}
            className={cn("font-poppins tracking-wide opacity-90 leading-7  section-mode-edit", { "text-gray-600": textGray })}
            onChange={(value) => onUpdateContent("text", value)}
          /> :
          <span className={cn("font-poppins tracking-wide opacity-90 leading-7", { "text-gray-600": textGray })}>
            {description}
          </span>
      }
    </div>
  );
}

const SectionVisionMision = memo(SectionVisionMisionMemo);

export default SectionVisionMision;