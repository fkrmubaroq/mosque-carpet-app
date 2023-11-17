import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/form/input/SearchInput";
import { TResponseDataApi, TResponseErrorApi } from "@/lib/api";
import { TPayloadFolder, TResponseFileItem, createFolder, getFileItems } from "@/lib/api/file-manager";
import { adminFileManagerQuery } from "@/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import DropdownFileManager from "@/components/features/file-manager/dropdown";
import { useDialogStore, useFileManagerStore } from "@/lib/hookStore";
import { useShallow } from "zustand/react/shallow";
import { useOnClickOutside, useToggle } from "@/lib/hooks";
import { SchemaModal } from "@/components/ui/modal";
import ModalFormFolder from "@/components/features/file-manager/ModalForm";
import { sleep } from "@/lib/utils";

type TModalType = "add-folder" | "edit";

const initModal = Object.freeze({
  show: false,
  type: "folder" as TModalType,
});

export default function FileManager() {
  const [currentPath, setPath] = useFileManagerStore(useShallow(state => [state.currentPath, state.setPath]));
  const showToast = useDialogStore(state => state.showToast)
  const [modal, setModal] = useState<SchemaModal<string, TModalType>>(initModal);
  const queryClient = useQueryClient();

  const { data } = useQuery<TResponseFileItem[]>({
    queryKey: adminFileManagerQuery.getFIleItems(currentPath),
    queryFn: async () => {
      const params = {
        path: currentPath,
      };
      const response = await getFileItems(params);
      if (response.status !== 200) throw new Error();
      return response.data.data || [];
    },
  });

  const { mutate: mutateCreateFolder, isLoading: isLoadingCreateFolder } = useMutation({
    mutationFn: createFolder,
    onSuccess: (_, payload) => {
      showToast("custom-message", `Folder ${payload.name} telah dibuat`);
      queryClient.invalidateQueries({ queryKey: adminFileManagerQuery.getFIleItems(currentPath) });
      setModal(initModal);
    },
    onError: (error: AxiosError<TResponseErrorApi>) => {
      if (error.response?.data.code === 1) {
        showToast("custom-message", error.response.data.message, "danger");
        return;
      }
      if ((error.response?.data.code || 0) >= 1000) {
        showToast("custom-message", error.response?.data.message, "danger");
        return;
      }
      showToast("error-create-folder");
      setModal(initModal)
    },
  });

  const onClickFolder = (selected: TResponseFileItem) => {
    setPath(`${currentPath}${currentPath === "/" ? selected.name : `/${selected.name}`}/`)
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
  }, []);

  const onCreateFolder = () => {
    setModal({
      show: true,
      type: "add-folder"
    })
  }

  const onSaveFolder = (folderName: string) => {
    if (modal.type === "add-folder") {
      mutateCreateFolder({
        name: folderName,
        path: currentPath
      });
      return;
    }    
  }

  return (
    <>
      <ModalFormFolder
        isLoading={isLoadingCreateFolder}
        onSave={onSaveFolder}
        show={modal.show}
        name={modal.type === "add-folder" ? "" : ""}
        onHide={() => setModal(initModal)}
      />
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
          <ActionButtonManager onCreateFolder={onCreateFolder} />
        </div>
        <span className="mb-5 flex gap-x-2 text-sm text-gray-400">
          {getCumulativePathSegments(currentPath).map((segment, key, arr) => (
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
    </>
  );
}

function ActionButtonManager({
  onCreateFolder,
  onUploadFile,
}: {
  onCreateFolder: () => void;
  onUploadFile: () => void;
  }) {
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [opened, setOpened] = useState<boolean>(false);
  useOnClickOutside(dropdownRef, () => {
    if (!opened) return;
    setOpened(false);
  });
  return (
    <div className="relative flex gap-x-2" ref={dropdownRef}>
      <Button size="lg" className="flex gap-x-2 !px-8">
        <LuUpload size={15} />
        <span>Upload File</span>
      </Button>
      <Button
        size="lg"
        variant="gray"
        className="!p-4"
        onClick={() => setOpened((o) => !o)}
      >
        <BsThreeDots />
      </Button>
      {opened && (
        <DropdownFileManager
          onCreateFolder={() => {
            setOpened(false);
            onCreateFolder();
          }}
          onUploadFile={onUploadFile}
        />
      )}
    </div>
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