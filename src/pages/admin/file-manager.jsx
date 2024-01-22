import File from "@/components/features/file-manager/File";
import Folder from "@/components/features/file-manager/Folder";
import ModalFormFolder from "@/components/features/file-manager/ModalForm";
import ModalPreviewFile from "@/components/features/file-manager/ModalPreviewFile";
import ModalUploadFile from "@/components/features/file-manager/ModalUpload";
import PathFile from "@/components/features/file-manager/PathFile";
import {
  DropdownFileManager
} from "@/components/features/file-manager/dropdown";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import ShimmerMediaManager from "@/components/ui/shimmer/ShimmerMediaManager";
import { createFolder, deleteFile, deleteFolder, getFileItems, updateFileName, updateFolderName, uploadFiles } from "@/lib/api/file-manager";
import { DIR_ACCESS_FILE } from "@/lib/constant";
import { useDialogStore, useFileManagerStore } from "@/lib/hookStore";
import { useOnClickOutside } from "@/lib/hooks";
import { adminFileManagerQuery } from "@/lib/queryKeys";
import { copyToClipboard, downloadFileUrl, getCumulativePathSegments } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
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

  const { mutate: mutateUpdateFile } = useMutation({
    mutationFn: (payload) => updateFileName(payload.id, { name: payload.name }),
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
      showToast("error-update-file");
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

  const { mutate: mutateDeleteFile } = useMutation({
    mutationFn: (id) => deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFileManagerQuery.getFIleItems(currentPath),
      });
      showToast("success-delete-file")
    },
    onError: () => showToast("error-delete-file"),
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

  const onDeleteFile = (selected) => {
    showConfirmation(
      "costum-message",
      {
        onConfirm: () => {
          mutateDeleteFile(selected.id)
        },
      },
      <>
        File <span className="font-bold mx-0.5">{selected.name}</span> akan dihapus, apakah anda yakin?
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

  const onUpdateFile = (selected) => {
    setSelectedRenameFile(undefined);
    mutateUpdateFile(selected);
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

  const onDownloadFile = (selected) => {
    const path = `${selected.path}${selected.name}`
    const splitPath = path.split("/");
    const fileName = splitPath[splitPath.length - 1];
    downloadFileUrl(`${DIR_ACCESS_FILE}/${path}`, fileName)
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
            <PathFile
              key={key}
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
                {item.type === "FILE" &&
                  <File
                    data={item}
                    onPreviewFile={onPreviewFile}
                    onCopySource={onCopySource}
                    setSelectedRenameFile={setSelectedRenameFile}
                    selected={selectedRenameFile}
                    onUpdateFile={onUpdateFile}
                    onDeleteFile={onDeleteFile}
                    onDownloadFile={onDownloadFile}
                />}
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