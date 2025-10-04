'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

export default function CreateBlogPage() {
    const [content, setContent] = useState('');
    const textareaRef = useRef(null);

    const toggleBold = useCallback((textarea) => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        if (selectedText === '') return;

        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);

        const boldStart = '<b>';
        const boldEnd = '</b>';

        const isBold = beforeText.endsWith(boldStart) && afterText.startsWith(boldEnd);

        let newText;
        let newCursorStart;
        let newCursorEnd;

        if (isBold) {
            const newBeforeText = beforeText.slice(0, -boldStart.length);
            const newAfterText = afterText.slice(boldEnd.length);
            newText = newBeforeText + selectedText + newAfterText;
            newCursorStart = start - boldStart.length;
            newCursorEnd = end - boldStart.length;
        } else {
            newText = beforeText + boldStart + selectedText + boldEnd + afterText;
            newCursorStart = start + boldStart.length;
            newCursorEnd = end + boldStart.length;
        }

        setContent(newText);

        setTimeout(() => {
            textarea.selectionStart = newCursorStart;
            textarea.selectionEnd = newCursorEnd;
            textarea.focus();
        }, 0);
    }, []);

    const toggleItalic = useCallback((textarea) => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        if (selectedText === '') return;
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);
        const italicStart = '<i>';
        const italicEnd = '</i>';
        const isItalic = beforeText.endsWith(italicStart) && afterText.startsWith(italicEnd);
        let newText;
        let newCursorStart;
        let newCursorEnd;
        if (isItalic) {
            const newBeforeText = beforeText.slice(0, -italicStart.length);
            const newAfterText = afterText.slice(italicEnd.length);
            newText = newBeforeText + selectedText + newAfterText;
            newCursorStart = start - italicStart.length;
            newCursorEnd = end - italicStart.length;
        } else {
            newText = beforeText + italicStart + selectedText + italicEnd + afterText;
            newCursorStart = start + italicStart.length;
            newCursorEnd = end + italicStart.length;
        }
        setContent(newText);
        setTimeout(() => {
            textarea.selectionStart = newCursorStart;
            textarea.selectionEnd = newCursorEnd;
            textarea.focus();
        }, 0);
    }, []);

    const handleKeyDown = useCallback((event) => {
        if (event.ctrlKey && event.key === 'b' && event.target.tagName === 'TEXTAREA') {
            event.preventDefault();
            toggleBold(event.target);
        }
        if (event.ctrlKey && event.key === 'i' && event.target.tagName === 'TEXTAREA') {
            event.preventDefault();
            toggleItalic(event.target);
        }
    }, [toggleBold, toggleItalic]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <form action="/api/blog/create" method="POST" className="max-w-3xl w-full">
                <h1 className="text-5xl font-bold mb-16 text-center">create</h1>

                <div className="space-y-8">
                    <div>
                        <label htmlFor="title" className="block text-sm text-gray-400 mb-2">title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="w-full bg-transparent border-b border-gray-800 focus:border-gray-600 outline-none py-3 text-xl transition-all duration-300"
                            placeholder="enter your title..."
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm text-gray-400 mb-2">content <span className="text-gray-600">(ctrl+b for bold, ctrl+i for italics)</span></label>
                        <textarea
                            ref={textareaRef}
                            name="content"
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="15"
                            className="w-full bg-transparent border border-gray-800 focus:border-gray-600 outline-none p-4 transition-all duration-300 resize-none"
                            placeholder="write your thoughts..."
                        ></textarea>
                    </div>

                    <div className="flex justify-center pt-8">
                        <button
                            type="submit"
                            className="px-8 py-3 border-2 border-dashed border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                        >
                            publish
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}