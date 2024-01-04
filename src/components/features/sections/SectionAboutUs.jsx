import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";
import Image from "next/image";
import { memo } from "react";
import SectionTitle from "./Fragment/SectionTitle";


function SectionAboutUsMemo({ content }) {
  return (
    <section
      className={cn(
        "mb-16 flex flex-col items-center gap-x-3 pt-20 lg:flex-row",
        MARGIN_EACH_SECTION
      )}
    >
      <div className="lg:pr-40">
        <SectionTitle
          context={content?.heading || ""}
          title={
            <>
              {content?.title || ""}
            </>
          }
        />

        <div className="mb-5 font-poppins text-lg tracking-wide text-gray-500 lg:mb-0">
          {content?.text || ""}
        </div>
      </div>

      <div className="relative lg:min-w-[500px] ">
        <div className="shadow-sm">
          {content?.image &&
            <Image
              className="rounded-lg"
              src={content?.image}
              width="450"
              height="300"
              alt=""
            />
          }
        </div>
      </div>
    </section>
  );
}

const SectionAboutUs = memo(SectionAboutUsMemo);
export default SectionAboutUs;