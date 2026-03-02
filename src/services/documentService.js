import api from './api';

/**
 * Document Service
 * Handles all API interactions related to documents.
 */

/**
 * Get all documents
 * @returns {Promise<Array>} List of documents
 */
const getAllDocuments = async () => {
    try {
        const response = await api.get('/documents/');
        return response.data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
};

/**
 * Upload a new document
 * @param {File} file - File object to upload
 * @returns {Promise<Object>} Uploaded document data and processing status
 */
const uploadDocument = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/documents/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

/**
 * Get a single document by ID
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Document data
 */
const getDocument = async (id) => {
    try {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching document with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Update an existing document metadata
 * @param {string} id - Document ID
 * @param {Object} documentData - Updated data
 * @returns {Promise<Object>} Updated document
 */
const updateDocument = async (id, documentData) => {
    try {
        const response = await api.put(`/documents/${id}`, documentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating document with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a document
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteDocument = async (id) => {
    try {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting document with ID ${id}:`, error);
        throw error;
    }
};

const documentService = {
    getAllDocuments,
    uploadDocument,
    getDocument,
    updateDocument,
    deleteDocument
};

export default documentService;
