import File from "@/components/features/file-manager/File";
import Folder from "@/components/features/file-manager/Folder";
import PathFile from "@/components/features/file-manager/PathFile";
import { getFileItems } from "@/lib/api/file-manager";
import { useKeypress } from "@/lib/hooks";
import { adminFileManagerQuery } from "@/lib/queryKeys";
import { getCumulativePathSegments } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "../../button";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../modal";
import ShimmerMediaManager from "../../shimmer/ShimmerMediaManager";

const initModal = Object.freeze({ show: false });
export default function SrcFileManager({ values, onSave, onRemoveFile }) {

  const [modal, setModal] = useState(initModal);
  const onClick = () => { setModal({ show:true })}
  const getValues = useMemo(() => {
    return values.map(item => {
      const splitItem = item.split("/");
      const fileName = splitItem?.[splitItem?.length - 1] || "";
      return fileName;
    })
  }, [values]);
  
  return <>
    {modal.show &&
      <ModalBrowse
        show={modal.show}
        onHide={() => setModal(initModal)}
        onSave={onSave} values={values}
    />
    }
    <div className="flex">
      <div className="text-gray-500 focus:text-gray-400 gap-1 items-center text-xs flex flex-wrap w-full rounded-md border bg-white px-3 py-1 italic shadow-sm ">
        {getValues?.map((item, key) => <div className="bg-gray-200 pl-2 pr-2 py-0.5 flex justify-between items-center gap-x-1.5 rounded-full" key={key}>
          <div className="flex items-center gap-x-1.5">
            <Image src={values[key]} width={20} height={20} alt="" className="rounded-full" />
            <span className="text-xs line-clamp-1 break-all">{item}</span>
          </div>
          <div className="p-1 cursor-pointer hover:bg-gray-300 rounded-full" onClick={() => onRemoveFile(key)}>
            <AiOutlineClose color="gray" size={10}/>
          </div>
        </div>)}
      </div>
      <Button type="button" className="!rounded-l-none !text-xs" onClick={onClick}>Browse</Button>
    </div>
  </>
}

function ModalBrowse({ show, onHide, onSave, values }) {
  const altActive = useKeypress(["Meta", "Alt"]);
  const [selectedFiles, setSelectedFiles] = useState(values || []);
  const [currentPath, setCurrentPath] = useState("/");
  const { data, isLoading } = useQuery({
    queryKey: adminFileManagerQuery.modalGetFileItems(currentPath),
    queryFn: async () => {
      const params = {
        path: currentPath,
      };
      const response = await getFileItems(params);
      if (response.status !== 200) throw new Error();
      return response.data.data || [];
    }
  })

  const onOpenFolder = (selectedFolder) => {
    setCurrentPath(`${currentPath}${selectedFolder}${selectedFolder ? '/' : ''}`)
  };

  const onSelectFile = (src) => {
    if (!altActive) {
      setSelectedFiles([src]);
      return;
    }
    setSelectedFiles(state => {
      const selected = selectedFiles.includes(src);
      if (!selected) return [...state, src];
      const index = selectedFiles.indexOf(src);
      console.log("index", index);
      if (index === -1) return state;
      const clone = [...selectedFiles];
      clone.splice(index, 1);
      return clone;
    })
  }
 
  return <Modal show={show} onHide={onHide} verticallyCentered size="w-[850px]">
    <ModalHeader variant="secondary" onHide={onHide}>Media Manager</ModalHeader>
    <ModalBody className="min-h-[400px] overflow-auto">
      <div className="flex justify-between">
        <div className="mb-5 flex gap-x-2 text-sm text-gray-400">
          {getCumulativePathSegments(currentPath).map((segment, key, arr) => (
            <PathFile
            key={key}
            segment={segment}
            appendArrow={key !== arr.length - 1}
            onSelect={setCurrentPath}
            />
          ))}
        </div>
       {selectedFiles?.length > 0 && <div className="h-7 text-sm flex justify-center items-center text-white rounded-full px-2 bg-secondary">{selectedFiles.length} Selected File</div>}
      </div>
      <div className="grid grid-cols-3 gap-6">
        {isLoading ? <ShimmerMediaManager total={9} /> :
          data?.map((item, key) => (
            <React.Fragment key={key}>
              {item.type === "FOLDER" && (
                <Folder
                  variant="secondary"
                  hideActionButton
                  data={item}       
                  onSelect={onOpenFolder}
                />
              )}
              {item.type === "FILE" &&
                <File
                  onSelect={onSelectFile}
                  hideActionButton
                  data={item}     
                  variant="secondary"     
                  values={selectedFiles}
                />}
            </React.Fragment>
          ))}
      </div>
    </ModalBody>
    <ModalFooter className="flex justify-end">
      <Button size="lg" variant="ghost" onClick={() => {
        setSelectedFiles([]);
        onHide();
      }}>Batal</Button>
      
      <Button
        disabled={selectedFiles.length <= 0 || !selectedFiles}
        size="lg" variant="secondary"
        onClick={() => {
          onSave(selectedFiles)
          onHide();
        }}>Simpan</Button>
    </ModalFooter>
  </Modal>
}
