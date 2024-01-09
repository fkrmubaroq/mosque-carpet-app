import { updateSections } from "@/lib/api/section";
import { useEditSection } from "@/lib/hookStore";
import { useMutation } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import { CiBoxList, CiBoxes } from "react-icons/ci";
import { IoIosGlobe } from "react-icons/io";
import { MdOutlineAccountCircle, MdOutlineArticle } from "react-icons/md";
import { PiDotsThreeLight } from "react-icons/pi";
import { RxHamburgerMenu, RxSection } from "react-icons/rx";
import { TfiPackage } from "react-icons/tfi";
import { VscFolderLibrary } from "react-icons/vsc";
import { useShallow } from "zustand/react/shallow";
import { SpinnerIcon } from "../ui/Spinner";
import { Button } from "../ui/button";
import ToggleSwitch from "../ui/switch/toggle";
import style from "./layout.module.scss";

const sidebarMenus = [
  {
    label: "HOME",
    menus: [
      {
        icon: <BiHomeAlt size={20} />,
        menu: "Beranda",
        path: "/admin/dashboard",
      },
    ],
  },
  {
    label: "MASTER",
    menus: [
      {
        icon: <CiBoxes size={20} />,
        menu: "Produk",
        path: "/admin/products",
      },
      {
        icon: <CiBoxList size={20} />,
        menu: "Kategori Produk",
        path: "/admin/category",
      },
      {
        icon: <TfiPackage size={18} />,
        menu: "Paket Bundle",
        path: "/admin/package-bundle",
      },
    ],
  },
  {
    label: "Lainnya",
    menus: [
      {
        icon: <RxSection size={20}/>,
        menu: "Sections",
        path: "/admin/section",
      },
      {
        icon: <MdOutlineArticle size={20} />,
        menu: "Artikel",
        path: "/admin/articles",
      },
      {
        icon: <VscFolderLibrary size={20} />,
        menu: "File Manager",
        path: "/admin/file-manager",
      },
      {
        icon: <AiOutlineSetting size={20} />,
        menu: "Pengaturan",
        path: "/admin/settings",
      },
    ],
  },
];
export function Layout({ children, customTitle, title, classNameTitle }) {
  const [expand, setExpand] = useState(true);
  const route = useRouter();
  const [sectionsLp, viewIdSection, setViewIdSection] = useEditSection(useShallow(state => [state.sectionsLp, state.viewIdSection, state.setViewIdSection]));
  const isSectionPage = route.pathname === "/admin/section";
  useEffect(() => {
    if (route.pathname === "/admin/section") {
      setExpand(false);
    }
  }, []);

  const { mutate: mutateUpdateSection, isLoading } = useMutation({
    mutationFn: updateSections
  })
  const onPublish = () => {
    const sections = sectionsLp.map(section => ({ ...section, content: JSON.stringify(section.content) }));
    mutateUpdateSection({
      sections
    });
  }

  return (
    <div className={cn(style["layout"], { [style["expanded"]]: expand })}>
      <div className={cn(style["header"], {
        "fixed bg-white z-[99999] right-0 shadow-sm": isSectionPage,
        "left-[270px]": isSectionPage && expand,
        "left-[75px]": isSectionPage && !expand,
      })}>
        <div className="flex items-center gap-x-2">
          <div
            onClick={() => setExpand((e) => !e)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center  gap-x-3 hover:rounded-md hover:bg-primary/20"
          >
            <RxHamburgerMenu size={20} />
          </div>
          {customTitle && customTitle}
          {!customTitle &&
            <div className={cn("text-lg font-medium", classNameTitle)}>
              {title}
            </div>
          }
        </div>

        {isSectionPage && <div className="flex gap-x-2">
          <Button
            onClick={() => window.open(window.location.origin)}
            variant="ghost"
            className="border border-gray-600 gap-x-2 flex items-center justify-center !rounded-full">
            <IoIosGlobe size={20}/>
            <span >Website</span>
          </Button>
          <Button
            isLoading={isLoading}
            className="!rounded-full"
            size="lg"
            onClick={() => onPublish()}
          >
            {isLoading ? (
              <SpinnerIcon width="w-4" height="h-4" />
            ) : (
              "Publish"
            )}
          </Button>
        </div>}
        <div className="flex gap-x-5 items-center">
          {isSectionPage && <div>
            <ToggleSwitch
              text="ID Section"
              checked={viewIdSection}
              onChange={(checked) => setViewIdSection(checked)}
            />
          </div>}
          <div className="group flex items-center gap-x-2 rounded-lg px-3 pb-3 pt-2 hover:bg-primary  hover:text-white">
            <MdOutlineAccountCircle
              size={33}
              className="opacity-50 group-hover:opacity-100"
            />
            <div className="flex flex-col gap-y-1">
              <span className="text-sm font-semibold text-gray-500 group-hover:text-white">
                Mrs. Dennis Schulist
              </span>
              <span className="text-xs text-gray-600 group-hover:text-white">
                Admin
              </span>
            </div>
            </div>
        </div>
      </div>
      <div className={style["sidebar"]}>
        <div
          className={cn(
            " mt-5 flex items-center gap-x-4 overflow-hidden rounded-lg bg-primary/95",
            {
              "mx-5 mb-2 px-4 py-3": expand,
              "mx-3 justify-center pb-2 pt-3": !expand,
            }
          )}
        >
          <div className="shrink-0 overflow-hidden">
            <Image
              src="/img/logo.png"
              width={expand ? "35" : "25"}
              height={expand ? "35" : "25"}
              alt=""
            />
          </div>
          {expand && (
            <div className="flex flex-col overflow-hidden font-jasans">
              <span className="overflow-hidden font-medium tracking-widest text-white">
                AL - HIJRA
              </span>
              <span className="text-xs text-gray-200">Admin</span>
            </div>
          )}
        </div>

        <div className={style["sidebar__menu"]}>
          {sidebarMenus.map((sidebar, key) => (
            <div
              key={key}
              className={cn({
                "flex flex-col items-center justify-center": !expand,
              })}
            >
              {expand ? (
                <div className={style["sidebar__label"]}>{sidebar.label}</div>
              ) : (
                <PiDotsThreeLight />
              )}
              <div className="mb-6 flex flex-col gap-y-1">
                {sidebar.menus.map((menu, key) => (
                  <MenuItem
                    data={menu}
                    key={key}
                    expand={expand}
                    activeMenu={route.pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={style["content"]}>{children}</div>
    </div>
  );
}

function MenuItem({
  data,
  expand,
  activeMenu,
}) {
  
  const isActiveMenu = activeMenu.includes(data.path);
  return (
    <div
      className={cn(
        "group flex h-11 cursor-pointer items-center gap-x-3 rounded-md hover:bg-primary/10 hover:text-primary",
        {
          "pl-3 pr-4": expand,
          "w-11 justify-center": !expand,
          "bg-primary/10 text-primary": isActiveMenu,
        }
      )}
      onClick={() => Router.push(data.path)}
    >
      <span className="shrink-0 w-8 h-8 justify-center items-center flex">{data.icon}</span>
      {expand && (
        <span
          className={cn("text-sm text-gray-600 group-hover:text-primary", {
            "text-primary": isActiveMenu,
          })}
        >
          {data.menu}
        </span>
      )}
    </div>
  );
}