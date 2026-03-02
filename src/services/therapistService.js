import api from './api';

/**
 * Therapist Service
 * Handles all API interactions related to therapists.
 */

/**
 * Get all therapists
 * @returns {Promise<Array>} List of therapists
 */
const getAllTherapists = async () => {
    try {
        const response = await api.get('/therapists/');
        return response.data;
    } catch (error) {
        console.error('Error fetching therapists:', error);
        throw error;
    }
};

/**
 * Add a new therapist
 * @param {Object} therapistData - Data for the new therapist
 * @returns {Promise<Object>} Created therapist
 */
const addTherapist = async (therapistData) => {
    try {
        const response = await api.post('/therapists/', therapistData);
        return response.data;
    } catch (error) {
        console.error('Error adding therapist:', error);
        throw error;
    }
};

/**
 * Get a single therapist by ID
 * @param {string} id - Therapist ID
 * @returns {Promise<Object>} Therapist data
 */
const getTherapist = async (id) => {
    try {
        const response = await api.get(`/therapists/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching therapist with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Update an existing therapist
 * @param {string} id - Therapist ID
 * @param {Object} therapistData - Updated data
 * @returns {Promise<Object>} Updated therapist
 */
const updateTherapist = async (id, therapistData) => {
    try {
        const response = await api.put(`/therapists/${id}`, therapistData);
        return response.data;
    } catch (error) {
        console.error(`Error updating therapist with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a therapist
 * @param {string} id - Therapist ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteTherapist = async (id) => {
    try {
        const response = await api.delete(`/therapists/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting therapist with ID ${id}:`, error);
        throw error;
    }
};

const therapistService = {
    getAllTherapists,
    addTherapist,
    getTherapist,
    updateTherapist,
    deleteTherapist
};

export default therapistService;
