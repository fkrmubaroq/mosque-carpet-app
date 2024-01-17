import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SearchInput from "@/components/ui/form/input/SearchInput";
import { Confirmation } from "@/components/ui/modal/Confirmation";
import { Line, Shimmer } from "@/components/ui/shimmer";
import Pagination from "@/components/ui/table/PaginationTable";
import { deleteArticle, getArticle } from "@/lib/api/articles";
import { useDialogStore } from "@/lib/hookStore";
import { useOnClickOutside } from "@/lib/hooks";
import { adminArticleQuery } from "@/lib/queryKeys";
import { debounce, getWord, mediaPath, strippedStrings } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cn from "classnames";
import dayjs from "dayjs";
import "dayjs/locale/id";
import Image from "next/image";
import Router from "next/router";
import { useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdTime } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
dayjs.locale("id");

const initConfirmation = Object.freeze({ show: false, type: "" });
export default function Articles() {
  const articleRef = useRef();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [confirmation, setConfirmation] = useState(initConfirmation);
  const [isOpen, setIsOpen] = useState(null);
  const queryClient = useQueryClient();
  const showToast = useDialogStore(state => state.showToast);

  const { mutate: mutateDeleteArticle, isLoading:isLoadingDeleteArticle } = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      showToast("success-delete-article")
      setConfirmation(initConfirmation);
      queryClient.invalidateQueries(adminArticleQuery.getAll);
    },
    onError: () => showToast("error-delete-article"),
  });

  useOnClickOutside(articleRef, () => {
    if (!articleRef.current) return;
    setIsOpen(false);
  })
  const { data, isLoading, isFetching } = useQuery({
    queryKey: adminArticleQuery.getAll(page,keyword),
    queryFn: async () => {
      const params = {
        q: keyword,
        page
      };
      const response = await getArticle(params);
      return response.data || []
    }
  });

  const onEdit = (data) => {
    Router.push(`/admin/articles/edit/${data.id}`);
  }

  const onClickMenuDropdown = (menu, data) => {
    switch (menu.name) {
      case "edit":
        onEdit(data);
        break;
      case "delete":
        setConfirmation({ show: true, type: "delete", data });
        break;
    }
  }

  const onConfirmDelete = () => {
    if (!confirmation.data?.id) return;
    mutateDeleteArticle(confirmation.data.id);
  }

  const debounceSearch = debounce(setKeyword);
  const onNextPrev = (current) => setPage(page => page + current);

  return (
    <>
      <Confirmation
        show={confirmation.show}
        onHide={() => setConfirmation(initConfirmation)}
        onConfirm={onConfirmDelete}
        isLoading={isLoadingDeleteArticle}
      >
        <div className="text-center">
          Apakah anda yakin ingin menghapus artikel <br/> <span className="font-semibold text-gray-900">{confirmation?.data?.title}</span> ?
        </div>
      </Confirmation>
    <Layout title="Artikel">
      <div className="flex justify-between mb-5">
        <SearchInput placeholder="Cari Artikel" className="w-[300px]" onChange={e => debounceSearch(e.target.value)}/>
        <Button className="flex gap-x-2 !h-11 w-[180px]" onClick={() => Router.push("/admin/articles/create")}>
          <IoCreateOutline size={20} />
          <span>Buat Artikel</span>
        </Button>
      </div>
      <div className={cn("flex flex-wrap gap-5")} ref={articleRef} >
        {
            isLoading || isFetching ?
            <ShimmerArticle total={8} />
            :
            data?.data?.map((item, key) =>
              <ArticleCardItem
                key={key}
                activeIndex={isOpen}
                index={key}
                data={item}
                setIsOpen={setIsOpen}
                onEdit={onEdit}
                onClickMenuDropdown={onClickMenuDropdown}
              />)
        }
        </div>
        {data?.paging && (
          <Pagination
            currentPage={page}
            pagination={data.paging}
            onNext={onNextPrev}
            onPrev={onNextPrev}
          />
        )}
      </Layout>
    </>
  );
}

function ArticleCardItem({ data, setIsOpen, index, activeIndex, onEdit, onClickMenuDropdown }) {
  return <Card className="flex flex-col w-[325px] relative">
    <div
      className="absolute top-3 right-2 z-50 cursor-pointer w-6 h-6 hover:bg-primary flex justify-center items-center rounded-md"
      onClick={() => {
        setIsOpen(index)
      }}
    >
      <HiOutlineDotsVertical color="white"/>
    </div>
    <DropdownCard show={index === activeIndex} onClick={(menu) => onClickMenuDropdown(menu, data)} />
    <Image className="rounded-t-lg object-cover" src={mediaPath("articles-thumbnail", data.thumbnail)} width={300} height={200} />
    <CardContent className="!pt-3">
      <div onClick={() => onEdit(data) } className="font-medium line-clamp-1 text-slate-600 cursor-pointer hover:underline mb-2 tracking-tight">{data.title}</div>
      <div className="text-gray-400 line-clamp-3 text-sm text-justify">{strippedStrings(data.content)}</div>
    </CardContent>
    <CardFooter className="border-t border-t-gray-200 pb-4 flex justify-between">
      <div className="flex gap-x-2 items-center mt-3">
        <IoMdTime color="gray"/>
        <span className="text-xs text-gray-400">{dayjs(data.created_at).format("DD MMMM YYYY HH:mm")}</span>
      </div>
      <div className="flex gap-x-2 items-be mt-3">
        <FiUser color="gray" />
        <span className="text-xs text-gray-400">{getWord(data.writer,2)}</span>
      </div>
    </CardFooter>
  </Card>
}


const dropdownMenu = [
  {
    icon: <GoPencil />,
    text: "Ubah",
    name: "edit"
  },
  {
    icon: <FaRegTrashAlt />,
    text: "Hapus",
    name: "delete"
  },
];
function DropdownCard({ show, onClick }) {
  if (!show) return <></>;
  return <div className="absolute z-50 right-3 top-10  bg-white rounded-md">
    {dropdownMenu.map((item, key) => <Item key={key} data={item} onClick={onClick} />)}
  </div>
}

function Item({ data, onClick }) {
  return <div onClick={() => onClick(data)} className="hover:bg-primary flex gap-x-2 items-center first:rounded-t-md last:rounded-b-md hover:text-white py-2 pl-2 pr-5 text-xs cursor-pointer">
    <div className="w-5 h-5 flex justify-center items-center">{data.icon}</div>
    <span>{data.text}</span>
  </div>
}

function ShimmerArticle({ total }) {
  return Array(total).fill(1).map((_, key) =>
    <Shimmer key={key}>
      <Card className="">
        <Line width="w-[324px]" height="h-[200px]" />
        <CardContent className="mt-3">
          <div className="flex flex-col gap-y-5">
            <Line width="w-full" />
            <div className="flex flex-col gap-y-2">
              <Line width="w-full" height="h-[7px]" />
              <Line width="w-full" height="h-[7px]" />
              <Line width="w-full" height="h-[7px]" />
              <Line width="w-full" height="h-[7px]" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-t-gray-200 pb-4 flex justify-between pt-3">
          <Line width="w-[70px]" />
          <Line width="w-[70px]" />
        </CardFooter>
      </Card>
    </Shimmer>
  )

}