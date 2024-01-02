import { Button } from "@/components/ui/button";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import {
  AiFillCaretRight,
  AiOutlineAim,
  AiOutlineClose,
  AiOutlineInstagram,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { BiLogoTiktok } from "react-icons/bi";
import { BsFacebook } from "react-icons/bs";
import { FaRegLightbulb } from "react-icons/fa6";
import { FiThumbsUp, FiTrendingUp } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RxHamburgerMenu } from "react-icons/rx";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import ButtonWa from "@/components/ui/button/ButtonWa";
import { debounce } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Navigation } from 'swiper/modules';

const Portal = dynamic( import("@/components/ui/portal").then((module) => module.default), { ssr: false });
const container = "lg:mx-auto xl:w-[1280px]";
const marginEachSection = "lg:mb-[100px] mb-16";
export default function Home() {

  const [mobileMd, setMobileMdWidth] = useState(false);
  const [mobileSm, setMobileSm] = useState(false);
  const mobile = {
    mobileMd,
    mobileSm,
  };
  useEffect(() => {
    const checkScreenWidth = () => {
      const width = window.innerWidth;
      const mobileMdWidth = width <= 968;
      const mobileSmWidth = width <= 640;
      if (mobileSmWidth) {
        setMobileSm(true);
        setMobileMdWidth(false);
        return;
      }
      setMobileSm(false);
      setMobileMdWidth(mobileMdWidth);
    };
    const debounceCheckScreenWidth = debounce(checkScreenWidth);
    debounceCheckScreenWidth();
    window.addEventListener("resize", debounceCheckScreenWidth);
    return () => window.removeEventListener("resize", debounceCheckScreenWidth);
  }, [mobile]);

  useEffect(() => {
    document.body.classList.add("bg-slate-50");
  }, []);
  return (
    <main className="min-h-screen">
      <SectionFirst mobile={mobile} />
      <div className={cn(container, "px-4")}>
        <SectionAboutUs />
        <SectionVisionMision />
        <SectionWhyChooseUs />
        <SectionContactUs mobile={mobile} />
        <SectionRecentNews mobile={mobile} />
        <SectionOurProduct mobile={mobile} />
      </div>
      <Footer />
      <ButtonWa phone=""/>
    </main>
  );
}

