import { SANITIZE_TEXT } from "@/lib/constant";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
const ContentEditableSection = ({ onChange, ...props }) => {
  return <ContentEditable
    {...props}
    onChange={e => {
      const value = sanitizeHtml(e.target.value, SANITIZE_TEXT);
      onChange(value);
    }}
  />
};

export default ContentEditableSection;