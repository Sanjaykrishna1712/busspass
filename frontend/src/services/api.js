import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
});

// Attach token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Face Registration (now supports multiple images)
export const registerFace = async (formData) => {
  try {
    const token = localStorage.getItem('token'); 
    const res = await fetch(`${API_URL}/face_auth/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    return { success: res.ok, ...data };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};

// Face Verification
export const verifyFace = async (formData) => {
  const { data } = await api.post('/face_auth/verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Face Login (verify → JWT)
export const loginWithFace = async (formData) => {
  const verifyResponse = await api.post('/face_auth/verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!verifyResponse.data?.success || !verifyResponse.data?.user_id) {
    throw new Error(verifyResponse.data?.message || 'Face not recognized');
  }

  const { data } = await api.post('/auth/login_face', { 
    user_id: verifyResponse.data.user_id 
  });

  return data; // { token, user_id, name, user_type }
};
