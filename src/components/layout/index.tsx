import style from "./layout.module.scss";
import cn from "classnames";
import Image from "next/image";
import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { PiDotsThreeLight } from "react-icons/pi";
import Router, { useRouter } from "next/router";
import { CiBoxes, CiBoxList } from "react-icons/ci";
import { TfiPackage } from "react-icons/tfi";
import { MdOutlineArticle } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";
import { VscFolderLibrary } from "react-icons/vsc";

type TMenu = {
  icon: React.ReactNode,
  menu: string,
  path: string
};
type TSidebarMenu = {
  label: string,
  menus: TMenu[],
};

const sidebarMenus: TSidebarMenu[] = [
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
export function Layout({ children, customTitle, title, classNameTitle }: { classNameTitle?: string, title?: string, customTitle?: React.ReactNode } & React.ComponentPropsWithoutRef<"div">) {
  const [expand, setExpand] = useState<boolean>(true);
  const route = useRouter();

  return (
    <div className={cn(style["layout"], { [style["expanded"]]: expand })}>
      <div className={style["header"]}>
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
}: {
  data: TMenu;
  expand: boolean;
  activeMenu: string
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