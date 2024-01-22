import { Line, Shimmer } from "@/components/ui/shimmer";

export default function ShimmerMediaManager({ total }) {
  return Array(total).fill(1)
    .map((_, key) =>
      <Shimmer key={key}>
        <div className="flex items-center justify-between gap-x-4 rounded-md w-full bg-gray-100 py-3 pl-5 pr-3 shadow-sm">
          <Line width="w-[42px]" height="h-[37px]" />
          <div className="flex justify-between w-full gap-x-4">
            <Line width="w-full" />
            <Line width="w-[30px]" />
          </div>
        </div>
      </Shimmer>
    )
}