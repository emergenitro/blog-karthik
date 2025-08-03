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

    const handleKeyDown = useCallback((event) => {
        if (event.ctrlKey && event.key === 'b' && event.target.tagName === 'TEXTAREA') {
            event.preventDefault();
            toggleBold(event.target);
        }
    }, [toggleBold]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <form action="/api/blog/create" method="POST" className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Create a Blog Post</h1>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium mb-2">Content</label>
                <textarea
                    ref={textareaRef}
                    name="content"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows="10"
                    className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Create Blog Post
            </button>
        </form>
    );
}