import axios from "axios";
import config from "./config"; // Ensure you have the config file with the API URL

const API_URL = config.apiUrl;

export function getUserProfiles() {
  return axios.get(`${API_URL}/users/`);
}

export function getUserProfile(id) {
  return axios.get(`${API_URL}/users/${id}/`);
}

export function createUserProfile(profile) {
  return axios.post(`${API_URL}/users/`, profile);
}

export function updateUserProfile(id, profile) {
  return axios.put(`${API_URL}/users/${id}/`, profile);
}

export function deleteUserProfile(id) {
  return axios.delete(`${API_URL}/users/${id}/`);
}

export function registerUser(username, password) {
  return axios.post(`${API_URL}/register/`, { username, password });
}

export function loginUser(username, password) {
  return axios.post(`${API_URL}/login/`, { username, password });
}

export function getRecommendations(userId) {
  return axios.get(`${API_URL}/recommend_users/`, {
    params: { user_id: userId },
  });
}
