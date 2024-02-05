import { Line, Shimmer } from "@/components/ui/shimmer";

export default function ShimmerSectionFooter() {
  return <section>
    <Shimmer>
      <Line width="w-full" height="h-[338px]"/>
    </Shimmer>
  </section>
}