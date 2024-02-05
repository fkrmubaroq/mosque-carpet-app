import { Line, Shimmer } from "@/components/ui/shimmer";
import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";

export default function ShimmerSectionWhyChooseUs() {
  return <>
  <div className="h-1 w-full border-t border-dashed"></div>
    <Shimmer className={cn("pt-20 flex-col gap-y-4", MARGIN_EACH_SECTION)}>
      <Line width="w-[90px]" />
      <Line width="w-[250px]" height="h-4" />
      <div className="flex lg:flex-row flex-col lg:gap-y-0 gap-y-5 justify-between">
        <div className="flex lg:flex-row flex-col lg:gap-y-0 gap-y-5 gap-x-24 w-full">
        {Array(2).fill(1).map((_, key) =>
          <div className="flex gap-x-7 w-full" key={key}>
            <div className="shrink-0">
              <Line width="w-[57px]" height="h-[57px]" />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <Line width="w-full" />
              <Line width="w-full" />
              <Line width="w-full" />
              <Line width="w-full" />
            </div>
          </div>
          )}
        </div>
        <div className="flex justify-center w-full lg:w-2/3">
          <Line width="w-[166px]" height="h-12"/>
        </div>
      </div>
    </Shimmer>
  </>
}