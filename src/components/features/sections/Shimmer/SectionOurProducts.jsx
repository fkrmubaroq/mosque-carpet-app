import { Card, CardContent } from "@/components/ui/card";
import { Line, Shimmer } from "@/components/ui/shimmer";
import { MARGIN_EACH_SECTION } from "@/lib/constant";

export default function ShimmerSectionOurProducts(){
  return <Shimmer className={MARGIN_EACH_SECTION}>
    <div className="flex flex-col gap-y-3 w-full">
    <div className="flex justify-between items-center w-full">
      <Line width="w-[100px]" />
      <Line width="w-[150px]" height="h-12" />
    </div>
    <div className="flex gap-x-8 overflow-auto">
      {Array(4).fill(1).map((_, key) => 
        <Card key={key} className="w-full">
          <Line width="w-full" height="h-[200px]" />
          <CardContent className="mt-4">
            <Line width="w-[200px] mx-auto" />
          </CardContent>
      </Card>
      )}
    </div>
    </div>
  </Shimmer>
}