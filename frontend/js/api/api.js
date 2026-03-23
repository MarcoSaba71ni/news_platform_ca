import { API_BASE } from "../utils/constants.js";

export async function apiGet(endpoint) {
    const token = localStorage.getItem('token');
    const options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        }
    };

    if(token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }   
        const data = await response.json();
        console.log('API GET response data:', data);
        return data;
    } catch (error) {
        console.error("API GET request failed:", error);
        throw error;
    }
}

export async function apiPost(endpoint, data) {
    const token = localStorage.getItem('token');
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    };
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            console.log("BACKEND ERROR:", errorData);
            throw new Error( errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        };
        const responseData = await response.json();
        console.log('API POST response data:', responseData);
        return { status: response.status, data: responseData };
    } catch (error) {
        console.error("API POST request failed:", error);
        throw error;
    }
}