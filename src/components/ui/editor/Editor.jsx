import { useOnClickOutside } from '@/lib/hooks';
import Blockquote from '@tiptap/extension-blockquote';
import Dropcursor from '@tiptap/extension-dropcursor';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import cn from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BsTypeUnderline } from 'react-icons/bs';
import { CiImageOn } from 'react-icons/ci';
import { FaAlignLeft, FaAlignRight } from "react-icons/fa";
import { FaAlignCenter, FaAlignJustify } from "react-icons/fa6";
import { FiBold, FiItalic } from 'react-icons/fi';
import { GoLink, GoQuote, GoStrikethrough } from "react-icons/go";
import { RxCaretDown } from "react-icons/rx";
import ImageResize from 'tiptap-extension-resize-image';
import ModalImage from './Modal/ModalImage';
import ModalLink from './Modal/ModalLink';
import UiHeading from "./ui/Heading";

const initModal = Object.freeze({
  type: "",
  show: false
});

const initFormImage = Object.freeze({ src: "" });
const initFormLink = Object.freeze({ link: "", newTab: "" });

const Editor = ({ onChange, value, className }) => {
  const wrapperRef = useRef();
  const editorRef = useRef(false);
  const [focus, setFocus] = useState(false);
  const [modal, setModal] = useState(initModal);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "tiptap-editor"
      }
    },
    extensions: [
      StarterKit.configure({
        paragraph: false
      }),
      Paragraph,
      Underline,
      Image,
      Dropcursor,
      ImageResize,
      Blockquote,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link
    ],
    content: value,
    editable: true,
    injectCSS: false,
  });

  useOnClickOutside(wrapperRef, () => {
    if (!wrapperRef.current) return;
    setFocus(false);
  })

  const onApplyImage = (form) => {
    editor.chain().focus().setImage({ src: form.src })
      .updateAttributes("image", { width: form.width, height: form.height })
      .run();
    setModal(initModal);
  }

  const onApplyLink = (form) => {
    const link = { href: form.link };
    if (form.newTab) {
      link.target = "_blank"
    }
    editor.chain().focus().toggleLink(link).run();
    setModal(initModal);
  }
  
  // when ballon menu item clicked
  const onClickMenu = (menu, data) => {
    switch (menu.name) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run(); ``
        break;
      case "image":
        setModal({ show: true, type: "image" });
        break;
      case "heading":
        if (+data.id >= 1) {
          editor.chain().focus().toggleHeading({ level: +data.id }).run()
          return;
        }
        editor.chain().focus().clearNodes().run()
        break;
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "strikethrough":
        editor.chain().focus().toggleStrike().run();
        break;
      case "text-center":
      case "text-left":
      case "text-right":
      case "text-justify":
        const align = {
          "text-center": "center",
          "text-left": "left",
          "text-right": "right",
          "text-justify": "justify",
        }
        editor.chain().focus().setTextAlign(align[menu.name]).run();
        break;
      case "link":
        setModal({ show: true, type: "link", data: initFormLink });
        break;

    }
  }

  useEffect(() => {
    if (editorRef.current || !editor) return;
    editorRef.current = true;
    editor.on("update", ({ editor }) => {
      onChange(editor.getHTML().toString())
    })
  }, [editor]);


  if (!editor) return <></>;
  return (
    <>
      {modal.show && modal.type === "image" &&
        <ModalImage
          data={modal?.data || initFormImage}
          show={modal.show}
          title="Upload Gambar Melalui URL"
          onHide={() => setModal(initModal)}
          onApply={onApplyImage}
        />
      }
      {modal.show && modal.type === "link" && 
        <ModalLink
        data={modal?.data}
        show={modal.show}
        title="Link URL"
        onHide={() => setModal(initModal)}
        onApply={onApplyLink}
        />
      }
      <div className={cn("relative", className)} ref={wrapperRef}>
        <BallonMenus editor={editor} setModal={setModal} onClickMenu={onClickMenu} show={focus} />
        <EditorContent editor={editor} onFocus={() => setFocus(true)} onChange={onChange}/>
    </div>
    </>
  )
}


