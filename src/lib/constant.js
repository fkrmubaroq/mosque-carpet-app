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
  "image/tiff": "tiff",
  "image/webp": "webp",
};

export const acceptImage = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
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
    "content": { "logo": "http://localhost:3000/api/files/Sections/logo.png", "logo_text": "Al-Hijra", "tagline": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s", "sub_tagline": { "title": "Luxury at its finest", "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500sd" }, "menus": [{ "menu": "", "link": "", "text": "About Us" }, { "menu": "", "link": "", "text": "Collections" }, { "menu": "", "link": "", "text": "Contact Us" }, { "menu": "", "link": "", "text": "Our Products" }], "banner": "http://localhost:3000/api/files/Sections/banner.webp", "button_secondary": "View More", "button_primary": "Collection" },
    "position": 1,
  },
  {
    "section_name": "section_about_us",
    "content": { "heading": "About Us", "title": "Lorem Ipsum", "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,", "image": "http://localhost:3000/api/files/Sections/category-4.jpg" },
    "position": 2,
  },
  {
    "section_name": "section_vision_mision",
    "content": { "heading": "", "title": "", "vision": { "title": "Our Vision", "text": "To be a leading ‘One Stop Luxury Haven’ where we constantly enhance our products and services." }, "mision": { "title": "Our Vision", "text": "Create value for our customers by offering relentless exceptional quality furnishings &amp; services." } },
    "position": 3,
  },
  {
    "section_name": "section_why_choose_us",
    "content": { "heading": "Our Value", "title": "Why Choose US", "text": ["Create value for our customers by offering relentless exceptional quality furnishings", "Our designers are trained to help the customers realize their vision of their dream home."], "button_primary": "OUR SERVICE" },
    "position": 4,
  },
  {
    "section_name": "section_contact_us",
    "content": { "title": "Finding Finer Solution For Your Home?", "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry", "button_primary": "Contact Now" },
    "position": 5,
  },
  {
    "section_name": "section_footer",
    "content": { "logo_text": "AL-HIJRA", "tagline": "Ibadah Semakin nyaman", "contact": { "phone_wa": { "link": "https://map", "text": "08886351120" }, "email": { "link": "https://map", "text": "alhijracarpet@mail.com" } }, "address": [{ "link": "https://map", "text": "Jln Saluyu Indah X No.9H" }], "social_media": [{ "link": "https://map", "text": "Jln Saluyu Indah X No.9H" }], "logo": "http://localhost:3000/api/files/Sections/logo.png" },
    "position": 6,
  },
  {
    "section_name": "section_articles",
    "content": {},
    "position": 7,
  },
  {
    "section_name": "section_categories",
    "content": {},
    "position": 8,
  },
]

export const CONTAINER_LP = "padding-container xl:w-[1280px]";
export const MARGIN_EACH_SECTION = "lg:mb-[100px] mb-16";
