// src/services/fileService.js
export const fetchFileContent = async (filePath) => {
    try {
        const response = await fetch(`/content/${filePath}`); // Adjust endpoint as needed
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
  