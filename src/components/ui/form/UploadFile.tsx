import React, {
  ChangeEvent,
  DragEvent,
  FC,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../button";
import { FiTrash2 } from "react-icons/fi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import cn from "classnames";
import {
  checkResolutionImage,
  createThumbnailVideo,
  handleDragZoneHover,
} from "@/lib/utils";
import { MIME_TYPE, MIME_TYPE_IMAGE, MIME_TYPE_VIDEO } from "@/lib/constant";
export type TypeChangeEventUploadFile =
  | ChangeEvent<HTMLInputElement>
  | React.DragEvent;
type PropsUploadFile = {
  name?: string;
  onChange?: (file: File, cb?: (file: File | Blob) => void) => void;
  maxFileSizeKB?: number;
  accept?: string | string[];
  invalid?: string;
  required?: boolean;
  textButton?: React.ReactNode;
  classNameButton?: string;
  placeholder?: string | React.ReactNode;
  thumbnail?: string;
  className?: string;
  onRemove?: () => void;
  value?: string | File;
  allowResolutionImage?: string[];
};

const UploadFile: FC<PropsUploadFile> = ({
  required,
  invalid,
  name,
  allowResolutionImage,
  onChange,
  maxFileSizeKB,
  accept,
  placeholder,
  thumbnail,
  className,
  onRemove,
  value,
}: PropsUploadFile) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | React.ReactNode>("");

  const emptyFile = (): void => {
    if (!fileRef.current) return;
    fileRef.current.value = "";
    if (fileRef.current.nextElementSibling) {
      const wrapper = fileRef.current.nextElementSibling as HTMLElement;

      wrapper.style.backgroundImage = "";
      wrapper.classList.remove("!border-solid");
      wrapper.classList.remove("!border-primary");
    }
  };

  const validationFile = (file: File | Blob): boolean => {
    if (maxFileSizeKB) {
      const sizeKB = maxFileSizeKB * 1024;
      if (file.size > sizeKB) {
        setError(`File melebihi ukuran maksimum ${maxFileSizeKB} KB`);
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

  const handleChange = async (e: TypeChangeEventUploadFile) => {
    if (!fileRef.current) return;
    const file =
      "dataTransfer" in e ? e.dataTransfer.files[0] : e.target.files?.[0];
    if (!file) {
      emptyFile();
      return;
    }

    const valid = validationFile(file);
    if (!valid) {
      emptyFile();
      return;
    }

    if ("dataTransfer" in e) {
      fileRef.current.required = false;
    }

    // check resolution image if any
    if (allowResolutionImage?.length && MIME_TYPE_IMAGE[file.type]) {
      const { width, height } = await checkResolutionImage(file);

      if (!allowResolutionImage.includes(`${width}x${height}`)) {
        emptyFile();
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
    emptyFile();
    console.log("ads")
    onChange && handleResultImage && onChange(file, handleResultImage);
  };

  const createThumbnailImage = (
    file: File | Blob,
    wrapper: HTMLElement
  ): void => {
    if (!fileRef.current) return;
    const url = window.URL.createObjectURL(file);
    wrapper.style.backgroundImage = `url('${url}')`;
    wrapper.classList.add("!border-solid");
    wrapper.classList.remove("!border-primary");
  };

  const handleResultImage = (file: File | Blob): void => {
    if (!fileRef.current) return;
    if (!fileRef.current.nextElementSibling) return;
    const wrapper = fileRef.current.nextElementSibling as HTMLElement;
    console.log("wrapper ", wrapper);
    // when type file is video
    if (MIME_TYPE_VIDEO[file.type]) {
      createThumbnailVideo(file, (thumbnailVideo: string) => {
        wrapper.style.backgroundImage = `url('${thumbnailVideo}')`;
      });
    }

    // when type file is image
    if (MIME_TYPE_IMAGE[file.type]) {
      createThumbnailImage(file, wrapper);
    }

  };

  const handleClick = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    fileRef.current && fileRef.current.click();
  };

  const onDrag = (e: DragEvent): void => {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;
    handleChange(e);
    const target = e.target as HTMLElement;
    target.classList.remove("!border-primary");
  };

  const handleRemove = (
    e: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>
  ): void => {
    e.stopPropagation();
    emptyFile();
    onRemove && onRemove();
    if (required && fileRef.current) {
      fileRef.current.required = true;
    }
  };

  const thumbnailUrl = useMemo(
    () => (thumbnail ? { backgroundImage: `url('${thumbnail}')` } : {}),
    [thumbnail]
  );

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
      />
      <div
        className={cn(
          "wrapper-upload-file upload-file-drop-zone relative",
          className
        )}
        style={thumbnailUrl}
        onClick={handleClick}
        onDrop={onDrag}
        onDragOver={(e) => handleDragZoneHover(e, true)}
        onDragLeave={(e) => handleDragZoneHover(e, false)}
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <AiOutlineCloudUpload size={30} color="#6b7280" />
          <div className="flex flex-col items-center justify-center text-center">
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Klik untuk upload</span> atau drop
              file disini
            </p>
            <p className="text-xs text-gray-400">{placeholder}</p>
          </div>
        </div>
      </div>
      {error && (
        <span className="ml-[2px] mt-1 text-xs text-red-500">{error}</span>
      )}
      {invalid && <span className="invalid-feedback">{invalid}</span>}
    </div>
  );
};

export default UploadFile;
