import { NextApiRequest } from "next";
import { DIR_FILE_UPLOAD } from "./constant";
import multiparty from "multiparty";
export const debounce = (fn: Function, timeout = 300) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), timeout);
  };
};

export function convertObjToDataSelection(obj: Record<string | number, string>, swap = false) {
  return Object.keys(obj).map(key => ({ id: swap ? obj[key] : key, text: swap ? key : obj[key] }));
}

export function checkResolutionImage(file: File): Promise<{ width:number, height: number }> {
  return new Promise((resolve, reject) => { 
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (!e.target?.result) reject();
      const image = new Image();
      image.src = e.target?.result as string;
      image.onload = () => {
        resolve({ width: image.width, height: image.height });
      }
    }
  })
}

export function formatNumberToPrice(priceInt: number, delimiters = ".") {
  if (typeof priceInt !== "number" && typeof priceInt !== "string")
    return priceInt;
  return priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiters);
}

export const createThumbnailVideo = (file: File | Blob, cb: (thumbnail:string) => void) => {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.addEventListener("loadeddata", () => {
    const canvas: HTMLCanvasElement = document.createElement("canvas"); // create canvas element
    if (!canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height); // draw video frame on canvas

    const thumbnailVideo = canvas.toDataURL("image/jpeg"); // convert canvas to jpeg image URL
    cb(thumbnailVideo);
    URL.revokeObjectURL(video.src); // release object URL
  });
};

export const handleDragZoneHover = (e: React.DragEvent<HTMLDivElement>, hover: boolean): void => {
  const target = e.target as HTMLElement;
  hover
    ? target.classList.add("!border-primary")
    : target.classList.remove("!border-primary");
  e.preventDefault();
};

export function sleep(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function formatBytes(bytes:number, decimals:number = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function copyToClipboard(text: string) {
  const elInput = document.createElement("input");
  elInput.id = "copy-clipboard";
  elInput.value = text;

  document.body.append(elInput);
  const copyText = document.getElementById(elInput.id) as HTMLInputElement; 
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  document.getElementById(elInput.id)?.remove();
  return copyText.value;

} 

export const generateID = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export async function incomingRequest(form: multiparty.Form, req: NextApiRequest): Promise<Record<string, any>>{
  return await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      if (err) reject({ err });
      const bodyText: Record<string, string> = {};
      Object.keys(fields).forEach(key => {
        bodyText[key] = fields[key].toString();
      })

      const bodyFile:Record<string,string> = {};
      Object.keys(files).forEach(key => {
        bodyFile[key] = files[key][0]
      })

      resolve({ ...bodyText, files: bodyFile });
    });
  });

}