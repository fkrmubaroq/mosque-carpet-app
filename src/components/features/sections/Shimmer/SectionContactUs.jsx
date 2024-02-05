import { Line, Shimmer } from "@/components/ui/shimmer";
import { MARGIN_EACH_SECTION } from "@/lib/constant";

export default function ShimmerSectionContactUs() {
  return <Shimmer className={MARGIN_EACH_SECTION}>
    <Line width="w-full" height="h-[440px]"  />
  </Shimmer>
}