import axios from 'axios'

// Shared Axios instance for authentication requests.
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Authenticate an existing user and return auth data.
export async function loginUser({ username, password }) {
  const response = await api.post('/auth/login', { username, password })
  return response.data
}

// Register a new user through DummyJSON and return the created account data.
export async function registerUser({ firstName, lastName, age, username, email, password }) {
  const response = await api.post('/users/add', {
    firstName,
    lastName,
    age,
    username,
    email,
    password,
  })
  return response.data
}

// Persist auth token in local storage for session persistence.
export function saveAuthToken(token) {
  localStorage.setItem('pm_auth_token', token)
}

// Read the stored auth token from local storage.
export function getAuthToken() {
  return localStorage.getItem('pm_auth_token')
}

// Save user details to local storage for later retrieval.
export function saveUser(user) {
  localStorage.setItem('pm_user', JSON.stringify(user))
}

// Parse and return the stored user object from local storage.
export function getUser() {
  const raw = localStorage.getItem('pm_user')
  return raw ? JSON.parse(raw) : null
}

// Clear all authentication-related local storage data.
export function clearAuth() {
  localStorage.removeItem('pm_auth_token')
  localStorage.removeItem('pm_user')
}

// Determine whether a valid auth token exists in local storage.
export function isAuthenticated() {
  return Boolean(getAuthToken())
}
