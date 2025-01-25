// api-service.js
import { API_ENDPOINTS } from './api-config.js';

export class APIService {
    static async getLevels() {
        try {
            const response = await fetch(API_ENDPOINTS.GET_ALL_LEVELS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching levels:', error);
            throw error;
        }
    }

    static async deleteLevel(levelId) {
        try {
            const response = await fetch(`${API_ENDPOINTS.DELETE_LEVEL}${levelId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting level:', error);
            throw error;
        }
    }

    static async createLevel(cubeData) {
        try {
            const response = await fetch(API_ENDPOINTS.CREATE_LEVEL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cubeData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating level:', error);
            throw error;
        }
    }

    static async updateLevel(levelId, cubeData) {
        try {
            const response = await fetch(`${API_ENDPOINTS.UPDATE_LEVEL}${levelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cubeData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating level:', error);
            throw error;
        }
    }

    static async getLevel(levelId) {
        try {
            const response = await fetch(`${API_ENDPOINTS.GET_LEVEL}${levelId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting level:', error);
            throw error;
        }
    }
}
