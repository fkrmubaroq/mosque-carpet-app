import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form/input";
import { CONTAINER_LP } from "@/lib/constant";
import { useEditSection } from "@/lib/hookStore";
import cn from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import Router from "next/router";
import { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import {
  AiOutlineClose
} from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { useShallow } from "zustand/react/shallow";

const Portal = dynamic(import("@/components/ui/portal").then((module) => module.default), { ssr: false });

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
        <ContentEditable
          tagName="h1"
            className="mb-4 text-xl lg:text-3xl font-cinzel text-primary section-mode-edit outline-none"
          html={title}
          onChange={(e) => onUpdateContent("title", e.target.value)}
        />
          :
        <div className="mb-4 text-xl lg:text-3xl font-cinzel text-primary">{title}</div>
      }

      {
        edit ? 
          <ContentEditable
            tagName="div"
            className="font-poppins text-sm lg:text-md font-light tracking-wide section-mode-edit outline-none"
            html={text}
            onChange={(e) => onUpdateContent("text",e.target.value)}
          />
          :
        <span className="font-poppins text-sm lg:text-md font-light tracking-wide">
          {text}
        </span>
      }
      {footer}
    </div>
  );
}
function NavigationHeader({ onUpdateContent, edit = false, menus }) {
  const [isEditing, setIsEditing, editingIndex] = useEditSection(useShallow(state => [state.isEditing, state.setIsEditing, state.editingIndex]));
  const inputRef = useRef();
  
  return (
    <nav className="flex h-16 list-none items-center justify-center gap-x-5 text-lg font-light tracking-wide text-white">
      {menus.map((item, key) => (
        <li className={cn("cursor-pointer h-10 flex items-center px-2", {
          "section-mode-edit": edit,
        })} key={key} onClick={(e) => {
          if (item.link && !edit) {
            Router.push(item.link);
            return;
          }
          if (edit) {
            setIsEditing(true, key);
            if (!inputRef.current) return;
            inputRef.current.select();
          }
          }}>
          {isEditing && editingIndex >= 0 && editingIndex === key ?
            <Input
              ref={inputRef}
              className="!bg-transparent !h-10 hover:bg-transparent !border-none focus:!ring-0 !text-lg !w-auto"
              value={item.menu}
              onChange={(e) => onUpdateContent({ index: key, value: e.target.value })}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  onUpdateContent({ index: key, value: e.target.value });
                  setIsEditing(false, null);
                }
              }}
            /> : item.menu}
        </li>
      ))}
    </nav>
  );
}
function MobileNavigationHeader({ menus }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="h-11 w-11 flex justify-center items-center cursor-pointer" onClick={() => setIsOpen(true)}>
        <RxHamburgerMenu color="white" size={30} />
      </div>

      <Portal>
        <div className={cn("inset-0 bg-black absolute opacity-40", { "hidden": !isOpen })} onClick={() => setIsOpen(false)}></div>
        <div
          className={cn(
            "absolute left-0 right-0 bg-white p-5 transition-all duration-300 z-50",
            {
              "-top-[1000px]": !isOpen,
              "top-0": isOpen,
            }
          )}
        >
          <div
            className="absolute right-6 top-5 cursor-pointer flex h-8 w-8 justify-center text-lg text-black"
            onClick={() => setIsOpen(false)}
          >
            <AiOutlineClose size={25} />
          </div>
          <div className="flex flex-col items-center justify-center gap-y-5">
            <div className="flex flex-col items-center gap-y-1">
              <Image src="/img/logo-black.png" width="50" height="50" alt="" />
              <span className="text-lg font-semibold tracking-wide text-black">
                AL - HIJRA
              </span>
            </div>
            <div className="mb-6 flex flex-col gap-y-8">
              {menus.map((item, key) => (
                <div className="flex justify-center" key={key} onClick={() => item.link && Router.push(item.link)}>
                  {item.menu}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
}

function Header({ edit, mobile, menus, onUpdateContent }) {
  return (
    <header className="absolute left-0 right-0 z-50 px-3 lg:px-0">
      <div className={cn("mt-4 flex items-center justify-between", CONTAINER_LP)}>
        <div className="flex items-center justify-center gap-x-3">
          <Image src="/img/logo.png" width="36" height="36" alt="" />
          <span className="text-lg text-white">Al-Hijra</span>
        </div>
        {mobile.mobileMd || mobile.mobileSm ? (
          <MobileNavigationHeader edit={edit} menus={menus} />
        ) : (
          <NavigationHeader edit={edit} menus={menus} onUpdateContent={onUpdateContent} />
        )}
      </div>
    </header>
  );
}

export default function SectionHero({ edit, mobile = false, section, onUpdateContent }) {
  const content = section?.content || {};
  const [isEditing, setIsEditing, editingIndex,] = useEditSection(useShallow(state => [state.isEditing, state.setIsEditing, state.editingIndex]));
  const onUpdateMenu = ({ index, value }) => {
    const dataMenu = structuredClone(content.menus);
    dataMenu.splice(index, 1, {
      ...dataMenu[index],
      menu: value
    })    
    onUpdateContent({
      ...section,
      content: {
        ...section.content,
        menus: dataMenu
      }
    });
  }
  return (
    <section className="h-[500px] w-full lg:mb-20 lg:h-[700px]">
      <Header
        edit={edit}
        mobile={mobile}
        menus={content?.menus || []}
        onUpdateContent={onUpdateMenu} />
      <div
        className={cn(
          "absolute h-[500px] w-full bg-black bg-center object-cover lg:h-[700px]"
        )}
        style={{
          backgroundImage: `url('${content?.image}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `100% ${mobile?.mobileSm ? "100%" : ""}`,
        }}
      >
        <div className={cn("pt-28 lg:pt-48", CONTAINER_LP)}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #000000 0%, #00000000 50%)",
            }}
          ></div>
          {edit ? <ContentEditable
            html={content?.tagline || ""}
            tagName="h1"

            className={cn(
              "lg:mb-24 lg:w-full lg:max-w-[750px] lg:px-0 lg:text-2xl",
              "text-xl font-light tracking-wider text-white",
              "relative mx-auto mb-6 max-w-[450px] px-3 text-center font-poppins ",
              "section-mode-edit outline-none"
            )}
            onChange={(e) => {
              const value = e.target.value;
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
              {content?.tagline || ""}
            </h1>
          }
          <div className="relative mx-4 flex gap-x-5">
            <HeroCard
              edit={edit}
              onUpdateContent={(name, value) => {
                console.log(name, value)
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
                  <Button className="!rounded-none !px-10 !py-6 font-cinzel">
                    READ MORE
                  </Button>
                  <Button
                    variant="ghost"
                    className="!rounded-none border border-white hover:!text-black !px-10 !py-6 font-cinzel"
                  >
                    VIEW COLLECTIONS
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}