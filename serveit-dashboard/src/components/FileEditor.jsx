import React, { useState, useEffect } from 'react';
import { Card } from "@material-tailwind/react";
import Markdown from 'markdown-to-jsx'; // Assuming you've added markdown-to-jsx to your dependencies

const FileEditor = ({ filePath, fetchFileContent, saveFileContent }) => {
    const [content, setContent] = useState('');
    const [fileType, setFileType] = useState('');

    useEffect(() => {
        const loadContent = async () => {
            const fileContent = await fetchFileContent(filePath);
            setContent(fileContent);
            setFileType(determineFileType(filePath)); // Determine file type based on extension
        };
        loadContent();
    }, [filePath, fetchFileContent]);

    // Determine file type based on the file extension
    const determineFileType = (path) => {
        const extension = path.split('.').pop();
        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'image';
            case 'md':
                return 'markdown';
            // Add more cases as necessary
            default:
                return 'text';
        }
    };

    // Render content based on file type
    const renderContent = () => {
        switch (fileType) {
            case 'image':
                return <img src={content} alt="file" className="max-w-xl max-h-64" />;
            case 'markdown':
                return <Markdown>{content}</Markdown>;
            case 'text':
            default:
                return (
                    <textarea
                        className="w-full h-64 p-2 border rounded-md"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                );
        }
    };

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Card className="w-full max-w-xl p-4">
                {renderContent()}
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
