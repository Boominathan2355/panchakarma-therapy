import api from './api';
import type { UploadResponse, Document } from '../types';

/**
 * Document Service
 */

const getDocuments = async (): Promise<Document[]> => {
    try {
        const response = await api.get<Document[]>('/documents');
        return response.data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
};

const uploadDocument = async (file: File, metadata?: any): Promise<UploadResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        if (metadata) {
            formData.append('metadata', JSON.stringify(metadata));
        }

        const response = await api.post<UploadResponse>('/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

const deleteDocument = async (id: string | number): Promise<any> => {
    try {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting document ${id}:`, error);
        throw error;
    }
};

const documentService = {
    getDocuments,
    uploadDocument,
    deleteDocument
};

export default documentService;
