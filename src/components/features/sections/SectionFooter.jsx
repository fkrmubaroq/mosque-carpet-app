import { CONTAINER_LP } from "@/lib/constant";
import cn from "classnames";
import Image from "next/image";
import { memo } from "react";
import {
  AiOutlineInstagram,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineWhatsApp
} from "react-icons/ai";
import { BiLogoTiktok } from "react-icons/bi";
import { BsFacebook } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";

function FooterMemo() {
  return (
    <footer className="relative flex gap-x-4 bg-black pt-20 pb-28 md:px-5">
      <div className={cn("flex lg:flex-row flex-col lg:gap-y-0 gap-y-8 justify-between w-full lg:px-0 px-4", CONTAINER_LP)}>
        <FooterLogo />
        <FooterContactItem />
        <FooterSocialMedia />
        <FooterCopyright />
      </div>
    </footer>
  );
}

function FooterLogo() {
  return (
    <div className="flex flex-col lg:items-center lg:justify-center">
      <span>
        <Image src="/img/logo.png" width="80" height="80" alt="" />
      </span>
      <span className="text-lg tracking-widest text-white mt-3">AL - HIJRA</span>
      <span className="text-gray-50 text-sm">Ibadah Semakin Nyaman</span>
    </div>
  );
}
function FooterContactItem() {
  return (
    <div className="flex flex-col gap-y-3 text-white">
      <FooterTitleItem title="Contact" />
      <div className="flex flex-col gap-y-2">
        <FooterContentItem
          icon={<HiOutlineLocationMarker />}
          text="Jl. Saluyu indah 10 no.9h"
        />
        <FooterContentItem icon={<AiOutlinePhone />} text="021 2329 98392" />
        <FooterContentItem icon={<AiOutlineWhatsApp />} text="0888 753 708" />
        <FooterContentItem
          icon={<AiOutlineMail />}
          text="alhijra.carpet@mail.com"
        />
      </div>
    </div>
  );
}

function FooterTitleItem({ title }) {
  return <div className="text-2xl lg:text-3xl font-cinzel ">{title}</div>
}

function FooterContentItem({ icon, text }) {
  return <div className="flex gap-x-2 items-center">
    {icon}
    <div>{text}</div>
  </div>
}

function FooterSocialMedia() {
  return (
    <div className="flex flex-col gap-y-3 text-white">
      <FooterTitleItem title="Social Media" />
      <div className="flex flex-col gap-y-2">
        <FooterContentItem icon={<AiOutlineInstagram />} text="Instagram" />
        <FooterContentItem icon={<BsFacebook />} text="Facebook" />
        <FooterContentItem icon={<BiLogoTiktok />} text="Tiktok" />
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