import style from "./layout.module.scss";
import cn from "classnames";
import Image from "next/image";
import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { PiDotsThreeLight } from "react-icons/pi";

type TMenu = {
  icon: React.ReactNode,
  menu: string
};
type TSidebarMenu = {
  label: string,
  menus: TMenu[]
};

const sidebarMenus: TSidebarMenu[] = [
  {
    label: "HOME",
    menus: [
      {
        icon: <BiHomeAlt size={20}/>,
        menu: "Beranda",
      },
      {
        icon: <BiHomeAlt size={20}/>,
        menu: "Contact",
      },
    ],
  },
  {
    label: "MASTER",
    menus: [
      {
        icon: <BiHomeAlt size={20}/>,
        menu: "Produk",
      },
      {
        icon: <BiHomeAlt size={20}/>,
        menu: "Cabang",
      },
    ],
  },
];
export function Layout({ children, title }: { title: string } & React.ComponentPropsWithoutRef<"div">) {
  const [expand, setExpand] = useState<boolean>(true);
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
          <div className="text-lg font-medium">{title}</div>
        </div>
        <div className="flex items-center gap-x-2 hover:bg-primary px-3 pb-3 pt-2 rounded-lg group  hover:text-white">
          <MdOutlineAccountCircle size={33} className="opacity-50 group-hover:opacity-100"/>
          <div className="flex flex-col gap-y-1">
            <span className="text-sm group-hover:text-white text-gray-500 font-semibold">Mrs. Dennis Schulist</span>
            <span className="text-xs group-hover:text-white text-gray-600">Admin</span>
          </div>
        </div>
      </div>
      <div className={style["sidebar"]}>
        <div
          className={cn(
            " mt-5 flex items-center gap-x-4 rounded-lg bg-primary/95 py-3",
            {
              "mx-5 mb-2 px-4": expand,
              "mx-3 justify-center": !expand,
            }
          )}
        >
          <div className="shrink-0">
            <Image
              src="/img/logo.png"
              width={expand ? "35" : "25"}
              height={expand ? "35" : "25"}
              alt=""
            />
          </div>
          {expand && (
            <div className="flex flex-col font-jasans ">
              <span className="font-medium tracking-widest text-white">
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
                  <MenuItem data={menu} key={key} expand={expand} />
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

function MenuItem({ data, expand }: { data: TMenu; expand: boolean; }) {
  return (
    <div className={cn("group flex h-11 cursor-pointer items-center gap-x-3 rounded-md hover:bg-primary/10 hover:text-primary", {
      "pl-3 pr-4": expand,
      "justify-center w-11": !expand
    })}>
      <span className="shrink-0">{data.icon}</span>
      {expand && (
        <span className="text-sm text-gray-600 group-hover:text-primary">
          {data.menu}
        </span>
      )}
    </div>
  );
}