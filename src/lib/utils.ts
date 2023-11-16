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