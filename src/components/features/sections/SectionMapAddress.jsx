import Textarea from "@/components/ui/form/Textarea";
import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";
import parser from "html-react-parser";
import ContentEditable from "react-contenteditable";

export default function SectionMapAddress({ edit, section, onUpdateContent }) {
  const content = section?.content || {};

  const onUpdate = (name, value) => {
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        [name]: value
      }
    });
  }

  return <section className={cn(MARGIN_EACH_SECTION, "@xs/mobile:!px-4")} id="section_map_address">
    {edit ? <ContentEditable
      html={content?.heading || ""}
      tagName="div"
      className="inline-flex mx-auto border-b text-lg border-b-green-600 font-cinzel tracking-wide section-mode-edit"
      onChange={(e) => {
        const value = e.currentTarget.textContent;
        onUpdate("heading", value);
      }}
    /> :
      <div
        className="inline-flex mx-auto border-b text-lg border-b-green-600 font-cinzel tracking-wide"
      >
        {content?.heading || ""}
      </div>
    }
    {edit && <Textarea
      autoSize
      className="mt-3"
      placeholder="Embed Alamat"
      value={content?.embed_map || ""}
      name="embed_map"
      onChange={(e) => onUpdate("embed_map", e.target.value)}
    />}
    {content?.embed_map && content.embed_map.includes("<iframe") &&
      <div className="mt-5 flex justify-center @xs/mobile:px-4">{parser(content.embed_map)}</div>}
  </section>
}