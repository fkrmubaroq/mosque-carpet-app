import cn from "classnames";
export default function SectionTitle({
  context,
  title,
  classNameContext,
}) {
  return (
    <div className="flex flex-col gap-y-4">
      <span>
        <div
          className={cn(
            "inline border-b border-b-green-600 font-cinzel tracking-wide",
            classNameContext
          )}
        >
          {context}
        </div>
      </span>
      <div className="mb-3 font-cinzel text-3xl font-medium">{title}</div>
    </div>
  );
}