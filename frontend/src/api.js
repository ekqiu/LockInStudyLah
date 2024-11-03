import axios from "axios";

const API_URL = "http://localhost:8000/api";

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
