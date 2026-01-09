import React, { useRef, useEffect } from 'react';
import { Button } from './button';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link,
    Image,
    Heading1,
    Heading2,
    Heading3,
    Strikethrough,
    Indent,
    Outdent,
} from 'lucide-react';

const RichTextEditor = ({ input, setInput }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && input.description) {
            editorRef.current.innerHTML = input.description;
        }
    }, [input.description]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        updateContent();
    };

    const updateContent = () => {
        const content = editorRef.current.innerHTML;
        setInput({ ...input, description: content });
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.maxWidth = '100%';
                    editorRef.current.appendChild(img);
                    updateContent();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

  return (
        <div className="border rounded-lg overflow-hidden">
            <div className="border-b p-2 flex flex-wrap gap-2 bg-gray-50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('bold')}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('italic')}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('underline')}
                    title="Underline"
                >
                    <Underline className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('strikethrough')}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('formatBlock', 'h1')}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('formatBlock', 'h2')}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('formatBlock', 'h3')}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('insertUnorderedList')}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('insertOrderedList')}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('outdent')}
                    title="Decrease Indent"
                >
                    <Outdent className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('indent')}
                    title="Increase Indent"
                >
                    <Indent className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('justifyLeft')}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('justifyCenter')}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('justifyRight')}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLink}
                    title="Insert Link"
                >
                    <Link className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleImageUpload}
                    title="Insert Image"
                >
                    <Image className="h-4 w-4" />
                </Button>
            </div>
            <div
                ref={editorRef}
                className="p-4 min-h-[250px] outline-none"
                contentEditable
                onInput={updateContent}
                onBlur={updateContent}
                style={{ whiteSpace: 'pre-wrap' }}
       />
    </div>
  );
};

export default RichTextEditor;
