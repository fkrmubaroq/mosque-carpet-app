export const MIME_TYPE_VIDEO: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogg",
  "video/quicktime": "mov",
};

export const MIME_TYPE_IMAGE: Record<string, string> = {
  "image/gif": "gif",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/tiff": "tiff",
  "image/webp": "webp",
};
export const MIME_TYPE: Record<string, string> = {
  ...MIME_TYPE_IMAGE,
  ...MIME_TYPE_VIDEO,
};