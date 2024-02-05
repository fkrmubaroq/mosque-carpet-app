import { Line, Shimmer } from "@/components/ui/shimmer";
import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";

export default function ShimmerSectionAboutUs() {
  return <section
    id="section_about_us"
    className={cn(
      "mb-16 flex flex-col lg:items-center gap-x-3 pt-20 lg:flex-row",
      MARGIN_EACH_SECTION
    )}
  >
    <div className="lg:pr-20 xl:pr-40 ">      
      <Shimmer className="mb-5 flex-col gap-y-3">
        <div className="mb-3">
          <Line width="w-[100px]" height="h-3" />
        </div>

        <div className="mb-3">
          <Line width="w-[300px]" height="h-3"/>
        </div>
        <Line width="w-full lg:w-[500px] xl:w-[700px]" height="h-3"/>
        <Line width="w-full lg:w-[500px] xl:w-[700px]" height="h-3"/>
        <Line width="w-full lg:w-[500px] xl:w-[700px]" height="h-3"/>
        <Line width="w-full lg:w-[500px] xl:w-[700px]" height="h-3"/>
        <Line width="w-full lg:w-[500px] xl:w-[700px]" height="h-3"/>
        <Line width="w-full lg:w-[500px] xl:w-[700px]" height="h-3"/>
      </Shimmer>
    </div>

    <Shimmer>
      <Line width="lg:mx-0 mx-auto w-[450px] xl:w-[300px]" height="h-[300px] xl:h-[400px]"/>
    </Shimmer>

  </section>
}