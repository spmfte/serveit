// src/services/fileService.js

/**
 * Fetches the content of a file.
 * @param {string} filePath The path to the file.
 * @returns {Promise<string>} The content of the file.
 */
export const fetchFileContent = async (filePath) => {
    try {
      const response = await fetch(`/api/files/content/${encodeURIComponent(filePath)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.text(); // Adjust according to the expected content type
    } catch (error) {
      console.error("Could not fetch file content:", error);
      throw error; // Re-throw to handle it in the component
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
      const response = await fetch(`/api/files/content/${encodeURIComponent(filePath)}`, {
        method: 'PUT', // or 'POST' depending on your API
        headers: { 'Content-Type': 'text/plain' }, // Adjust according to the content type
        body: content,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Could not save file content:", error);
      throw error; // Re-throw to handle it in the component
    }
  };
  