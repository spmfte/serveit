// FileEditor.jsx
import React, { useState, useEffect } from 'react';
import { Card } from "@material-tailwind/react";

const FileEditor = ({ filePath, fetchFileContent, saveFileContent }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const loadContent = async () => {
            const fileContent = await fetchFileContent(filePath);
            setContent(fileContent);
        };
        loadContent();
    }, [filePath, fetchFileContent]);

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Card className="w-full max-w-xl p-4">
                <textarea
                    className="w-full h-64 p-2 border rounded-md"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button
                    className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md"
                    onClick={() => saveFileContent(filePath, content)}
                >
                    Save
                </button>
            </Card>
        </div>
    );
};

export default FileEditor;
