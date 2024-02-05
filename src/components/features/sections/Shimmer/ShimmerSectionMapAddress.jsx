import { Line, Shimmer } from "@/components/ui/shimmer";
import { MARGIN_EACH_SECTION } from "@/lib/constant";

export default function ShimmerSectionMapAddress() {
  return <section className={MARGIN_EACH_SECTION}>
    <Shimmer className="flex flex-col gap-y-5 xl:w-full">
      <Line width="w-[130px]" />
      <Line width="w-full lg:w-[700px] xl:w-[900px] mx-auto" height="h-[550px]"/>
    </Shimmer>
  </section>
}