import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { CONTAINER_LP } from "@/lib/constant";
import cn from "classnames";
import parser from "html-react-parser";
import ContentEditable from "react-contenteditable";
import ContentEditableSection from "./ContentEditable";
import ToolboxImage from "./Fragment/Toolbox/ToolboxImage";

function HeroCard({
  title,
  text,
  footer,
  edit,
  onUpdateContent
}) {

  return (
    <div
      className="rounded-lg px-12 py-10 text-white lg:w-[500px] sm:w-[400px] w-full"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      {
        edit ?
          <ContentEditableSection
            tagName="h1"
            className="mb-4 text-xl option lg:text-2xl font-cinzel text-primary section-mode-edit outline-none"
            html={title}
            onChange={(value) => onUpdateContent("title", value)}
          />
          :
          <div className="mb-4 text-xl lg:text-3xl font-cinzel text-primary">{title}</div>
      }

      {
        edit ?
          <ContentEditableSection
            tagName="div"
            className="font-poppins text-sm lg:text-md line-clamp-3 font-light tracking-wide section-mode-edit outline-none"
            html={text}
            onChange={(value) => onUpdateContent("text", value)}
          />
          :
          <span className="font-poppins text-sm lg:text-md font-light tracking-wide line-clamp-3">
            {parser(text)}
          </span>
      }
      {footer}
    </div>
  );
}


export default function SectionHero({ edit, mobile = false, section, onUpdateContent }) {
  const content = section?.content || {};

  const onUpdateMenu = ({ index, value }) => {
    const dataMenu = structuredClone(content.menus);
    let data = {
      ...dataMenu[index],
      text: value
    };
    if (typeof value === 'object' && !Array.isArray(value)) {
      data = value
    }
    dataMenu.splice(index, 1, data)
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        menus: dataMenu
      }
    });
  }

  const onUpdateImage = (name, value) => onUpdateContent({
    ...section,
    content: {
      ...section.content,
      [name]: value
    }
  })

  return (
    <section className="h-[600px] w-full mb-24 lg:h-[700px]" id="section_hero">
      <Header
        edit={edit}
        mobile={mobile}
        content={content}
        menus={content?.menus || []}
        onUpdateContent={onUpdateMenu}
        onUpdateLogo={onUpdateImage}
      />
      <div
        className={cn(
          "absolute group w-full bg-black bg-center object-cover lg:h-[700px]",
        )}
        style={{
          backgroundImage: `url('${content?.banner}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `100% ${mobile?.mobileSm ? "100%" : ""}`,
        }}
      >
        <div className={cn("pt-28 lg:pt-48 relative", CONTAINER_LP)}>
          {
            edit &&
            <ToolboxImage
              value={content?.banner}
              name="banner"
              position="bottomRight"
              onUpdateContent={onUpdateImage}
              text="Ganti Banner"
              className="-bottom-20 !-right-3 cursor-pointer w-[130px]"
            />
          }
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #000000 0%, #00000000 50%)",
            }}
          ></div>
          {edit ? <ContentEditableSection
            html={content?.tagline || ""}
            tagName="h1"
            className={cn(
              "lg:mb-24 lg:w-full lg:max-w-[750px] lg:px-0 lg:text-2xl",
              "text-xl font-light tracking-wider text-white",
              "relative mx-auto mb-6 line-clamp-4 max-w-[450px] px-3 text-center font-poppins ",
              "section-mode-edit"
            )}
            onChange={(value) => {
              onUpdateContent({
                ...section,
                content: {
                  ...section.content,
                  tagline: value
                }
              })
            }}
          /> :
            <h1
              className={cn(
                "lg:mb-24 lg:w-full lg:max-w-[750px] lg:px-0 lg:text-2xl",
                "text-xl font-light tracking-wider text-white",
                "relative mx-auto mb-6 max-w-[450px] px-3 text-center font-poppins ",
              )}>
              {parser(content?.tagline || "")}
            </h1>
          }
          <div className="relative mx-4 flex gap-x-5">
            <HeroCard
              edit={edit}
              onUpdateContent={(name, value) => {
                onUpdateContent({
                  ...section,
                  content: {
                    ...section.content,
                    sub_tagline: {
                      ...section.content.sub_tagline,
                      [name]: value
                    }
                  }
                })
              }}
              title={content?.sub_tagline?.title || ""}
              text={content?.sub_tagline?.text || ""}
              footer={
                <div className="mt-5 flex flex-col gap-x-4 gap-y-4 lg:flex-row lg:gap-y-0">
                  {edit ? <ContentEditable
                    html={content?.button_primary}
                    tagName="div"
                    className="!rounded-none flex justify-center items-center !px-8 section-mode-edit font-cinzel max-w-[200px] !py-3 bg-primary"
                    onChange={(e) => {
                      const value = e.currentTarget.textContent
                      onUpdateContent({
                        ...section,
                        content: {
                          ...section.content,
                          button_primary: value
                        }
                      })
                    }}
                  /> : content?.button_primary &&
                  <Button className="!rounded-none !px-10 !py-6 font-cinzel">
                    {content?.button_primary || ""}
                  </Button>
                  }
                  {edit ? <ContentEditable
                    html={content?.button_secondary}
                    tagName="div"
                    className="!rounded-none !px-8 !py-3 border border-white max-w-[220px] section-mode-edit font-cinzel"
                    onChange={(e) => {
                      const value = e.currentTarget.textContent
                      onUpdateContent({
                        ...section,
                        content: {
                          ...section.content,
                          button_secondary: value
                        }
                      })
                    }}
                  /> : content?.button_secondary &&
                  <Button
                    variant="ghost"
                    className="!rounded-none border border-white hover:!text-black !px-10 !py-6 font-cinzel"
                  >
                    {content?.button_secondary || ""}
                  </Button>
                  }
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}