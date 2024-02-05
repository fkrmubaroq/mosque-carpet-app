import { Line, Shimmer } from "@/components/ui/shimmer";
import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";

export default function ShimmerSectionVisionMision() {
  return <section id="section_vision_mision">
    <Shimmer className={cn("flex flex-col gap-y-1 lg:gap-y-0 gap-x-12 lg:flex-row", MARGIN_EACH_SECTION)}>
      <Line width="w-full" height="h-[210px]"/>
      <Line width="w-full" height="h-[210px]"/>
    </Shimmer>
  </section>
}