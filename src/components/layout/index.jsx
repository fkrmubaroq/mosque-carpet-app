import { updateSections } from "@/lib/api/section";
import { logout } from "@/lib/api/users";
import { USER_TYPE_ENUM } from "@/lib/enum";
import { useDialogStore, useEditSection } from "@/lib/hookStore";
import { useCookie, useOnClickOutside, useSetting, useUserData } from "@/lib/hooks";
import { eraseCookie } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import { CiBoxList, CiBoxes } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp, IoIosGlobe } from "react-icons/io";
import { LuUser } from "react-icons/lu";
import { MdOutlineAccountCircle, MdOutlineArticle } from "react-icons/md";
import { PiDotsThreeLight } from "react-icons/pi";
import { RiShutDownLine } from "react-icons/ri";
import { RxHamburgerMenu, RxSection } from "react-icons/rx";
import { VscFolderLibrary } from "react-icons/vsc";
import { useShallow } from "zustand/react/shallow";
import Meta from "../Meta";
import { SpinnerIcon } from "../ui/Spinner";
import { Button } from "../ui/button";
import ToggleSwitch from "../ui/switch/toggle";
import style from "./layout.module.scss";

export function Layout({ children, customTitle, title, classNameTitle }) {
  const { data: user } = useUserData();
  const route = useRouter();
  const isStaff = user?.role === USER_TYPE_ENUM.Staff;
  const sidebarMenus = useMemo(() => [
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
          icon: <FiUsers size={20} />,
          menu: "Users",
          path: "/admin/users",
          hide: isStaff
        },
      ],
    },
    {
      label: "Lainnya",
      menus: [
        {
          icon: <RxSection size={20} />,
          menu: "Sections",
          path: "/admin/section",
          hide: isStaff
        },
        {
          icon: <MdOutlineArticle size={20} />,
          menu: "Artikel",
          path: "/admin/articles",
        },
        {
          icon: <VscFolderLibrary size={20} />,
          menu: "Media Manager",
          path: "/admin/file-manager",
        },
        {
          icon: <AiOutlineSetting size={20} />,
          menu: "Pengaturan",
          path: "/admin/settings",
          hide: isStaff
        },
      ],
    },
  ], [isStaff]);

  const { data: setting } = useSetting();
  const [cookie] = useCookie("adm");
  const [expand, setExpand] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [showToast, showConfirmation, hideConfirmation] = useDialogStore(state => [state.showToast, state.showConfirmation, state.hideConfirmation]);
  const [sectionsLp, viewIdSection, setViewIdSection] = useEditSection(useShallow(state => [state.sectionsLp, state.viewIdSection, state.setViewIdSection]));
  const isSectionPage = route.pathname === "/admin/section";
  const isSettingPage = route.pathname === "/admin/settings";
  const isCreateArticlePage = route.pathname === "/admin/articles/create";
  const isUpdateArticlePage = route.pathname.includes("/admin/articles/edit");

  const dropdownRef = useRef();
  useOnClickOutside(dropdownRef, () => {
    if (!dropdownRef.current) return;
    setDropdown(false);
  })

  useEffect(() => {
    if (route.pathname === "/admin/section") {
      setExpand(false);
    }
  }, []);

  const { mutate: mutateUpdateSection, isLoading } = useMutation({
    mutationFn: updateSections,
    onSuccess: () => showToast("success-update-section"),
    onError: () => showToast("error-update-section")
  })

  const { mutate: logoutApp } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      eraseCookie("adm");
      window.location.href = "/login"
    },
    onError: () => showToast("error-logout")
  })

  const onPublish = () => {
    const sections = sectionsLp.map(section => ({ ...section, content: JSON.stringify(section.content) }));
    mutateUpdateSection({
      sections
    });
  }

  const onClickDropdown = (menu) => {
    switch (menu.text) {
      case "Keluar":
        showConfirmation("logout", {
          onConfirm() {
            logoutApp()
          }
        })
        break;

      case "Profil":
        Router.push("/admin/profile");
        break;
    }
  }

  return (
    <>
    <Meta title={title} />
    <div className={cn(style["layout"], { [style["expanded"]]: expand })}>
      <div className={cn(style["header"], {
        "fixed bg-white z-[99999] right-0 shadow-sm": isSectionPage || isSettingPage || isCreateArticlePage || isUpdateArticlePage,
        "left-[270px]": (isSettingPage || isSectionPage || isCreateArticlePage || isUpdateArticlePage) && expand,
        "left-[75px]": (isSettingPage || isSectionPage || isCreateArticlePage || isUpdateArticlePage) && !expand,
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

        {/* IS SECTION PAGE */}
        {
          isSectionPage &&
          <div className="flex gap-x-2">
            <Button
              onClick={() => window.open(window.location.origin)}
              variant="ghost"
              className="border border-gray-600 gap-x-2 flex items-center justify-center !rounded-full">
              <IoIosGlobe size={20} />
              <span >Website</span>
            </Button>
            <Button
              disabled={isLoading}
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
          </div>
        }
        <div className="flex gap-x-5 items-center">
          {isSectionPage && <div>
            <ToggleSwitch
              text="ID Section"
              checked={viewIdSection}
              onChange={(checked) => setViewIdSection(checked)}
            />
          </div>
          }
          <div
            ref={dropdownRef}
            onClick={() => setDropdown(o => !o)}
            className="cursor-pointer bg-white relative flex items-center gap-x-2 rounded-lg p-2  ">
            <MdOutlineAccountCircle
              size={33}
              className="opacity-50"
            />
            <div className="flex flex-col gap-y-1 border-r pr-3 min-w-[100px] max-w-[300px]">
              <span className="text-sm font-semibold text-gray-500 ">
                {cookie?.name || "-"}
              </span>
              <span className="text-xs text-gray-600 ">
                Admin
              </span>
            </div>
            <div className=" h-full ">
              {dropdown ? <IoIosArrowUp /> : <IoIosArrowDown/> }
            </div>
            <DropdownMenu show={dropdown} onClick={onClickDropdown} />
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
            <div className={cn("shrink-0 overflow-hidden relative ", { "w-10 h-10": expand, "w-5 h-5": !expand })}>
            <Image
              src={setting?.logo || "/img/logo.png"}
                layout="fill"
                objectFit="contain"
              alt=""
            />
          </div>
          {expand && (
            <div className="flex flex-col overflow-hidden font-jasans">
              <span className="overflow-hidden font-medium tracking-widest text-white">
                {setting?.logo_title || ""}
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
    </>
  );
}

function MenuItem({
  data,
  expand,
  activeMenu,
}) {
  if (data?.hide) return <></>;
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

const listMenu = [
  {
    icon: <LuUser />,
    text: "Profil"
  },
  {
    icon: <RiShutDownLine />,
    text: "Keluar"
  }
];
function DropdownMenu({ show, onClick }) {

  return <div className={cn("absolute transition-all -left-0 border  w-[160px] bg-white rounded-md",
    {
      "top-14 opacity-100 z-[999]": show,
      "top-8 opacity-0 -z-10": !show
    })}>
    {listMenu.map((menu, key) =>
      <div
        key={key}
        onClick={(e) => {
          e.stopPropagation();
          onClick(menu)
        }}
        className={cn("px-3 py-2 text-gray-500 group items-center flex gap-x-2.5 first:rounded-t-md last:rounded-b-md",
          { "hover:bg-primary hover:text-white": show }
        )}>
        {menu.icon}
        <span className="text-sm">{menu.text}</span>
      </div>
    )}
  </div>
}