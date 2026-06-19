import axios from 'axios';

const API = 'https://thomas.proxy.rlwy.net:19023/api/students';

export const getAllStudents  = ()              => axios.get(API);
export const createStudent  = (student)       => axios.post(API, student);
export const updateStudent  = (id, student)   => axios.put(`${API}/${id}`, student);
export const deleteStudent  = (id)            => axios.delete(`${API}/${id}`);