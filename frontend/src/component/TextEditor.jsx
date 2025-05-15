import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import {
  Box,
  Button,
  Typography,
  Paper,ListItemText
} from "@mui/material";

const extensions = [
  StarterKit.configure({
    bulletList: false,
    listItem: false,
  }),
  TextStyle,
  Color,
  BulletList,
  ListItem,
];



const TextEditor = ({text,setText,socket,roomId}) => {
  const editor = useEditor({
    extensions,
    content : text || "<p>Hello world</p>",
    onUpdate:({editor})=>{
      const html = editor.getHTML();
      setText(html);
        socket.emit("text-changed", { roomId, content: html });
    },
  });

  useEffect(()=>{
if(editor && text !== editor.getHTML()){
  editor.commands.setContent(text,false)
}
  },[text])
  if (!editor) return null;

  return (
    <Box sx={{ p: 2 }}>

      <Typography variant="h6" gutterBottom>
        Rich Text Editor
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {/* Text Style Buttons */}
        <Button
          variant={editor.isActive("bold") ? "contained" : "outlined"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          B
        </Button>
        <Button
          variant={editor.isActive("italic") ? "contained" : "outlined"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          I
        </Button>
        <Button
          variant={editor.isActive("code") ? "contained" : "outlined"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
        >
          Code
        </Button>

        {/* Block Style Buttons */}
        <Button
          variant={editor.isActive("paragraph") ? "contained" : "outlined"}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 1 }) ? "contained" : "outlined"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 2 }) ? "contained" : "outlined"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 3 }) ? "contained" : "outlined"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>
        <Button
          variant={editor.isActive("bulletList") ? "contained" : "outlined"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </Button>
  
        <Button
          variant="outlined"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal Rule
        </Button>
        <Button
          variant="outlined"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          Hard Break
        </Button>

        {/* Undo/Redo */}
        <Button
          variant="outlined"
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </Button>
        <Button
          variant="outlined"
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </Button>

        <Button
          variant="outlined"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, minHeight: 200 }}>
        <EditorContent editor={editor} />
      </Paper>

      <Box mt={2}>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TextEditor;