function SectionFirst({ mobile }) {
  return (
    <section className="h-[500px] w-full lg:mb-20 lg:h-[700px]">
      <Header mobile={mobile} />
      <div
        className={cn(
          "absolute h-[500px] w-full bg-black bg-center object-cover lg:h-[700px]"
          // "before:absolute before:w-full before:h-16 before:bg-black before:opacity-40 before:top-0 before:content-[''] before:block"
        )}
        style={{
          backgroundImage: `url('/img/banner.webp')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `100% ${mobile.mobileSm ? "100%" : ""}`,
        }}
      >
        <div className={cn("pt-28 lg:pt-48", container)}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #000000 0%, #00000000 50%)",
            }}
          ></div>
          <h1 className="relative mx-auto mb-6 max-w-[450px] px-3 text-center font-poppins text-xl font-light tracking-wider text-white lg:mb-24 lg:w-full lg:max-w-[750px] lg:px-0 lg:text-2xl">
            Solusi Kebutuhan Karpet Masjid yang terpadu dengan berbagai Merk
            Lokal dan Import dengan Kualitas dan Design Terbaik
          </h1>
          <div className="relative mx-4 flex gap-x-5">
            <HeroCard
              title={
                <>
                  Karpet Masjid <span className="text-green-700">Al-Hijra</span>
                </>
              }
              text="Pusat Spesialist Karpet Masjid Terlengkap yang Amanah & Jujur Memberikan Pelayanan Terbaik Bagi Donatur & Jamaah."
              footer={
                <div className="mt-5 flex flex-col gap-x-4 gap-y-4 lg:flex-row lg:gap-y-0">
                  <Button className="!rounded-none !px-10 !py-6 font-cinzel">
                    READ MORE
                  </Button>
                  <Button
                    variant="ghost"
                    className="!rounded-none border border-white !px-10 !py-6 font-cinzel"
                  >
                    VIEW COLLECTIONS
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const menus = ["About Us", "Collections", "Projects", "Contact Us"];
function Header({ mobile }) {
  return (
    <header className="absolute left-0 right-0 z-50 px-3 lg:px-0">
      <div className={cn("mt-4 flex items-center justify-between", container)}>
        <div className="flex items-center justify-center gap-x-3">
          <Image src="/img/logo.png" width="36" height="36" alt="" />
          <span className="text-lg text-white">Al-Hijra</span>
        </div>
        {mobile.mobileMd || mobile.mobileSm ? (
          <MobileNavigationHeader menus={menus} />
        ) : (
          <NavigationHeader menus={menus} />
        )}
      </div>
    </header>
  );
}

function NavigationHeader({ menus }) {
  return (
    <nav className="flex h-16 list-none items-center justify-center gap-x-5 text-lg font-light tracking-wide text-white">
      {menus.map((item, key) => (
        <li className="cursor-pointer p-3" key={key}>
          {item}
        </li>
      ))}
    </nav>
  );
}
function MobileNavigationHeader({ menus }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <div className="h-11 w-11 flex justify-center items-center cursor-pointer" onClick={() => setIsOpen(true)}>
        <RxHamburgerMenu color="white" size={30} />
      </div>

      <Portal>
        <div className={cn("inset-0 bg-black absolute opacity-40", { "hidden": !isOpen })} onClick={() => setIsOpen(false) }></div>
        <div
          className={cn(
            "absolute left-0 right-0 bg-white p-5 transition-all duration-300 z-50",
            {
              "-top-[1000px]": !isOpen,
              "top-0": isOpen,
            }
          )}
        >
          <div
            className="absolute right-6 top-5 cursor-pointer flex h-8 w-8 justify-center text-lg text-black"
            onClick={() => setIsOpen(false)}
          >
            <AiOutlineClose size={25} />
          </div>
          <div className="flex flex-col items-center justify-center gap-y-5">
            <div className="flex flex-col items-center gap-y-1">
              <Image src="/img/logo-black.png" width="50" height="50" alt="" />
              <span className="text-lg font-semibold tracking-wide text-black">
                AL - HIJRA
              </span>
            </div>
            <div className="mb-6 flex flex-col gap-y-8">
              {menus.map((item, key) => (
                <div className="flex justify-center" key={key}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
}

function HeroCard({
  title,
  text,
  footer,
}) {
  return (
    <div
      className="rounded-lg px-12 py-10 text-white lg:w-[500px] sm:w-[400px] w-full"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div className="mb-4 text-xl lg:text-3xl font-cinzel">{title}</div>
      <span className="font-poppins text-sm lg:text-md font-light tracking-wide">
        {text}
      </span>
      {footer}
    </div>
  );
}

function SectionTitle({
  context,
  title,
  classNameContext,
}) {
  return (
    <div className="flex flex-col gap-y-4">
      <span>
        <div
          className={cn(
            "inline border-b border-b-green-600 font-cinzel tracking-wide",
            classNameContext
          )}
        >
          {context}
        </div>
      </span>
      <div className="mb-3 font-cinzel text-3xl font-medium">{title}</div>
    </div>
  );
}
function SectionAboutUsMemo() {
  return (
    <section
      className={cn(
        "mb-16 flex flex-col items-center gap-x-3 pt-20 lg:flex-row",
        marginEachSection
      )}
    >
      <div className="lg:pr-40">
        <SectionTitle
          context="ABOUT US"
          title={
            <>
              Design For <span className="text-green-700">Luxury Living</span>
            </>
          }
        />

        <div className="mb-5 font-poppins text-lg tracking-wide text-gray-500 lg:mb-0">
          MODULO started as a boutique concept store in 2018. Today, MODULO
          provides one stop solution for home owners who seek to have finer
          interior solutions for their homes. Our designers are trained to help
          the customers realize their vision of dream home with ease by
          providing a comprehensive experience from interior design and
          construction, kitchen and wardrobe customization, fine furnishing
          solutions & home décor. MODULO as part of Metaphor Design Group.
        </div>
      </div>

      <div className="relative lg:min-w-[500px] ">
        <div className="shadow-sm">
          <Image
            className="rounded-lg"
            src="/img/red-carpet.webp"
            width="450"
            height="300"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

const SectionAboutUs = memo(SectionAboutUsMemo);

function SectionVisionMisionMemo() {
  return (
    <section
      className={cn(
        "flex flex-col gap-x-12 lg:flex-row",
        marginEachSection
      )}
    >
      <CardContent
        className="w-full bg-secondary text-white"
        icon={<AiOutlineAim color="white" size={50} />}
        title="OUR VISION"
        description={
          "Menjadi Pusat Spesialist Karpet Masjid Terlengkap yang Amanah & Jujur, Memberikan Pelayanan Terbaik Bagi Donatur dan Jamaah."
        }
      />
      <CardContent
        className="w-full"
        icon={<FiTrendingUp size={50} color="#eab308" />}
        title="OUR MISION"
        description={
          <span className="text-gray-600">
            Kepuasan Pelayanan Al-Hijra Carpets, Ibadah Semakin Nyaman
          </span>
        }
      />
    </section>
  );
}

const SectionVisionMision = memo(SectionVisionMisionMemo);


function CardContent({ className, icon, title, description }) {
  return (
    <div className={cn("flex flex-col gap-y-2 py-7 px-8", className)}>
      {icon && icon}
      <span className="text-2xl font-cinzel">{title}</span>
      <span className="font-poppins tracking-wide opacity-90 leading-7">
        {description}
      </span>
    </div>
  );
}

function SectionWhyChooseUsMemo() {
  return (
    <>
      <div className="h-1 w-full border-t border-dashed"></div>
      <section
        className={cn("flex items-center gap-x-3 pt-20", marginEachSection)}
      >
        <div>
          <SectionTitle
            classNameContext="border-b-primary"
            context="OUR VALUE"
            title={
              <>
                WHY CHOOSE <span className="text-primary">US</span>
              </>
            }
          />
          <div className="flex flex-col items-center gap-x-10 lg:flex-row lg:gap-y-0 gap-y-5 ">
            <div className="flex flex-col items-center lg:gap-x-24 lg:flex-row lg:gap-y-0 gap-y-7">
              <ItemChooseUs
                className="w-full"
                icon={<FaRegLightbulb size={50} color="#15803d" />}
                description="Solusi Kebutuhan Karpet Masjid yang terpadu dengan berbagai Merk Lokal dan Import dengan Kualitas dan Design Terbaik"
              />
              <ItemChooseUs
                className="w-full"
                icon={<FiThumbsUp size={50} color="#15803d" />}
                description="Tenaga Profesional kami telah teruji dalam melakukan pemasangan, setting, layout dengan berbagai tingkat kesulitan."
              />
            </div>
            <div className="flex w-2/3 justify-center">
              <Button className="flex items-center justify-center gap-x-2 !rounded-none !p-6">
                <span>OUR SERVICES</span>
                <AiFillCaretRight />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const SectionWhyChooseUs = memo(SectionWhyChooseUsMemo);

function ItemChooseUs({
  icon,
  description,
  className,
}) {
  return (
    <div className={cn("flex items-center gap-x-7", className)}>
      <div className="shrink-0 max-w-[425px]">{icon}</div>
      <span className="font-normal tracking-wide text-gray-700">
        {description}
      </span>
    </div>
  );
}

const partners = [
  "partner-1.webp",
  "partner-2.webp",
  "partner-3.webp",
  "partner-4.webp",
]
function SectionOurPartner() {
  return (
    <section className="lg:mb-[100px]">
      <SectionTitle
        context="BRAND"
        title={
          <>
            Our Brand <span className="text-green-700">PARTNERS</span>
          </>
        }
      />
      <div className="flex gap-x-3 justify-around">{partners.map((fileName, key) =>
        <Image
          key={key}
          src={`/img/partners/${fileName}`}
          width="240"
          height="100"
          alt=""
          className="object-contain"
        />)}</div>
    </section>
  );
}

function SectionContactUs({ mobile }) {
  return (
    <section className={cn("h-[440px]", marginEachSection)}>
      <div
        className="absolute left-0 h-[440px] w-full bg-bottom object-cover"
        style={{
          backgroundImage: `url('/img/img-contact-us.webp')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `100% ${mobile ? "100%" : ""}`,
        }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(${
              mobile.mobileMd ? "60deg" : "260deg"
            }, #000000 0%, #00000000 100%)`,
          }}
        ></div>
        <div
          className={cn(
            "relative z-10 flex h-full items-center justify-end",
            container
          )}
        >
          <div className="px-4 lg:px-0">
            <div className="mb-4 font-cinzel text-2xl leading-normal text-white lg:max-w-[700px] lg:text-5xl">
              Finding Finer Solution For Your{" "}
              <span className="text-primary">Home?</span>
            </div>
            <span className="text-lg tracking-wider text-white">
              MODULO provides everything you need.
            </span>
            <div className="mt-4">
              <Button className="flex items-center justify-center gap-x-2 !rounded-none !p-5 text-sm text-white lg:!p-7 lg:text-lg">
                <AiOutlineWhatsApp size={mobile.mobileMd ? 20 : 22} />
                <span>CONTACT US NOW</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const newsItems = [
  {
    image: "/img/news/news-1.webp",
    title: "A New Destination for kitchen & cabinet, Jakarta",
    createdAt: "2023-10-11",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  },
  {
    image: "/img/news/news-2.webp",
    title: "The Opening of MODULO",
    createdAt: "2023-10-12",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  },
  {
    image: "/img/news/news-3.webp",
    title: "Soft Launching Masjid Al-Jabar",
    createdAt: "2023-10-12",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  },
];
function SectionRecentNews({ mobile }) {
  const getSlidePerPreviewByScreen = () => {
    if (mobile.mobileSm) return 1;
    if (mobile.mobileMd) return 2;
    return 3;
  }
  return (
    <section className={cn(marginEachSection)}>
      <SectionTitle
        context="ARTICLES"
        title={
          <div className="flex justify-between">
            <div>
              Explore What’s <span className="text-green-700">New Here</span>
            </div>
            <span>
              <Button className="flex items-center justify-center gap-x-2 rounded-none !p-6">
                <span className="mt-0.5">VIEW MORE</span>
                <AiFillCaretRight />
              </Button>
            </span>
          </div>
        }
      />
      <div className="flex gap-x-8">
        <Swiper
          slidesPerView={getSlidePerPreviewByScreen()}
          spaceBetween={20}
          navigation={true}
          loop
          modules={[Navigation]}
          className="swipper-category"
        >
          {newsItems.map((item, key) => (
            <SwiperSlide key={key}>
              <CardNewItem data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}


const categoryItems = [
  {
    image: "/img/categories/category-1.webp",
    title: "Permadani Classic",
  },
  {
    image: "/img/categories/category-2.webp",
    title: "Karpet Meteran",
  },
  {
    image: "/img/categories/category-3.webp",
    title: "Karpet Masjid",
  },
  {
    image: "/img/categories/category-4.webp",
    title: "Kaligrafi",
  },
  {
    image: "/img/categories/category-5.webp",
    title: "Permadani Modern & Vintage",
  },
];
function CardNewItem({ data }) {
  return (
    <div className="group flex flex-col gap-y-3 transition-all duration-500 hover:scale-105 ease-in-out hover:bg-primary">
      <div className="image w-full">
        <Image
          src={data.image}
          width="450"
          className="w-full shrink-0 object-cover"
          height="300"
          alt=""
        />
      </div>
      <div className="flex flex-col gap-y-2 px-4 pb-8">
        <span className="mt-2 cursor-pointer text-xl font-medium hover:underline tracking-wider text-gray-700 group-hover:text-white">
          {data.title}
        </span>
        <span className="text-sm tracking-wide text-gray-400 group-hover:text-white">
          {dayjs(new Date(data.createdAt)).format("MMMM DD, YYYY")}
        </span>
        <span className="tracking-wide text-slate-600 group-hover:text-white">
          {data.description}
        </span>
      </div>
    </div>
  );
}


function SectionOurProduct({ mobile }) {
  const getSlidePerPreviewByScreen = () => {
    if (mobile.mobileSm) return 1;
    if (mobile.mobileMd) return 2;
    return 4;
  };
  return (
    <section className={marginEachSection}>
      <SectionTitle
        context="OUR PRODUCTS"
        title={
          <div className="mb-3 flex items-center justify-between">
            <div>
              Shop by <span className="text-green-700">Category</span>
            </div>
            <span>
              <Button className="flex items-center justify-center gap-x-2 rounded-none !p-6">
                <span className="mt-0.5">VIEW MORE</span>
                <AiFillCaretRight />
              </Button>
            </span>
          </div>
        }
      />
      <Swiper
        slidesPerView={getSlidePerPreviewByScreen()}
        spaceBetween={20}
        navigation={true}
        loop
        modules={[Navigation]}
        className="swipper-category"
      >
        {categoryItems.map((item, key) => (
          <SwiperSlide
            key={key}
            className="group mb-2 flex cursor-pointer flex-col shadow transition-all duration-500 ease-in-out hover:scale-105 hover:bg-primary"
          >
            <Image src={item.image} width="400" height="300" alt="" className="w-full" />
            <div className="pb-5 pt-4 text-center font-poppins tracking-wider text-slate-700 group-hover:bg-primary group-hover:text-white">
              {item.title}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function FooterMemo() {
  return (
    <footer className="relative flex gap-x-4 bg-black pt-20 pb-28 md:px-5">
      <div className={cn("flex lg:flex-row flex-col lg:gap-y-0 gap-y-8 justify-between w-full lg:px-0 px-4", container)}>
        <FooterLogo />
        <FooterContactItem />
        <FooterSocialMedia />
        <FooterCopyright />
      </div>
    </footer>
  );
}
const Footer = memo(FooterMemo);

function FooterLogo() {
  return (
    <div className="flex flex-col lg:items-center lg:justify-center">
      <span>
        <Image src="/img/logo.png" width="80" height="80" alt="" />
      </span>
      <span className="text-lg tracking-widest text-white mt-3">AL - HIJRA</span>
      <span className="text-gray-50 text-sm">Ibadah Semakin Nyaman</span>
    </div>
  );
}
function FooterContactItem() {
  return (
    <div className="flex flex-col gap-y-3 text-white">
      <FooterTitleItem title="Contact" />
      <div className="flex flex-col gap-y-2">
        <FooterContentItem
          icon={<HiOutlineLocationMarker />}
          text="Jl. Saluyu indah 10 no.9h"
        />
        <FooterContentItem icon={<AiOutlinePhone />} text="021 2329 98392" />
        <FooterContentItem icon={<AiOutlineWhatsApp />} text="0888 753 708" />
        <FooterContentItem
          icon={<AiOutlineMail />}
          text="alhijra.carpet@mail.com"
        />
      </div>
    </div>
  );
}

function FooterTitleItem({ title }) {
  return <div className="text-2xl lg:text-3xl font-cinzel ">{title}</div>
}

function FooterContentItem({ icon, text}) {
  return <div className="flex gap-x-2 items-center">
    {icon}
    <div>{text}</div>
   </div>
}

function FooterSocialMedia() {
  return (
    <div className="flex flex-col gap-y-3 text-white">
      <FooterTitleItem title="Social Media" />
      <div className="flex flex-col gap-y-2">
        <FooterContentItem icon={<AiOutlineInstagram />} text="Instagram" />
        <FooterContentItem icon={<BsFacebook />} text="Facebook" />
        <FooterContentItem icon={<BiLogoTiktok />} text="Tiktok" />
      </div>
    </div>
  );
}

function FooterCopyright() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="absolute text-center bottom-0 left-0 right-0 h-11 border-t-[0.1px] border-gray-600">
      <div className={cn(container, "flex h-full items-center justify-center text-white text-sm")}>
        Copyright &copy; {currentYear} | All Rights Reserved
      </div>
    </div>
  );
}