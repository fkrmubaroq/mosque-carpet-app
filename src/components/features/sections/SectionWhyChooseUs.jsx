import { Button } from "@/components/ui/button";
import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";
import { memo } from "react";
import ContentEditable from "react-contenteditable";
import {
  AiFillCaretRight
} from "react-icons/ai";
import { FaRegLightbulb } from "react-icons/fa6";
import { FiThumbsUp } from "react-icons/fi";
import SectionTitle from "./Fragment/SectionTitle";

const icons = [
  <FaRegLightbulb size={50} color="#15803d" />,
  <FiThumbsUp size={50} color="#15803d" />
]
function SectionWhyChooseUsMemo({ section, edit, onUpdateContent }) {
  const content = section?.content || {};

  const onUpdateItem = (index,value) => {
    const text = structuredClone(section.content.text);
    text.splice(index, 1, value);
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        text: text
      }
    })
  } 
  
  return (
    <>
      <div className="h-1 w-full border-t border-dashed"></div>
      <section
        className={cn("flex items-center gap-x-3 pt-20", MARGIN_EACH_SECTION)}
      >
        <div>
          <SectionTitle
            edit={edit}
            onUpdateContent={(name, value) => onUpdateContent({
              ...section,
              content: {
                ...section.content,
                [name]: value
              }
            })}
            classNameContext="border-b-primary"
            context={content?.heading || ""}
            title={content?.title || ""}
          />
          <div className="flex flex-col items-center gap-x-10 lg:flex-row lg:gap-y-0 gap-y-5 ">
            <div className="flex flex-col items-center lg:gap-x-24 lg:flex-row lg:gap-y-0 gap-y-7">
              {content?.text?.map((item, key) =>
                <ItemChooseUs
                  edit={edit}
                  onUpdateContent={(value) => onUpdateItem(key, value)}
                  key={key}
                  className="w-full"
                  icon={icons[key]}
                  description={item}
                />
              )}
            </div>
            <div className="flex w-2/3 justify-center">
              <Button className="flex items-center justify-center gap-x-2 !rounded-none !p-6">
                <span>OUR SERVICES</span>
                <AiFillCaretRight />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ItemChooseUs({
  icon,
  description,
  className,
  edit,
  onUpdateContent
}) {
  return (
    <div className={cn("flex items-center gap-x-7", className)}>
      <div className="shrink-0 max-w-[425px]">{icon}</div>
      {edit ?
        <ContentEditable
          className="font-normal tracking-wide text-gray-700 section-mode-edit"
          tagName="span"
          html={description}
          onChange={(e) => onUpdateContent(e.target.value)}
        /> :
        <span className="font-normal tracking-wide text-gray-700">
          {description}
        </span>
      }
    </div>
  );
}

const SectionWhyChooseUs = memo(SectionWhyChooseUsMemo);
export default SectionWhyChooseUs;