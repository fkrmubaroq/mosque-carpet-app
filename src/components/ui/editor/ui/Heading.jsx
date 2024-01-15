import { convertObjToDataSelection } from "@/lib/utils";
import { Selection } from "../../form/Select";

const headings = {
  0: "Normal",
  1: "Heading 1",
  2: "Heading 2",
  3: "Heading 3",  
};

export default function Heading({ value,onClickOption }) {
  console.log("value ", value);
  const getHeading = (heading, content) => {
    if (heading === '0')  return <div>{content}</div>
    if (heading === '1')  return <h1>{content}</h1>
    if (heading === '2') return <h2>{content}</h2>
    if (heading === '3') return <h3>{content}</h3>
  }
  return <Selection
    placeholder="Normal"
    enableSearch={false}
    className="w-[150px] !h-[30px] !pt-1.5 !pl-2.5 !text-xs"
    classNameToggle="!-top-1"
    options={convertObjToDataSelection(headings) || []}
    onClickOption={onClickOption}
    customItemSelection={(item) => getHeading(item.id, item.text)}
    value={headings?.[value] || ""}
  />
}