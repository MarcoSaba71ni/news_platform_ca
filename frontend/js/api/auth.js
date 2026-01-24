import {apiPost} from './api.js';


export async function loginUser (credentials) {
    return apiPost('/auth/login', credentials);
}


export async function registerUser(userData) {
    const result = await apiPost('/auth/register', userData);
    return result.data;
}