const menus = [
  {
    text: <></>,
    name: "heading",
    title: "Headings"
  },
  {
    text: <FiBold />,
    name: "bold",
    title: "Bold"
  },
  {
    text: <FiItalic />,
    name: "italic",
    title: "Italic"
  },
  {
    text: <BsTypeUnderline />,
    name: "underline",
    title: "Underline"
  },
  {
    text: <CiImageOn />,
    name: "image",
    title: "URL Image"
  },
  {
    text: <GoQuote />,
    name: "blockquote",
    title: "Blockquote"
  },
  {
    text: <GoStrikethrough />,
    name: "strikethrough",
    title: "Strikethrough"
  },
  {
    text: <GoLink />,
    name: "link",
    title: "Link"
  },
  {
    text: <FaAlignJustify />,
    name: "text-alignment",
    sub: [
      {
        text: <FaAlignJustify />,
        name: "text-justify",
        title: "Justify"
      },
      {
        text: <FaAlignLeft />,
        name: "text-left",
        title: "Left"
      },
      {
        text: <FaAlignRight />,
        name: "text-right",
        title: "Right"
      },
      {
        text: <FaAlignCenter />,
        name: "text-center",
        title: "Center"
      },
    ]
  },
];
function BallonMenus({ editor, show, setModal, onClickMenu }) {
 
  const getHeadingValue = () => {
    for (let i = 1; i <= 3; i++){
      if (editor.isActive("heading", { level: i })) return i;      
    }
    return 0;
  }
  return <div className={cn(" p-2 bg-white rounded-md shadow-md flex gap-x-2 transition-all duration-200",
    {
      "top-20 opacity-0 -z-10 absolute": !show,
      "top-20 z-[9999999] sticky": show,
    },
  )}
  >
    {menus.map((menu, key) => <MenuItem
      isActiveUnderline={editor.isActive("underline")}
      isActiveItalic={editor.isActive("italic")}
      isActiveBold={editor.isActive("bold")}
      isActiveBlockQuote={editor.isActive("blockquote")}
      isActiveStrikeThrough={editor.isActive("strike")}
      isActiveLink={editor.isActive('link')}
      headingValue={getHeadingValue()}
      key={key}
      menu={menu}
      onClick={onClickMenu}
      editor={editor}
      
    />)}
  </div>
}


function MenuItem({ editor, menu, headingValue, onClick, isActiveLink, isActiveBold, isActiveItalic, isActiveUnderline, isActiveBlockQuote, isActiveStrikeThrough }) {
  const [dropdown, setDropdown] = useState(false);
  if (menu.name === "heading") {
    return <UiHeading value={headingValue} onClickOption={(selected) => onClick(menu, selected)} />
  }
  
  const isActive = (menu.name === "bold" && isActiveBold) ||
    (menu.name === "italic" && isActiveItalic) ||
    (menu.name === "underline" && isActiveUnderline) ||
    (menu.name === "blockquote" && isActiveBlockQuote) ||
    (menu.name === "strikethrough" && isActiveStrikeThrough) || 
    (menu.name === "link" && isActiveLink);
  
  const getActiveTextAlignment = () => {
    const align = {
      left: "text-left",
      right: "text-right",
      center: "text-center",
      justify: "text-justify",
    }

    for (const prop in align) {
      if (editor.isActive({ textAlign: prop })) return align[prop]      
    }
  }
  const isContainDropdown = !!menu?.sub;
  return <div className={cn({ "flex items-justify relative": menu?.sub })}><div
    title={menu.title}
    className={
      cn("p-1.5 hover:bg-primary  hover:text-white cursor-pointer", {
        "bg-primary text-white": isActive,
        "rounded-md": !isContainDropdown,
        "rounded-l-md": isContainDropdown
      })}
    onClick={() => onClick(menu)}>
    {
      menu?.sub ?
        <>
          {menu.name === "text-alignment" &&
            <ActiveMenuTextAlignment isActive={getActiveTextAlignment()} menus={menu.sub} />}
        </>
        :
      menu.text
    }
  </div>
    {menu?.sub &&
      <div
        onClick={() => setDropdown(o => !o)}
        className={cn("cursor-pointer border-l hover:bg-primary h-full hover:text-white flex items-center rounded-r-md", { "bg-primary text-white" : dropdown})}>
        <RxCaretDown />
    </div>}
    {dropdown && <DropdownMenu menus={menu.sub} onClickMenu={onClick} isActive={getActiveTextAlignment()} />}
  </div>
}

function DropdownMenu({ menus, onClickMenu, isActive }) {
  return <div className={cn(" flex flex-col gap-y-1  absolute top-8 -left-0 bg-white shadow-md rounded-b-md")}>
    {menus.map((menu, key) =>
      <div
        onClick={() => onClickMenu(menu)}
        key={key}
        className={cn("p-2 first:rounded-t-md last:rounded-b-md hover:bg-primary hover:text-white cursor-pointer",
          {
            "bg-primary text-white": menu.name === isActive
          }
        )}
        title={menu.title}>
      {menu.text}
    </div>)}
  </div>
}

function ActiveMenuTextAlignment({ isActive, menus }) {
  const activeMenu = useMemo(() => menus.find((menu) => menu.name === isActive), []);
  return activeMenu.text;
}

export default Editor