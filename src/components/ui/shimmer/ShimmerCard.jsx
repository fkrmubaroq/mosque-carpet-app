import { Line, Shimmer } from ".";
import { Card, CardContent, CardFooter } from "../card";

export default function ShimmerCard({ total }) {
  return Array(total).fill(1).map((_, key) =>
    <Shimmer key={key}>
      <Card className="">
        <Line width="w-[324px]" height="h-[200px]" />
        <CardContent className="mt-3">
          <div className="flex flex-col gap-y-5">
            <Line width="w-full" />
            <div className="flex flex-col gap-y-2">
              <Line width="w-full" height="h-[7px]" />
              <Line width="w-full" height="h-[7px]" />
              <Line width="w-full" height="h-[7px]" />
              <Line width="w-full" height="h-[7px]" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-t-gray-200 pb-4 flex justify-between pt-3">
          <Line width="w-[70px]" />
          <Line width="w-[70px]" />
        </CardFooter>
      </Card>
    </Shimmer>
  )

}