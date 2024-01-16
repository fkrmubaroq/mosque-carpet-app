import ModalFormFolder from "@/components/features/file-manager/ModalForm";
import ModalPreviewFile from "@/components/features/file-manager/ModalPreviewFile";
import ModalUploadFile from "@/components/features/file-manager/ModalUpload";
import {
  DropdownActionFile,
  DropdownActionFolder,
  DropdownFileManager,
} from "@/components/features/file-manager/dropdown";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form/input";
import { Line, Shimmer } from "@/components/ui/shimmer";
import { createFolder, deleteFolder, getFileItems, updateFolderName, uploadFiles } from "@/lib/api/file-manager";
import { DIR_ACCESS_FILE } from "@/lib/constant";
import { useDialogStore, useFileManagerStore } from "@/lib/hookStore";
import { useOnClickOutside } from "@/lib/hooks";
import { adminFileManagerQuery } from "@/lib/queryKeys";
import { copyToClipboard } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";

const initModal = Object.freeze({
  show: false,
  type: "folder",
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
  const [modal, setModal] = useState(initModal);
  const [selectedRenameFile, setSelectedRenameFile] = useState();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
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
    onError: (error) => {
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
    mutationFn: (payload) => updateFolderName(payload.id, { name: payload.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFileManagerQuery.getFIleItems(currentPath),
      });
    },
    onError: (e) => {
      if (e.response?.data?.message) {
        showToast("custom-message", e.response.data.message,"danger");
        return;
      }
      showToast("error-update-folder");
    }
  });

  const { mutate: mutateDeleteFolder } = useMutation({
    mutationFn: (id) => deleteFolder(id),
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

  const getCumulativePathSegments = useCallback((path) => {
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

  const onDeleteFolder = (selected) => {
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

  const onOpenFolder = (selectedFolder) => {
    setPath(`${currentPath}${selectedFolder}${selectedFolder ? '/' : ''}`)
  };

  const onSaveFolder = (folderName) => {
    if (modal.type === "add-folder") {
      mutateCreateFolder({
        name: folderName,
        path: currentPath
      });
      return;
    }    
  }

  const onUpdateFolder = (selected) => {
    setSelectedRenameFile(undefined);
    mutateUpdateFolder(selected);
  }

  const onPreviewFile = (selected) => {
    setModal({
      show: true,
      type: "preview-file",
      data: selected
    })
  }

  const onCopySource = (selected) => {
    const text = `${window.location.origin}${DIR_ACCESS_FILE}${selected.path}${selected.name}`;
    copyToClipboard(text);
    showToast("custom-message","Teks telah disalin","default")
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
        modal.type === "preview-file" && modal?.data && <ModalPreviewFile onHide={() => setModal(initModal)} data={modal.data} />
      }
      <Layout
        classNameTitle="w-full"
        title="Media Manager"
      >
        <div className="flex justify-between">
          <div className="mb-4 text-xl font-medium tracking-wide">
            Media
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
          {isLoading ? <ShimmerMediaManager total={9} /> :
            data?.map((item, key) => (
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
}) {
  const dropdownRef = useRef(null);

  const [opened, setOpened] = useState(false);
  useOnClickOutside(dropdownRef, () => {
    if (!opened) return;
    setOpened(false);
  });
  return (
    <div className="relative flex gap-x-2" ref={dropdownRef}>
      <Button size="lg" className="flex gap-x-2 !px-8" onClick={() => onClickUploadFile()}>
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

function PathItem({ segment, appendArrow, onSelect }) {
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
}) {
  const [opened, setOpened] = useState(false);
  const fileRef = useRef(null);
  const editInputRef = useRef(null);
  const [edit, setEdit] = useState(data.name);

  useOnClickOutside(fileRef, () => {
    if (!opened) return;
    setOpened(false);
  });

  const onAction = (action) => {
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
      className="group flex cursor-pointer items-center justify-between gap-x-4 rounded-md bg-gray-50 py-3 pl-3.5 pr-3 shadow-sm transition-all duration-200 hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
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
}) {
  const folderRef = useRef(null);
  const editInputRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const [edit, setEdit] = useState(data.name);

  useEffect(() => {
    if (selected?.id !== data.id || !editInputRef.current) return;
    editInputRef.current.select();
    setEdit(data.name);
  }, [selected]);

  useOnClickOutside(folderRef, () => {
    if (!opened) return;
    setOpened(false);
  });

  const onAction = (action) => {
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
      className="group relative flex cursor-pointer items-center justify-between gap-x-4 rounded-md bg-gray-50 py-3 pl-5 pr-3 shadow-sm transition-all duration-200 hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
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

function ShimmerMediaManager({ total }) {
  return Array(total).fill(1)
    .map((_, key) =>
        <Shimmer key={key}>
          <div className="flex items-center justify-between gap-x-4 rounded-md w-full bg-gray-100 py-3 pl-5 pr-3 shadow-sm">
            <Line width="w-[42px]" height="h-[37px]" />
            <div className="flex justify-between w-full gap-x-4">
              <Line width="w-full" />
              <Line width="w-[30px]"/>
            </div>
          </div>
        </Shimmer>
    )
}