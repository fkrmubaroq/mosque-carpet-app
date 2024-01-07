export default function ItemBox({ icon, text, onClick }) {
  return <div className="flex  items-center gap-x-1 p-2 cursor-pointer hover:rounded-r-md " onClick={() => onClick()}>
    <div className="shrink-0">{icon}</div>
    {text && <span className="text-xs">{text}</span>}
  </div>
}