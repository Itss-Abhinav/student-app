import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://studentmanagement-production-f1c6.up.railway.app';
const API = `${BASE_URL.replace(/\/$/, '')}/api/students`;

export const getAllStudents  = ()              => axios.get(API);
export const createStudent  = (student)       => axios.post(API, student);
export const updateStudent  = (id, student)   => axios.put(`${API}/${id}`, student);
export const deleteStudent  = (id)            => axios.delete(`${API}/${id}`);