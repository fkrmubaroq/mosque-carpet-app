import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";
import { memo } from "react";
import { AiOutlineAim } from "react-icons/ai";
import { FiTrendingUp } from "react-icons/fi";

function SectionVisionMisionMemo({ content }) {
  return (
    <section
      className={cn(
        "flex flex-col gap-x-12 lg:flex-row",
        MARGIN_EACH_SECTION
      )}
    >
      <CardContent
        className="w-full bg-secondary text-white"
        icon={<AiOutlineAim color="white" size={50} />}
        title={content?.vision?.title || ""}
        description={content?.vision?.text}
      />
      <CardContent
        className="w-full"
        icon={<FiTrendingUp size={50} color="#eab308" />}
        title={content?.mision?.title || ""}
        description={
          <span className="text-gray-600">
            {content?.mision?.text}
          </span>
        }
      />
    </section>
  );
}

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

const SectionVisionMision = memo(SectionVisionMisionMemo);

export default SectionVisionMision;