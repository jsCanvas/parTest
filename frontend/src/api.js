import axios from 'axios';

// Docker setup exposes backend at localhost:8000 via mapped ports, 
// or through browser networking.
const API_URL = 'http://localhost:8000';

export const getTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

export const createTask = async (task) => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (id, updates) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`);
  return response.data;
};
