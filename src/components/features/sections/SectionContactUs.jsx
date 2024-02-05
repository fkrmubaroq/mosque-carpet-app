import { Button } from "@/components/ui/button";
import { CONTAINER_LP, MARGIN_EACH_SECTION } from "@/lib/constant";
import { useApi, useButtonlick } from "@/lib/hooks";
import cn from "classnames";
import { useState } from "react";
import ContentEditable from "react-contenteditable";
import {
  AiOutlineWhatsApp
} from "react-icons/ai";
import ModalContactLink from "./Fragment/ModalContactLink";

const initModal = Object.freeze({
  show: false,
})
export default function SectionContactUs({ setting, mobile = false, edit, section, onUpdateContent }) {
  const ipAddress = useApi();
  const { trackButtonClick } = useButtonlick();

  const content = section?.content || {};
  const [modal, setModal] = useState(initModal);
  const onUpdate = (name, value) => {
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        [name]: value
      }
    });
  }
  return (
  <>
      {
        edit && modal.show &&
        <ModalContactLink
          data={modal.data}
          show={modal.show}
          onHide={() => setModal(initModal)}
          onUpdateContent={(name, value) => {
            onUpdate(name, value);
            setModal(initModal);
          }}
        />
      }
      <section className={cn("h-[440px]", MARGIN_EACH_SECTION)} id="section_contact_us">
      <div
        className="absolute left-0 h-[440px] w-full bg-bottom object-cover"
        style={{
          backgroundImage: `url('/img/img-contact-us.webp')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `100% ${mobile ? "100%" : ""}`,
        }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(${mobile?.mobileMd ? "60deg" : "260deg"
              }, #000000 0%, #00000000 100%)`,
          }}
        ></div>
        <div
          className={cn(
            "relative z-10 flex h-full items-center justify-end",
            CONTAINER_LP
          )}
        >
          <div className="px-4 lg:px-0">
            {
              edit ?
              <ContentEditable
                className="mb-4 font-cinzel text-2xl leading-normal text-white lg:max-w-[700px] lg:text-5xl section-mode-edit"
                html={content?.title}
                onChange={(e) => onUpdate("title", e.currentTarget.textContent)}
              /> : 
              content?.title &&
              <div className="mb-4 font-cinzel text-2xl leading-normal text-white lg:max-w-[700px] lg:text-5xl">
                {content.title}
              </div>            
            }

            {
              edit ? 
                <ContentEditable
                tagName="span"
                className="text-lg tracking-wider text-white section-mode-edit"
                html={content?.text}
                onChange={(e) => onUpdate("text", e.currentTarget.textContent)}
              />
              :
              content?.text &&
              <span className="text-lg tracking-wider text-white">
                {content?.text}
              </span>
            }
              <div className="mt-4">
                {ipAddress &&
                  <Button
                    className={cn("flex font-cinzel text-lg items-center justify-center gap-x-2 !rounded-none !p-6 text-white")}
                    onClick={() => {
                      if (!edit && setting?.no_wa && ipAddress) {
                        trackButtonClick(ipAddress);
                        window.open(`https://wa.me/${setting.no_wa}`);
                        return;
                      }
                    }}
                  >
                    <AiOutlineWhatsApp size={mobile.mobileMd ? 18 : 20} />
                    {edit ? <ContentEditable className="section-mode-edit" html={content?.button_primary} tagName="span" onChange={(e) => {
                      const value = e.currentTarget.textContent;
                      onUpdateContent({
                        ...section,
                        content: {
                          ...section.content,
                          button_primary: value
                        }
                      })
                    }} /> :
                      <span>{content?.button_primary || ""}</span>
                    }
                  </Button>
                }
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}