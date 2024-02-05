import { Card, CardContent } from "@/components/ui/card";
import { Line, Shimmer } from "@/components/ui/shimmer";
import { MARGIN_EACH_SECTION } from "@/lib/constant";
import cn from "classnames";

export default function ShimmerSectionArticle() {
  return <Shimmer className={cn(MARGIN_EACH_SECTION, "w-full")}>
    <div className="flex flex-col gap-y-3 w-full">
    <div className="flex justify-between items-center">
      <Line width="w-[100px]"/>
      <Line width="w-[150px]" height="h-12"/>
    </div>
      <div className="flex gap-x-8 overflow-auto">
        {Array(3).fill(1).map((_, key) => 
        <Card key={key} className="lg:w-full lg:shrink shrink-0 sm:w-[300px] w-full">
          <Line width="w-full" height="h-[300px]" />
          <CardContent>
            <div className="mt-4 flex flex-col gap-y-2">
              <Line width="w-full" />
              <div className="mt-1 mb-3">
                <Line width="w-[100px]" />
              </div>
              <div className="flex flex-col gap-y-3">
                <Line width="w-fulll"/>
                <Line width="w-[calc(100%-50px)]"/>
              </div>
            </div>
          </CardContent>
          </Card>
        )}
      </div>
    </div>
  </Shimmer>
}