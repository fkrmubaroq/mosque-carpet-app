import { Line, Shimmer } from "@/components/ui/shimmer";

export default function ShimmerSectionProjects() {
  return <div className="mb-24">
    <Shimmer>
      <Line width="w-full" height="lg:h-[700px] h-[500px] lg:h-[700px]"/>
    </Shimmer>
  </div>
}