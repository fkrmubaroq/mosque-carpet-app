export default function RecordInfo({ start, to, from }) {
  return <div className="flex gap-x-1 text-sm text-gray-500 ">
    <span>{start}</span> 
    <span>-</span>
    <span>{to}</span>
    <span>of</span>
    <span>{from}</span>
  </div>
}