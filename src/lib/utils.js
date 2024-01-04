import fs from "fs";
import { DIR_ACCESS_FILE } from "./constant";

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function convertObjToDataSelection(obj, swap = false) {
  return Object.keys(obj).map(key => ({ id: swap ? obj[key] : key, text: swap ? key : obj[key] }));
}

export function checkResolutionImage(file){
  return new Promise((resolve, reject) => { 
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (!e.target?.result) reject();
      const image = new Image();
      image.src = e.target?.result;
      image.onload = () => {
        resolve({ width: image.width, height: image.height });
      }
    }
  })
}

export function formatNumberToPrice(priceInt, delimiters = ".") {
  if (typeof priceInt !== "number" && typeof priceInt !== "string")
    return priceInt;
  return priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiters);
}

export const createThumbnailVideo = (file, cb) => {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.addEventListener("loadeddata", () => {
    const canvas = document.createElement("canvas"); // create canvas element
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

export const handleDragZoneHover = (e, hover) => {
  const target = e.target;
  hover
    ? target.classList.add("!border-primary")
    : target.classList.remove("!border-primary");
  e.preventDefault();
};

export function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function copyToClipboard(text) {
  const elInput = document.createElement("input");
  elInput.id = "copy-clipboard";
  elInput.value = text;

  document.body.append(elInput);
  const copyText = document.getElementById(elInput.id); 
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  document.getElementById(elInput.id)?.remove();
  return copyText.value;

} 

export const generateID = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export async function incomingRequest(form, req){
  return await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      if (err) reject({ err });
      const bodyText = {};
      Object.keys(fields).forEach(key => {
        bodyText[key] = fields[key].toString();
      })

      const bodyFile = {};
      Object.keys(files).forEach(key => {
        bodyFile[key] = files[key][0]
      })

      resolve({ ...bodyText, files: bodyFile });
    });
  });

}

export async function unlinkFile(src) {
  return new Promise((resolve) => {
    fs.access(src, async (err) => {
      if (err) {
        resolve(false);
        return;
      }
      await fs.promises.unlink(src);
      resolve(true);
    });
  });
}

export function objectIntoFormData(payload) {
  const form = new FormData();
  for (const key in payload) {
    form.append(key, payload[key]);
  }
  return form;

}

export function mediaPath(dir, fileName) {
  return `${DIR_ACCESS_FILE}/${dir}/${fileName}`
}

export function setCursorPosition(el, position) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(el.childNodes[0], position);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
}