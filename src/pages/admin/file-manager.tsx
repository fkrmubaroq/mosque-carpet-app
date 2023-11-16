import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/form/input/SearchInput";
import { TResponseDataApi } from "@/lib/api";
import { TResponseFileItem, getFileItems } from "@/lib/api/file-manager";
import { adminFileManagerQuery } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React, { useCallback, useMemo, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import DropdownFileManager from "@/components/features/file-manager/dropdown";

export default function FileManager() {
  const [path, setPath] = useState<string>("/");
  const { data } = useQuery<TResponseFileItem[]>({
    queryKey: adminFileManagerQuery.getFIleItems(path),
    queryFn: async () => {
       const params = {
         path
       };
      const response = await getFileItems(params);
      if (response.status !== 200) throw new Error();
      return response.data.data || [];
    }
  })
  console.log("dada ", data);

  const onClickFolder = (selected: TResponseFileItem) => {
    setPath(path => `${path}${path === "/" ? selected.name : `/${selected.name}`}/`)
  };

  const getCumulativePathSegments = useCallback((path: string) => {
    return path
      .split("/")
      .filter(Boolean) // Drop empty strings caused by the splitting
      .reduce(
        (segments, segment) => {
          const previous = segments[segments.length - 1];
          segments.push(`${previous}${segment}/`);
          return segments;
        },
        ["/"]
      )
  } ,[])

  return (
    <Layout
      classNameTitle="w-full"
      customTitle={
        <SearchInput className="!w-[31.25rem]" placeholder="Temukan File" />
      }
    >
      <div className="flex justify-between">
        <div className="mb-4 text-xl font-medium tracking-wide">
          File Manager
        </div>
        <div className="relative flex gap-x-2">
          <Button size="lg" className="flex gap-x-2 !px-8">
            <LuUpload size={15}/>
            <span>Upload File</span>
          </Button>
          <Button size="lg" variant="gray" className="!p-4">
            <BsThreeDots />
          </Button>
          <DropdownFileManager />
        </div>
      </div>
      <span className="mb-5 flex gap-x-2 text-sm text-gray-400">
        {getCumulativePathSegments(path).map((segment, key, arr) => (
          <PathItem
            segment={segment}
            appendArrow={key !== arr.length - 1}
            onSelect={setPath}
          />
        ))}
      </span>
      <div className="grid grid-cols-3 gap-6">
        {data?.map((item, key) => (
          <React.Fragment key={key}>
            {item.type === "FOLDER" && (
              <Folder data={item} onSelect={onClickFolder} />
            )}
            {item.type === "FILE" && <File name={item.name} />}
          </React.Fragment>
        ))}
      </div>
    </Layout>
  );
}


function PathItem({ segment, appendArrow, onSelect }: { segment: string; appendArrow: boolean; onSelect: (path:string) => void }) {
  const folder = useMemo(() => segment?.split("/")?.slice(0, -1)?.pop(), []);
  return (
    <div className="flex items-center gap-x-3 ">
      <span
        className="cursor-pointer rounded-md p-3 font-semibold hover:bg-gray-200"
        onClick={() => onSelect(segment)}
      >
        {segment === "/" ? <FaFolder size={20} /> : folder}
      </span>
      {appendArrow && <IoIosArrowForward size={18} />}
    </div>
  );
}
function File({ name }: { name: string }) {
  return (
    <div className="flex cursor-pointer items-center gap-x-4 rounded-md bg-gray-100 px-5 py-3 shadow-sm transition-all duration-200 hover:bg-gray-200">
      <span className="">
        <FaFile color="#3b82f6" size={42} />
      </span>
      <span className="font-semibold tracking-wide">{name}</span>
    </div>
  );
}
function Folder({
  data,
  onSelect,
}: {
  data: TResponseFileItem;
  onSelect: (selected: TResponseFileItem) => void;
}) {
  return (
    <button
      onDoubleClick={() => onSelect(data)}
      className="flex cursor-pointer focus:bg-primary focus:text-white items-center gap-x-4 rounded-md bg-gray-100 px-5 py-3 shadow-sm transition-all duration-200 hover:bg-primary hover:text-white"
    >
      <span className="">
        <FaFolder color="#facc15" size={42} />
      </span>
      <span className="font-semibold tracking-wide">{data.name}</span>
    </button>
  );
}