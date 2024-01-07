import { MIME_TYPE, MIME_TYPE_IMAGE } from "@/lib/constant";
import {
  checkResolutionImage, formatBytes, handleDragZoneHover
} from "@/lib/utils";
import cn from "classnames";
import Image from "next/image";
import {
  useRef,
  useState
} from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Card, CardContent } from "../card";

const UploadFile = ({
  required,
  invalid,
  multiple,
  name,
  allowResolutionImage,
  onChange,
  maxFileSizeMb,
  accept,
  placeholder,
  className,
  onRemove,
}) => {
  const fileRef = useRef(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const resetValue = () => {
    if (!fileRef.current) return;
    fileRef.current.value = "";
    if (fileRef.current.nextElementSibling) {
      const wrapper = fileRef.current.nextElementSibling;

      wrapper.style.backgroundImage = "";
      wrapper.classList.remove("!border-solid");
      wrapper.classList.remove("!border-primary");
    }
  };

  const validationFile = (file) => {
    if (maxFileSizeMb) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxFileSizeMb) {
        setError(`File melebihi ukuran maksimum ${maxFileSizeMb} MB`);
        return false;
      }
    }

    if (accept && !accept.includes(file.type)) {
      setError(
        <>
          Format file harus{" "}
          {Array.isArray(accept)
            ? accept?.map((type, key) => {
                return (
                  <span className="mr-[1px]" key={key}>
                    .{MIME_TYPE[type].toLocaleUpperCase()}{" "}
                  </span>
                );
              })
            : `Format file harus .${MIME_TYPE[file.type]}`}
        </>
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleChange = async (e) => {
    if (!fileRef.current) return;
    const files = "dataTransfer" in e ? e.dataTransfer.files : e.target.files;
    
    if (!files?.length) {
      resetValue();
      return;
    }

    if ("dataTransfer" in e) {
      fileRef.current.required = false;
    }

    for (let i = 0; i < files.length; i++){
      const valid = validationFile(files[i]);
      if (!valid) {
        setSelectedFile(undefined);
        resetValue();
        return;
      }
      // check resolution image if any
      if (allowResolutionImage?.length && MIME_TYPE_IMAGE[files[i].type]) {
        const { width, height } = await checkResolutionImage(files[i]);
  
        if (!allowResolutionImage.includes(`${width}x${height}`)) {
          resetValue();
          setError(
            <>
              Resolusi gambar harus{" "}
              {allowResolutionImage.map((item, key) => (
                <span className="mr-1 font-semibold" key={key}>
                  {item}
                </span>
              ))}
            </>
          );
          return;
        }
      }
    }

    onChange && onChange(files, (files) => {
      setSelectedFile(files)
    });
  };


  const handleClick = (e) => {
    e.stopPropagation();
    fileRef.current && fileRef.current.click();
  };

  const onDrag = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;
    handleChange(e);
    const target = e.target;
    target.classList.remove("!border-primary");
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    resetValue();
    onRemove && onRemove();
    if (required && fileRef.current) {
      fileRef.current.required = true;
    }
  };

  return (
    <div className="flex flex-col">
      <input
        accept={accept?.toString()}
        required={required}
        type="file"
        name={name}
        className="upload-file hidden"
        ref={fileRef}
        onChange={handleChange}
        multiple={multiple}
      />
      <div
        className={cn(
          "wrapper-upload-file upload-file-drop-zone relative overflow-auto",
          className,
          {
            "flex-col flex items-center justify-center": !selectedFile,
          }
        )}
        onClick={handleClick}
        onDrop={onDrag}
        onDragOver={(e) => handleDragZoneHover(e, true)}
        onDragLeave={(e) => handleDragZoneHover(e, false)}
      >
        {selectedFile ? (
          <div className={cn("grid gap-3", {
            "grid-cols-3": selectedFile.length > 1,
            "grid-cols-2": selectedFile.length === 2,
            "grid-cols-1": selectedFile.length === 1
          })}>
            {Array.from(selectedFile).map((file, key) => (
              <PreviewFile file={file} key={key} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <AiOutlineCloudUpload size={30} color="#6b7280" />
            <div className="flex flex-col items-center justify-center text-center">
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Klik untuk upload</span> atau
                drop file disini
              </p>
              <p className="text-xs text-gray-400">{placeholder}</p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <span className="ml-[2px] mt-1 text-xs text-red-500">{error}</span>
      )}
      {invalid && <span className="invalid-feedback">{invalid}</span>}
    </div>
  );
};

function PreviewFile({ file }) {
  const getSrcFile = (file) =>  URL.createObjectURL(file);
  return (
    <div>
      {MIME_TYPE_IMAGE[file.type] && (
        <Card className="rounded-none">
          <CardContent className="flex flex-col justify-center gap-y-2 !pb-4 !pt-3 !px-3 ">
            <Image src={getSrcFile(file)} width="100" height="100" alt="" className="object-cover" />
            <span className="text-sm font-semibold text-gray-600 line-clamp-2">
              {file.name}
            </span>
            <span className="text-sm text-gray-400">
              {formatBytes(file.size)}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default UploadFile;
