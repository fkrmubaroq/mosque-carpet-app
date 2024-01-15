import cn from "classnames";
import ContentEditable from "react-contenteditable";
export default function SectionTitle({
  context,
  title,
  classNameContext,
  onUpdateContent,
  edit
}) {

  return (
    <div className="flex flex-col gap-y-4">
      <span>
        {edit ?
          <ContentEditable
              html={context}
              className={cn(
                "inline border-b border-b-green-600 font-cinzel tracking-wide",
                "section-mode-edit",
                classNameContext
              )}
            onChange={(e) => onUpdateContent("heading", e.currentTarget.textContent)}
          /> :
          <div
            className={cn(
              "inline border-b border-b-green-600 font-cinzel tracking-wide",
              classNameContext
            )}
          >
            {context}
          </div>
        }
      </span>

      {edit ? <ContentEditable
        html={title}
        className="mb-3 font-cinzel text-3xl font-medium section-mode-edit"
        onChange={(e) => onUpdateContent("title", e.currentTarget.textContent)}
      /> :
        <div className="mb-3 font-cinzel text-3xl font-medium">{title}</div>
      }
    </div>
  );
}