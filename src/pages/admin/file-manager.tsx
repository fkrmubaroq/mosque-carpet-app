import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/form/input/SearchInput";
import { TResponseErrorApi } from "@/lib/api";
import { TResponseFileItem, createFolder, deleteFolder, getFileItems, updateFolderName, uploadFiles } from "@/lib/api/file-manager";
import { adminFileManagerQuery } from "@/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import {
  DropdownFileManager,
  DropdownActionFolder,
  DropdownActionFile,
} from "@/components/features/file-manager/dropdown";
import { useDialogStore, useFileManagerStore } from "@/lib/hookStore";
import { useShallow } from "zustand/react/shallow";
import { useOnClickOutside } from "@/lib/hooks";
import { SchemaModal } from "@/components/ui/modal";
import ModalFormFolder from "@/components/features/file-manager/ModalForm";
import { Input } from "@/components/ui/form/input";
import ModalUploadFile from "@/components/features/file-manager/ModalUpload";
import { ResponseError } from "@/errors/response-error";
import { LiaVideoSolid } from "react-icons/lia";
import { FaRegEye } from "react-icons/fa";
import ModalPreviewFile from "@/components/features/file-manager/ModalPreviewFile";
import { DIR_ACCESS_FILE } from "@/lib/constant";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { copyToClipboard } from "@/lib/utils";

type TModalType = "add-folder" | "add-file" | "edit" | "preview-file";

const initModal = Object.freeze({
  show: false,
  type: "folder" as TModalType,
});

export default function FileManager() {
  const [currentPath, setPath] = useFileManagerStore(useShallow(state => [state.currentPath, state.setPath]));
  const [showToast, showConfirmation, hideConfirmation] = useDialogStore(
    useShallow((state) => [
      state.showToast,
      state.showConfirmation,
      state.hideConfirmation,
    ])
  );
  const [modal, setModal] = useState<SchemaModal<string | TResponseFileItem, TModalType>>(initModal);
  const [selectedRenameFile, setSelectedRenameFile] = useState<TResponseFileItem>();
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

  const { mutate: mutateUpdateFolder } = useMutation({
    mutationFn: (payload: TResponseFileItem) => updateFolderName(payload.id, { name: payload.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFileManagerQuery.getFIleItems(currentPath),
      });
    },
    onError: (e: AxiosError<ResponseError>) => {
      if (e.response?.data?.message) {
        showToast("custom-message", e.response.data.message,"danger");
        return;
      }
      showToast("error-update-folder");
    }
  });

  const { mutate: mutateDeleteFolder } = useMutation({
    mutationFn: (id:number) => deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFileManagerQuery.getFIleItems(currentPath),
      });
      showToast("success-delete-folder")
    },
    onError: () => showToast("error-update-folder"),
    onSettled: hideConfirmation
  });

  const { mutate: mutateUploadFile } = useMutation({
    mutationFn: uploadFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFileManagerQuery.getFIleItems(currentPath),
      }); 
      showToast("success-upload-file")
    },
    onError: () => showToast("error-upload-file"),
    onSettled:() => setModal(initModal)
  })

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
      type: "add-folder",
    });
  };

  const onClickUploadFile = () => {
    setModal({
      show: true,
      type: "add-file"
    })
  };

  const onDeleteFolder = (selected: TResponseFileItem) => {
    showConfirmation(
      "costum-message",
      {
        onConfirm: () => {
          mutateDeleteFolder(selected.id)
        },
      },
      <>
        Folder <span className="font-bold mx-0.5">{selected.name}</span> akan dihapus, apakah anda yakin?
      </>
    );
  };

  const onOpenFolder = (selectedFolder: string) => {
    setPath(`${currentPath}${selectedFolder}${selectedFolder ? '/' : ''}`)
  };

  const onSaveFolder = (folderName: string) => {
    if (modal.type === "add-folder") {
      mutateCreateFolder({
        name: folderName,
        path: currentPath
      });
      return;
    }    
  }

  const onUpdateFolder = (selected:TResponseFileItem) => {
    setSelectedRenameFile(undefined);
    mutateUpdateFolder(selected);
  }

  const onPreviewFile = (selected: TResponseFileItem) => {
    setModal({
      show: true,
      type: "preview-file",
      data: selected
    })
  }

  const onCopySource = (selected: TResponseFileItem) => {
    const text = `${window.location.origin}${DIR_ACCESS_FILE}${selected.path}${selected.name}`;
    console.log("text ", text)
    const copy = copyToClipboard(text);
    console.log("copy ", copy);
  }
  return (
    <>
      {modal.type === "add-folder" && (
        <ModalFormFolder
          isLoading={isLoadingCreateFolder}
          onSave={onSaveFolder}
          show={modal.show}
          name={modal.type === "add-folder" ? "" : ""}
          onHide={() => setModal(initModal)}
        />
      )}
      {
        modal.type === "add-file" &&
        <ModalUploadFile
          onHide={() => setModal(initModal)}
          onUpload={(files) => {
          mutateUploadFile({
            files,
            path: currentPath
          });
        }} />
      } 

      {
        modal.type === "preview-file" && modal?.data && <ModalPreviewFile onHide={() => setModal(initModal)} data={modal.data as TResponseFileItem} />
      }
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
          <ActionButtonManager
            onClickCreateFolder={onCreateFolder}
            onClickUploadFile={onClickUploadFile}
          />
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
                <Folder
                  data={item}
                  onSelect={onOpenFolder}
                  onDeleteFolder={onDeleteFolder}
                  onOpenFolder={onOpenFolder}
                  selected={selectedRenameFile}
                  onUpdateFolder={onUpdateFolder}
                  setSelectedRenameFile={setSelectedRenameFile}
                />
              )}
              {item.type === "FILE" && <File data={item} onPreviewFile={onPreviewFile} onCopySource={onCopySource} />}
            </React.Fragment>
          ))}
        </div>
      </Layout>
    </>
  );
}

