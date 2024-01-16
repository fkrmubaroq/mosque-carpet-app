import cn from "classnames"
export default function PingAnimation({ width = "h-3", height = "h-3" }) {
  return <span className={cn("relative flex", width, height)}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-100 opacity-75"></span>
    <span className={cn("relative inline-flex rounded-full bg-gray-50", width,height)}></span>
  </span>
}