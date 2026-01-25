// FUNCTIONS TO INTERACT WITH LOCAL STORAGE
// SAVE token
// GET token
// DELETE token
// SAVE user on localStorage


export function saveToken(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

export function getToken() {
    return localStorage.getItem('token');
}

export function deleteUser() {
    localStorage.removeItem('user');
}

export function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function deleteToken() {
    localStorage.removeItem('token');
}   