function ActionButtonManager({
  onClickCreateFolder,
  onClickUploadFile,
}: {
  onClickCreateFolder: () => void;
  onClickUploadFile: () => void;
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
            onClickCreateFolder();
          }}
          onUploadFile={() => {
            setOpened(false);
            onClickUploadFile();
          }}
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
        onClick={() => {
          onSelect(segment)
        }}
      >
        {segment === "/" ? <FaFolder size={20} /> : folder}
      </span>
      {appendArrow && <IoIosArrowForward size={18} />}
    </div>
  );
}

function File({
  data,
  onPreviewFile,
  onCopySource,
}: {
  data: TResponseFileItem;
  onPreviewFile: (selected: TResponseFileItem) => void;
  onCopySource: (selected: TResponseFileItem) => void;
}) {
  const [opened, setOpened] = useState<boolean>(false);
  const fileRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [edit, setEdit] = useState<string>(data.name);

  useOnClickOutside(fileRef, () => {
    if (!opened) return;
    setOpened(false);
  });

  const onAction = (
    action: "delete" | "rename" | "preview" | "copy-source"
  ) => {
    setOpened(false);
    if (action === "preview") {
      onPreviewFile(data);
      return;
    }
    if (action === "rename") {
      setSelectedRenameFile(data);
      editInputRef.current?.select();
      return;
    }

    if (action === "delete") {
      onDeleteFolder(data);
      return;
    }
    if (action === "copy-source") {
      onCopySource(data);
      return;
    }
  };
  const src = `${DIR_ACCESS_FILE}${data.path}${data.name}`;

  return (
    <div
      ref={fileRef}
      className="group flex cursor-pointer items-center justify-between gap-x-4 rounded-md bg-gray-100 py-3 pl-3.5 pr-3 shadow-sm transition-all duration-200 hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
    >
      <div className="flex gap-x-4">
        <span className="flex shrink-0">
          <Image
            className="rounded-md"
            src={src}
            alt=""
            width={48}
            height={45}
          />
        </span>
        <span className="flex items-center font-semibold tracking-wide">
          {data.name}
        </span>
      </div>
      <div className="relative">
        <Button
          onClick={() => setOpened((o) => !o)}
          size="lg"
          variant="ghost"
          className="!p-2 hover:bg-gray-700 hover:text-gray-800 focus:bg-gray-700 focus:text-white group-hover:text-white"
        >
          <BsThreeDots size={16} />
        </Button>
        {opened && (
          <DropdownActionFile
            onDeleteFile={() => onAction("delete")}
            onOpenFile={() => onAction("preview")}
            onRenameFile={() => onAction("rename")}
            onCopySource={() => onAction("copy-source")}
          />
        )}
      </div>
    </div>
  );
}
function Folder({
  data,
  onSelect,
  onOpenFolder,
  onDeleteFolder,
  selected,
  onUpdateFolder,
  setSelectedRenameFile,
}: {
  data: TResponseFileItem;
  selected?: TResponseFileItem;
  onSelect: (folderName: string) => void;
  onOpenFolder: (folderName: string) => void;
  onDeleteFolder: (selected: TResponseFileItem) => void;
  onUpdateFolder: (selected: TResponseFileItem) => void;
  setSelectedRenameFile: React.Dispatch<React.SetStateAction<TResponseFileItem | undefined>>
}) {
  const folderRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [opened, setOpened] = useState<boolean>(false);
  const [edit, setEdit] = useState<string>(data.name);

  useEffect(() => {
    console.log(selected, data, editInputRef.current);
    if (selected?.id !== data.id || !editInputRef.current) return;
    editInputRef.current.select();
    setEdit(data.name);
  }, [selected]);

  useOnClickOutside(folderRef, () => {
    if (!opened) return;
    setOpened(false);
  });

  const onAction = (action: "delete" | "rename" | "open") => {
    setOpened(false);
    if (action === "open") {
      onOpenFolder(data.name);
      return;
    }
    if (action === "rename") {
      setSelectedRenameFile(data);
      editInputRef.current?.select();
      return;
    }

    if (action === "delete") {
      onDeleteFolder(data);
      return;
    }
  };

  return (
    <div
      ref={folderRef}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onSelect(data.name);
      }}
      className="group relative flex cursor-pointer items-center justify-between gap-x-4 rounded-md bg-gray-100 py-3 pl-5 pr-3 shadow-sm transition-all duration-200 hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
    >
      <div className="flex items-center gap-x-4">
        <span>
          <FaFolder color="#facc15" size={42} />
        </span>
        {selected?.id === data.id ? (
          <Input
            ref={editInputRef}
            onChange={(e) => setEdit(e.target.value)}
            value={edit}
            className="w-72 !pl-1  hover:text-gray-800 group-hover:text-gray-800"
            onDoubleClick={(e) => e.stopPropagation()}
            onBlur={(e) => {
              if (e.currentTarget.value === data.name) {
                setSelectedRenameFile(undefined);
                return;
              }
              onUpdateFolder({ ...data, name: edit });
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                console.log(e.currentTarget.value, "===", data.name);
                if (e.currentTarget.value === data.name) {
                  setSelectedRenameFile(undefined);
                  return;
                }
                onUpdateFolder({ ...data, name: edit });
              }
            }}
          />
        ) : (
          <span className="font-semibold tracking-wide">{data.name}</span>
        )}
      </div>
      <div className="relative">
        <Button
          onClick={() => setOpened((o) => !o)}
          size="lg"
          variant="ghost"
          className="!p-2 hover:bg-gray-700 hover:text-gray-800 focus:bg-gray-700 focus:text-white group-hover:text-white"
        >
          <BsThreeDots size={16} />
        </Button>
        {opened && (
          <DropdownActionFolder
            onDeleteFolder={() => onAction("delete")}
            onOpenFolder={() => onAction("open")}
            onRenameFolder={() => onAction("rename")}
          />
        )}
      </div>
    </div>
  );
}

