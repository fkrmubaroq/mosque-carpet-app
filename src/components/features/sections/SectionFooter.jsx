import { CONTAINER_LP } from "@/lib/constant";
import cn from "classnames";
import Image from "next/image";
import { memo, useRef } from "react";
import ContentEditable from "react-contenteditable";
import {
  AiOutlineMail,
  AiOutlineWhatsApp
} from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import ToolboxFooter from "./Fragment/Toolbox/ToolboxFooter";
import ToolboxImage from "./Fragment/Toolbox/ToolboxImage";

function FooterMemo({ setting, edit, section, onUpdateContent }) {
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

  const onUpdateContact = (name, value, index) => {
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

  const onUpdateContentArray = (name, value, index) => {
    const cloneData = structuredClone(section.content[name]);
    cloneData.splice(index, 1, {
      ...cloneData[index],
      ...value,
    });

    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        [name]: cloneData
      }
    });
  }

  const onAddItem = (name) => {
    const newData = { link: "", text: "" };
    if (name === "social_media") {
      newData.image = "";
    }
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        [name]: [...section.content[name], newData]
      }
    })
  }

  console.log("sections ", section);

  return (
    <footer className="relative flex gap-x-4 bg-black pt-20 pb-28 md:px-5" id="section_footer">
      <div className={cn("flex lg:flex-row flex-col lg:gap-y-0 gap-y-8 justify-between w-full", CONTAINER_LP)}>
        <FooterLogo edit={edit} onUpdateContent={onUpdate} data={content} />
        <FooterContactItem
          setting={setting}
          edit={edit}
          data={content.contact}
          onUpdateContent={onUpdateContact}
        />
        <FooterCompanyAddress edit={edit} onUpdateContent={onUpdateContentArray} data={content.address} onAddItem={onAddItem} />
        <FooterSocialMedia edit={edit} onUpdateContent={onUpdateContentArray} data={content.social_media} onAddItem={onAddItem} />
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
          onChange={(e) => onUpdateContent("logo_text", e.currentTarget.textContent)}
         /> :
        <span className="text-lg tracking-widest text-white mt-3">{data.logo_text}</span>
      }

      {
        edit ?
          <ContentEditable
            html={data.tagline}
            tagName="span"
            className="text-gray-50 text-sm section-mode-edit"
            onChange={(e) => onUpdateContent("tagline", e.currentTarget.textContent)}
          />
          :
          <span className="text-gray-50 text-sm">{data.tagline}</span>
      }
    </div>
  );
}

function FooterContactItem({ setting, data, edit, onUpdateContent }) {
  return (
    <div className="flex flex-col gap-y-3 text-white">
      <FooterTitleItem title="Contact" />
      <div className="flex flex-col gap-y-2">
        
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
        {/* TODO : Address */}
        {/* {data.address?.map((item, key) =>
          <FooterContentItem
            key={key}
            icon={<HiOutlineLocationMarker />}
            text={item.text || ""}
            data={data}
            edit={edit}
            index={key}
            name="address"
            onUpdateContent={(value) => onUpdateContent("address", value, key)}
          />
        )}
        {edit &&
        <div onClick={() => onAddItem("address")} className="flex bg-primary rounded-md hover:bg-primary-hover gap-x-1 cursor-pointer mt-2 p-2 justify-center items-center">
          <FiPlus color="white" size={17} />
          <span className="text-sm">Tambah Alamat</span>
          </div>
        } */}
      </div>
    </div>
  );
}

function FooterCompanyAddress({ edit, onUpdateContent, data, onAddItem }) {
  return <div className="flex flex-col gap-y-3 text-white">
    <FooterTitleItem title="Alamat Kami" />
    <div className="flex flex-col gap-y-2" >
    {data?.map((address, key) => 
      <FooterContentItem
        key={key}
        icon={<HiOutlineLocationMarker />}
        text={address.text || ""}
        data={data}
        edit={edit}
        index={key}
        name="address"
        onUpdateContent={(value) => onUpdateContent("address", value, key)}
        />
        )}
    </div>
    {edit &&
      <div
        onClick={() => onAddItem("address")}
        className="flex bg-primary rounded-md hover:bg-primary-hover gap-x-1 cursor-pointer mt-2 p-2 justify-center items-center">
        <FiPlus color="white" size={17} />
        <span className="text-sm">Tambah Alamat</span>
      </div>
    }
  </div>
}

function FooterTitleItem({ title }) {
  return <div className="text-2xl lg:text-3xl font-cinzel ">{title}</div>
}

function FooterContentItem({ index, name, data, icon, text, edit, onUpdateContent }) {
  const contentRef = useRef();
  return <div className="flex gap-x-2 items-center group cursor-pointer" ref={contentRef}>
    {name === "social_media" ? icon &&
      <div className="w-8 h-6 relative">
        <Image
          src={icon}
          alt="image footer"
          layout="fill"
        />
      </div>
      : icon}
    {edit ?
      <div className="relative w-full">
        <ContentEditable html={text} onChange={(e) => onUpdateContent({ ...data[name], text: e.currentTarget.textContent })} className="section-mode-edit peer" /> 
        <ToolboxFooter
          name={name}
          index={index}
          data={data}
          className="group-hover:block hidden peer-focus:block"
          onUpdateContent={onUpdateContent}
        />
      </div>:
      <div className="flex w-full" onClick={() => data[name]?.link && window.open(data[name].link)}>{text}</div>
    }
  </div>
}

function FooterSocialMedia({ data, edit, onUpdateContent, onAddItem }) {
  return (
    <div className="flex flex-col gap-y-3 text-white">
      <FooterTitleItem title="Social Media" />
      <div className="flex flex-col gap-y-2">
        {data.map((socialMedia, key) =>
          <FooterContentItem 
            key={key}
            icon={socialMedia?.image || ""}
            text={socialMedia.text}
            data={data}
            index={key}
            edit={edit}
            name="social_media"
            onUpdateContent={(value) => onUpdateContent("social_media", value, key)} 
          />
        )}
      </div>
      {edit &&
        <div
          onClick={() => onAddItem("social_media")}
          className="flex bg-primary rounded-md hover:bg-primary-hover gap-x-1 cursor-pointer mt-2 p-2 justify-center items-center">
          <FiPlus color="white" size={17} />
          <span className="text-sm">Tambah Social Media</span>
        </div>
      }
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