import { CONTAINER_LP } from "@/lib/constant";
import cn from "classnames";
import Image from "next/image";
import { memo, useRef } from "react";
import ContentEditable from "react-contenteditable";
import {
  AiOutlineInstagram,
  AiOutlineMail,
  AiOutlineWhatsApp
} from "react-icons/ai";
import { BiLogoTiktok } from "react-icons/bi";
import { BsFacebook } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import ToolboxFooter from "./Fragment/Toolbox/ToolboxFooter";
import ToolboxImage from "./Fragment/Toolbox/ToolboxImage";

function FooterMemo({ edit, section, onUpdateContent }) {
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

  const onUpdateContact = (name, value) => {
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        contact: {
          ...section.content.contact,
          [name]: value
        }
      }
    });
  }

  const onUpdateSocialMedia = (name, value) => {
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        social_media: {
          ...section.content.social_media,
          [name]: value
        }
      }
    });
  }

  return (
    <footer className="relative flex gap-x-4 bg-black pt-20 pb-28 md:px-5" id="section_footer">
      <div className={cn("flex lg:flex-row flex-col lg:gap-y-0 gap-y-8 justify-between w-full", CONTAINER_LP)}>
        <FooterLogo edit={edit} onUpdateContent={onUpdate} data={content} />
        <FooterContactItem
          edit={edit}
          data={content.contact}
          onUpdateContent={onUpdateContact}
        />
        <FooterSocialMedia edit={edit} onUpdateContent={onUpdateSocialMedia} data={content.social_media} />
        <FooterCopyright />
      </div>
    </footer>
  );
}

function FooterLogo({ edit, onUpdateContent, data }) {
  
  return (
    <div className="flex flex-col lg:items-center lg:justify-center">
      <div className={cn("relative", {
        "section-mode-edit group" : edit
      })}>
        {edit && <ToolboxImage value={data?.logo} name="logo" onUpdateContent={onUpdateContent} className="group-hover:block hidden" />}
        {data?.logo && <Image src={data?.logo} width="80" height="80" alt="" />}
      </div>
      {
        edit ?
        <ContentEditable
          html={data.logo_text}
          tagName="span"
          className="text-lg tracking-widest text-white mt-3 section-mode-edit"
          onChange={(e) => onUpdateContent("logo_text", e.target.value)}
         /> :
        <span className="text-lg tracking-widest text-white mt-3">{data.logo_text}</span>
      }

      {
        edit ?
          <ContentEditable
            html={data.tagline}
            tagName="span"
            className="text-gray-50 text-sm section-mode-edit"
            onChange={(e) => onUpdateContent("tagline", e.target.value)}
          />
          :
          <span className="text-gray-50 text-sm">{data.tagline}</span>
      }
    </div>
  );
}
function FooterContactItem({ data, edit, onUpdateContent }) {
  return (
    <div className="flex flex-col gap-y-3 text-white">
      <FooterTitleItem title="Contact" />
      <div className="flex flex-col gap-y-2">
        <FooterContentItem
          icon={<HiOutlineLocationMarker />}
          text={data?.address?.text || ""}
          data={data}
          edit={edit}
          name="address"
          onUpdateContent={(value) => onUpdateContent("address", value)} 
        />
        <FooterContentItem
          icon={<AiOutlineWhatsApp />}
          text={data?.phone_wa?.text || ""}
          data={data}
          edit={edit} 
          name="phone_wa"
          onUpdateContent={(value) => onUpdateContent("phone_wa", value)} 
        />
        <FooterContentItem
          icon={<AiOutlineMail />}
          text={data?.email?.text || ""}
          data={data}
          edit={edit}
          name="email"
          onUpdateContent={(value) => onUpdateContent("email", value)} 
        />
      </div>
    </div>
  );
}

function FooterTitleItem({ title }) {
  return <div className="text-2xl lg:text-3xl font-cinzel ">{title}</div>
}

function FooterContentItem({ name, data, icon, text, edit, onUpdateContent }) {
  const contentRef = useRef();
  return <div className="flex gap-x-2 items-center group cursor-pointer" ref={contentRef}>
    {icon}
    {edit ?
      <div className="relative w-full">
        <ContentEditable html={text} onChange={(e) => onUpdateContent({ ...data[name], text: e.target.value })} className="section-mode-edit peer" /> 
        <ToolboxFooter
          name={name}
          data={data}
          className="group-hover:block hidden peer-focus:block"
          onUpdateContent={onUpdateContent}
        />
      </div>:
      <div className="flex w-full" onClick={() => data[name]?.link && window.open(data[name].link)}>{text}</div>
    }
  </div>
}

function FooterSocialMedia({ data, edit, onUpdateContent }) {
  return (
    <div className="flex flex-col gap-y-3 text-white">
      <FooterTitleItem title="Social Media" />
      <div className="flex flex-col gap-y-2">
        <FooterContentItem 
          icon={<AiOutlineInstagram />}
          text={data?.instagram?.text}
          data={data}
          edit={edit}
          name="instagram"
          onUpdateContent={(value) => onUpdateContent("instagram", value)} 
        />
        <FooterContentItem
          icon={<BsFacebook />}
          text={data?.facebook?.text}
          data={data}
          edit={edit}
          name="facebook"
          onUpdateContent={(value) => onUpdateContent("facebook", value)} 
        />
        <FooterContentItem
          icon={<BiLogoTiktok />}
          text={data?.tiktok?.text}
          data={data}
          edit={edit}
          name="tiktok"
          onUpdateContent={(value) => onUpdateContent("tiktok", value)} 

        />
      </div>
    </div>
  );
}

function FooterCopyright() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="absolute text-center bottom-0 left-0 right-0 h-11 border-t-[0.1px] border-gray-600">
      <div className={cn(CONTAINER_LP, "flex h-full items-center justify-center text-white text-sm")}>
        Copyright &copy; {currentYear} | All Rights Reserved
      </div>
    </div>
  );
}

const SectionFooter = memo(FooterMemo);
export default SectionFooter;