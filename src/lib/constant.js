export const MIME_TYPE_VIDEO = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogg",
  "video/quicktime": "mov",
};

export const MIME_TYPE_IMAGE = {
  "image/gif": "gif",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/tiff": "tiff",
  "image/webp": "webp",
};
export const MIME_TYPE = {
  ...MIME_TYPE_IMAGE,
  ...MIME_TYPE_VIDEO,
};

export const OFFSET = 20;
export const EXPIRED_DAYS = 60 * 60 * 24 * 30; // 1 days

export const BASE_DIR = "./files"
export const DIR_FILE_UPLOAD = `${BASE_DIR}/upload`;
export const DIR_FILE_PRODUCTS = `${BASE_DIR}/products`;
export const DIR_FILE_CATEGORY = `${BASE_DIR}/categories`;
export const DIR_FILE_THUMBNAIL = `${BASE_DIR}/articles-thumbnail`;

export const DIR_ACCESS_FILE = `/api/files`;
export const placeholderImage = `/img/placeholder.webp`;

export const INIT_SECTIONS = [
  {
    "section_name": "section_hero",
    "content": {
      "tagline": "",
      "sub_tagline": {
        "title": "",
        "text": ""
      },
      "menus": [
        {
          "menu": "",
          "link": "",
          "text": "About Us"
        },
        {
          "menu": "",
          "link": "",
          "text": "Collections"
        },
        {
          "menu": "",
          "link": "",
          "text": "undefined"
        },
        {
          "menu": "",
          "link": ""
        }
      ],
      "banner": "",
      "button_secondary": "",
      "button_primary": ""
    }
  },
  {
    "section_name": "section_about_us",
    "content": {
      "heading": "",
      "title": "",
      "text": "",
      "image": ""
    }
  },
  {
    "section_name": "section_vision_mision",
    "content": {
      "vision": {
        "title": "",
        "text": ""
      },
      "mision": {
        "title": "",
        "text": ""
      }

    }
  },
  {
    "section_name": "section_why_choose_us",
    "content": {
      "heading": "",
      "title": "",
      "text": ["lorem", "ipsum"],
      "button_primary": ""
    }
  },
  {
    "section_name": "section_contact_us",
    "content": {
      "title": "",
      "text": "",
      "button_primary": ""
    }
  },
  {
    "section_name": "section_footer",
    "content": {
      "logo_text": "AL-HIJRA",
      "tagline": "Ibadah Semakin nyaman",
      "contact": {
        "address": {
            "link": "https://map",
            "text": "Jln Saluyu Indah"
        },
        "phone_wa": {
          "link": "https://map",
          "text": "Jln Saluyu Indah"
        },
        "email": {
          "link": "https://map",
          "text": "Jln Saluyu Indah"
        },
      },
      "social_media": {
        "instagram": {
          "link": "https://map",
          "text": "Jln Saluyu Indah"
        },
        "facebook": {
          "link": "https://map",
          "text": "Jln Saluyu Indah"
        },
        "tiktok": {
          "link": "https://map",
          "text": "Jln Saluyu Indah"
        }
      }
    }
  }
]

export const CONTAINER_LP = "padding-container xl:w-[1280px]";
export const MARGIN_EACH_SECTION = "lg:mb-[100px] mb-16";
