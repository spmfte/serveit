// src/services/fileService.js

/**
 * Fetches the content of a file from the server.
 * @param {string} filePath The path to the file.
 * @returns {Promise<string>}
 */
export const fetchFileContent = async (filePath) => {
    try {
        // Ensure filePath is correctly encoded to be included in the URL
        const response = await fetch(`/api/files/content?path=${encodeURIComponent(filePath)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const content = await response.text();
        return content;
    } catch (error) {
        console.error("Could not fetch file content:", error);
    }
};

/**
 * Saves the updated content of a file.
 * @param {string} filePath The path to the file.
 * @param {string} content The new content of the file.
 * @returns {Promise<void>}
 */
export const saveFileContent = async (filePath, content) => {
    try {
        const response = await fetch(`/api/files/content`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: filePath, content: content }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Could not save file content:", error);
        throw error; // Re-throw to handle it in the component
    }
};

