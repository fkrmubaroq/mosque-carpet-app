import { CONTAINER_LP } from "@/lib/constant";
import { useEditSection } from "@/lib/hookStore";
import cn from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import Router from "next/router";
import { useState } from "react";
import ContentEditable from "react-contenteditable";
import { AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import ToolboxHero from "../features/sections/Fragment/Toolbox/ToolboxHero";
import ToolboxImage from "../features/sections/Fragment/Toolbox/ToolboxImage";

const Portal = dynamic(import("@/components/ui/portal").then((module) => module.default), { ssr: false });

export function Header({ noTransparent, hiddenMenu, content, edit, mobile, menus, onUpdateContent, onUpdateLogo }) {
  return (
    <header className={cn("absolute left-0 right-0 z-50 px-3 lg:px-0 @xs/mobile:!px-3 ",
      {
        "bg-white shadow-md": noTransparent,
        "text-white": !noTransparent,
        "flex items-center h-16 !fixed": hiddenMenu
      })}>
      <div className={cn("flex items-center justify-between", CONTAINER_LP, {
        "mt-4": !noTransparent,
        "!mx-0": hiddenMenu
      })}>
        <div className={cn("flex items-center justify-center gap-x-3 cursor-pointer")} onClick={() => !edit && Router.push("/")}>
          <div className={cn("flex ", {
            "group section-mode-edit": edit
          })}>
            {
              edit &&
              <ToolboxImage
                noText
                value={content?.logo}
                name="logo"
                onUpdateContent={onUpdateLogo}
                className="group-hover:block hidden"
              />
            }
            {content?.logo &&
              <Image src={noTransparent ? "/img/logo-black_180x180.png" : content.logo} width="36" height="36" alt="" />
            }
          </div>
          {edit ?
            <ContentEditable
              className="text-lg text-white section-mode-edit"
              tagName="span"
              html={content?.logo_text || "-"}
              onChange={(e) => onUpdateLogo("logo_text", e.target.value)}
            />
            :
            <>
              {content?.logo_text && <span className={cn("text-lg")}>{content.logo_text}</span>}
            </>
          }
        </div>
        {mobile.mobileMd || mobile.mobileSm ? (
          <MobileNavigationHeader edit={edit} menus={menus} content={content} />
        ) : (
          <NavigationHeader hiddenMenu={hiddenMenu} noTransparent={noTransparent} edit={edit} menus={menus} onUpdateContent={onUpdateContent} />
        )}
      </div>
    </header>
  );
}

function NavigationHeader({ hiddenMenu, noTransparent, onUpdateContent, edit = false, menus }) {
  if (hiddenMenu) return <></>;
  return (
    <nav className={cn("flex h-16 list-none items-center justify-center gap-x-5 text-lg font-light tracking-wide ",
      {
        "text-white": !noTransparent
      }
    )}>
      {menus.map((item, key) => (
        <li className={cn("cursor-pointer h-10 flex items-center px-2")} key={key} onClick={(e) => {
          if (item.link && !edit) {
            Router.push(item.link);
          }
        }}>
          {edit ?
            <div className="relative group">
              <ContentEditable
                className={cn("section-mode-edit", { "w-5": !item.text })}
                html={item.text}
                onChange={(e) => {
                  onUpdateContent({ index: key, value: e.target.value })
                }}
              />
              <ToolboxHero
                data={item}
                className="group-hover:block hidden peer-focus:block"
                onUpdateContent={(data) => onUpdateContent({ index: key, value: data })}
              />
            </div>
            : item.text}
        </li>
      ))}

    </nav>
  );
}
function MobileNavigationHeader({ menus, content, edit }) {
  const [isOpen, setIsOpen] = useState(false);
  const mode = useEditSection(state => state.mode);
  return (
    <div>
      <div className="h-11 w-11  flex justify-center items-center cursor-pointer" onClick={() => setIsOpen(true)}>
        <RxHamburgerMenu color="white" size={30} />
      </div>

      {(mode === "desktop" || !edit) &&
        <Portal>
          <MenuMobile isOpen={isOpen} content={content} setIsOpen={setIsOpen} menus={menus} />
        </Portal>
      }

      {mode === "mobile" && <MenuMobile isOpen={isOpen} content={content} setIsOpen={setIsOpen} menus={menus} />}
    </div>
  );
}

function MenuMobile({ isOpen, setIsOpen, menus, content }) {
  return <>
    <div className={cn("inset-0 bg-black fixed z-30 opacity-40", { "hidden": !isOpen })} onClick={() => setIsOpen(false)}></div>
    <div
      className={cn(
        "absolute block left-0 right-0 bg-white p-5 transition-all duration-300 z-[99999]",
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
            {content?.logo_text}
          </span>
        </div>
        <div className="mb-6 flex flex-col gap-y-8">
          {menus.map((item, key) => (
            <li
              className="flex justify-center text-black"
              key={key}
              onClick={() => {
                if (item.link) {
                  Router.push(item.link);
                  setIsOpen(false);
                }
              }}
            >
              {item.text}
            </li>
          ))}
        </div>
      </div>
    </div>
  </>
}