import { Button } from "@/components/ui/button";
import { CONTAINER_LP, MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";
import {
  AiOutlineWhatsApp
} from "react-icons/ai";

export default function SectionContactUs({ mobile=false, content }) {
  return (
    <section className={cn("h-[440px]", MARGIN_EACH_SECTION)}>
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
            backgroundImage: `linear-gradient(${mobile?.mobileMd ? "60deg" : "260deg"
              }, #000000 0%, #00000000 100%)`,
          }}
        ></div>
        <div
          className={cn(
            "relative z-10 flex h-full items-center justify-end",
            CONTAINER_LP
          )}
        >
          <div className="px-4 lg:px-0">
            {content?.title &&
              <div className="mb-4 font-cinzel text-2xl leading-normal text-white lg:max-w-[700px] lg:text-5xl">
                {content.title}
              </div>
            }

            {content?.text &&
              <span className="text-lg tracking-wider text-white">
                {content?.text}
              </span>
            }
            <div className="mt-4">
              <Button className="flex items-center justify-center gap-x-2 !rounded-none !p-5 text-sm text-white lg:!p-7 lg:text-lg"
                onClick={() => content.contact_link && window.open(content.contact_link)}>
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