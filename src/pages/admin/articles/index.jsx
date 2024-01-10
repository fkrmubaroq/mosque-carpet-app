import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getArticles } from "@/lib/api/articles";
import { useOnClickOutside } from "@/lib/hooks";
import { mediaPath } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Image from "next/image";
import Router from "next/router";
import { useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdTime } from "react-icons/io";
import { IoCreateOutline, IoEyeOutline } from "react-icons/io5";

export default function Articles() {
  const articleRef = useRef();
  const { data } = useQuery({
    queryFn: async () => {
      const params = {

      };
      const response = await getArticles(params);
      return response.data || []
    }
  });

  const [isOpen, setIsOpen] = useState(null);
  useOnClickOutside(articleRef, () => {
    if (!articleRef.current) return;
    setIsOpen(false);
  })
  return (
    <Layout title="Artikel">
      <div className="flex justify-end mb-5">
        <Button size="lg" className="flex gap-x-2" onClick={() => Router.push("/admin/articles/create")}>
          <IoCreateOutline size={20} />
          <span>Buat Artikel</span>
        </Button>
      </div>
      <div className="inline-flex gap-x-3" ref={articleRef} >
        {data?.data?.map((item, key) => <ArticleCardItem key={key} activeIndex={isOpen} index={key} data={item} setIsOpen={setIsOpen} />)}
      </div>
    </Layout>
  );
}

function ArticleCardItem({ data, setIsOpen, index, activeIndex }) {
  console.log("index", index, activeIndex);
  return <Card className="flex flex-col w-[340px] relative">
    <div
      className="absolute top-3 right-2 z-50 cursor-pointer w-6 h-6 hover:bg-primary flex justify-center items-center rounded-md"
      onClick={() => {
        setIsOpen(index)
      }}
    >
      <HiOutlineDotsVertical color="white"/>
    </div>
    <DropdownCard show={index === activeIndex} />
    <Image className="rounded-t-lg" src={mediaPath("articles-thumbnail", data.thumbnail)} width={300} height={250} />
    <CardContent className="!pt-3">
      <div className="font-medium line-clamp-1 text-slate-600 cursor-pointer hover:underline mb-2 tracking-tight">{data.title}</div>
      <div className="text-gray-400 line-clamp-3 text-sm text-justify">{data.content}</div>
    </CardContent>
    <CardFooter className="border-t border-t-gray-200 pb-4 flex justify-between">
      <div className="flex gap-x-2 items-center mt-3">
        <IoMdTime color="gray"/>
        <span className="text-xs text-gray-400">{dayjs(data.created_at).format("DD MMMM YYYY HH:mm")}</span>
      </div>
      <div className="flex gap-x-2 items-be mt-3">
        <IoEyeOutline color="gray" />
        <span className="text-xs text-gray-400">{data.total_viewers || 0}</span>
      </div>
    </CardFooter>
  </Card>
}


const dropdownMenu = [
  {
    icon: <GoPencil />,
    text: "Ubah"
  },
  {
    icon: <FaRegTrashAlt />,
    text: "Hapus"
  },
];
function DropdownCard({ show }) {
  console.log("sho", show);
  if (!show) return <></>;
  return <div className="absolute z-50 right-3 top-10  bg-white rounded-md">
    {dropdownMenu.map((item, key) => <Item key={key} data={item} />)}
  </div>
}

function Item({ data }) {
  return <div className="hover:bg-primary flex gap-x-2 items-center first:rounded-t-md last:rounded-b-md hover:text-white py-2 pl-2 pr-5 text-xs cursor-pointer">
    <div className="w-5 h-5 flex justify-center items-center">{data.icon}</div>
    <span>{data.text}</span>
  </div>
}