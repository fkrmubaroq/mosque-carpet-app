import Head from "next/head";
import dayjs from "dayjs";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import cn from "classnames";
import { Button } from "@/components/ui/button";
import {
  AiOutlineAim,
  AiFillCaretRight,
  AiOutlineWhatsApp,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineInstagram,
} from "react-icons/ai";
import { FiTrendingUp, FiThumbsUp } from "react-icons/fi";
import { BsFacebook } from "react-icons/bs";
import { FaRegLightbulb } from "react-icons/fa6";
import { BiLogoTiktok } from "react-icons/bi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

const container = "lg:mx-auto lg:w-[1280px]";
export default function Home() {
  useEffect(() => {
    document.body.classList.add("bg-slate-50");
  }, []);
  return (
    <main className="min-h-screen">
      <SectionFirst />
      <div className={cn(container)}>
        <SectionAboutUs />
        <SectionVisionMision />
        <SectionWhyChooseUs />
        <SectionContactUs />
        <SectionRecentNews />
        <SectionOurProduct />
      </div>
      <Footer />
    </main>
  );
}

const menus = ["About Us", "Collections", "Projects", "Contact Us"];
function SectionFirst() {
  return (
    <section className="h-[700px] w-full lg:mb-20">
      <header className="absolute left-0 right-0 z-50">
        <div
          className={cn("mt-4 flex items-center justify-between", container)}
        >
          <div className="flex items-center justify-center gap-x-3">
            <Image src="/img/logo.png" width="36" height="36" alt="" />
            <span className="text-lg text-white">Al-Hijra</span>
          </div>
          <nav className="flex h-16 list-none items-center justify-center gap-x-5 text-lg font-light tracking-wide text-white">
            {menus.map((item, key) => (
              <li className="cursor-pointer p-3" key={key}>
                {item}
              </li>
            ))}
          </nav>
        </div>
      </header>
      <div
        className={cn(
          "absolute h-[700px] w-full bg-cover bg-center"
          // "before:absolute before:w-full before:h-16 before:bg-black before:opacity-40 before:top-0 before:content-[''] before:block"
        )}
        style={{
          backgroundImage: `url('/img/banner.webp')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
        }}
      >
        <div className={cn("pt-48", container)}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #000000 0%, #00000000 50%)",
            }}
          ></div>
          <h1 className="relative mx-auto mb-24 text-center font-poppins text-2xl font-light tracking-wider text-white lg:max-w-[750px]">
            Solusi Kebutuhan Karpet Masjid yang terpadu dengan berbagai Merk
            Lokal dan Import dengan Kualitas dan Design Terbaik
          </h1>
          <div className="relative flex gap-x-5">
            <HeroCard
              title={
                <>
                  Karpet Masjid <span className="text-green-700">Al-Hijra</span>
                </>
              }
              text="Pusat Spesialist Karpet Masjid Terlengkap yang Amanah & Jujur Memberikan Pelayanan Terbaik Bagi Donatur & Jamaah."
              footer={
                <div className="mt-5 flex gap-x-4">
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

function HeroCard({
  title,
  text,
  footer,
}: {
  title: string | React.ReactNode;
  text: string | React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg px-12 py-10 text-white lg:max-w-[500px]"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div className="mb-4 text-3xl font-cinzel">{title}</div>
      <span className="font-poppins text-md font-light tracking-wide">
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
}: 
{
  classNameContext?: string;
  context: React.ReactNode | string;
  title: React.ReactNode | string;
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
function SectionAboutUs() {
  return (
    <section className="flex items-center gap-x-3 pt-20  lg:mb-[100px]">
      <div className="pr-40">
        <SectionTitle
          context="ABOUT US"
          title={
            <>
              Design For <span className="text-green-700">Luxury Living</span>
            </>
          }
        />

        <div className="font-poppins text-lg tracking-wide text-gray-500">
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
        <div className="absolute -left-20 top-36 border-[7px] border-white shadow-md">
          <Image
            src="/img/red-carpet-detail.webp"
            className="rounded-md"
            width="150"
            height="200"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

function SectionVisionMision() {
  return (
    <section className="flex gap-x-12 lg:mb-[100px]">
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


function CardContent({ className, icon, title, description }:
  React.ComponentPropsWithoutRef<"div"> & {
    icon?: React.ReactNode,
    title: React.ReactNode | string,
    description: React.ReactNode | string,
}) {
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

function SectionWhyChooseUs() {
  return (
    <>
      <div className="h-1 w-full border-t border-dashed"></div>
      <section className="flex items-center gap-x-3 pt-20 lg:mb-[100px]">
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
          <div className="flex items-center gap-x-10">
            <div className="flex items-center gap-x-24">
              <ItemChooseUs
                className="w-full"
                icon={<FaRegLightbulb size={110} color="#15803d" />}
                description="Solusi Kebutuhan Karpet Masjid yang terpadu dengan berbagai Merk Lokal dan Import dengan Kualitas dan Design Terbaik"
              />
              <ItemChooseUs
                className="w-full"
                icon={<FiThumbsUp size={140} color="#15803d" />}
                description="Tenaga Profesional kami telah teruji dalam melakukan pemasangan, setting, layout dengan berbagai tingkat kesulitan."
              />
            </div>
            <div className="flex w-2/3 justify-center">
              <Button
                className="flex items-center justify-center gap-x-2 !rounded-none !p-6"
              >
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

function ItemChooseUs({
  icon,
  description,
  className,
}: React.ComponentPropsWithoutRef<"div"> & {
  icon: React.ReactNode;
  description: React.ReactNode | string;
}) {
  return (
    <div className={cn("flex gap-x-7 items-center", className)}>
      {icon}
      <span className="font-normal text-gray-700 tracking-wide">{description}</span>
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

function SectionContactUs() {
  return (
    <section className="lg:mb-[100px] h-[440px]">
      <div
        className="absolute left-0 h-[440px] w-full bg-cover bg-bottom"
        style={{
          backgroundImage: `url('/img/img-contact-us.webp')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
        }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(260deg, #000000 0%, #00000000 100%)",
          }}
        ></div>
        <div className={cn("relative z-10 flex h-full items-center justify-end",container)}>
          <div>
            <div className="mb-4 max-w-[700px] font-cinzel text-5xl leading-normal text-white">
              Finding Finer Solution For Your{" "}
              <span className="text-primary">Home?</span>
            </div>
            <span className="text-lg tracking-wider text-white">
              MODULO provides everything you need.
            </span>
            <div className="mt-4">
              <Button className="flex items-center justify-center gap-x-2 !rounded-none !p-7 text-lg text-white">
                <AiOutlineWhatsApp size={22} />
                <span>CONTACT US NOW</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type TNewItem = {
    image: string,
    title: string,
    createdAt: string,
    description: string
}
const newsItems: TNewItem[] = [
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
];
function SectionRecentNews() {
  return (
    <section className="lg:mb-[100px]">
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
        {newsItems.map((item, key) => (
          <CardNewItem key={key} data={item} />
        ))}
      </div>
    </section>
  );
}

type TCategoryItem = {
  image: string,
  title: string
}

const categoryItems: TCategoryItem[] = [
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
function CardNewItem({ data }: { data: TNewItem }) {
  return (
    <div className="group flex flex-col gap-y-3 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-primary">
      <Image
        src={data.image}
        width="400"
        className="h-[350px] w-full object-cover"
        height="300"
        alt=""
      />
      <div className="flex flex-col gap-y-2 px-4 pb-8">
        <span className="mt-2 cursor-pointer text-xl font-medium tracking-wider text-gray-700 group-hover:text-white">
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


function SectionOurProduct() {
  return (
    <section className="lg:mb-[100px]">
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
        slidesPerView={4}
        spaceBetween={20}
        navigation={true}
        loop
        modules={[Navigation]}
        className="swipper-category"
      >
        {categoryItems.map((item, key) => (
          <SwiperSlide
            key={key}
            className="group cursor-pointer mb-2 flex flex-col shadow transition-all duration-500 ease-in-out hover:scale-105 hover:bg-primary"
          >

            <Image src={item.image} width="300" height="300" alt="" />
            <div className="pb-5 pt-4 font-poppins tracking-wider text-slate-700 group-hover:bg-primary group-hover:text-white">
              {item.title}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative flex gap-x-4 bg-black py-20">
      <div className={cn("flex justify-between", container)}>
        <FooterLogo />
        <FooterContactItem />
        <FooterSocialMedia />
        <FooterCopyright />
      </div>
    </footer>
  );
}

function FooterLogo() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/img/logo.png" width="80" height="80" alt="" />
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

function FooterTitleItem({ title } : { title: string | React.ReactNode}) {
  return <div className="text-3xl font-cinzel">{title}</div>
}

function FooterContentItem({ icon, text}: { icon : React.ReactNode, text: string | React.ReactNode }) {
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
    <div className="absolute bottom-0 left-0 right-0 h-11 border-t-[0.1px] border-gray-600">
      <div className={cn(container, "flex h-full items-center text-white text-sm")}>
        Copyright &copy; {currentYear} | All Rights Reserved
      </div>
    </div>
  );
}