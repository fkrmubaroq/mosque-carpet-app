import { CONTAINER_LP } from "@/lib/constant";
import cn from "classnames";
import Image from "next/image";
import Router from "next/router";

export default function HeaderArticle() {
  return <header className="sticky flex items-center top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
    <div className={cn("!mx-0 flex items-center justify-between w-full", CONTAINER_LP)}>
      {/* LOGO */}
      <div className="flex gap-x-3 items-center cursor-pointer" onClick={() => Router.push("/")}>
        <Image src={"/img/logo-black_180x180.png"} width={40} height={40} />
        <div className="flex flex-col ">
          <div className="text-sm tracking-widest  text-gray-600 flex gap-x-2">AL-HIJRA</div>
          <div className="text-[10px] bg-primary px-1 tracking-wide rounded-full w-10 flex justify-center items-center text-white mt-0">News</div>
        </div>
      </div>

      {/* MENU */}
      <div>
        <div className="text-gray-600 text-sm tracking-wide cursor-pointer" onClick={() => Router.push("/berita")}>Berita Terkini</div>
      </div>

    </div>
  </header>
}