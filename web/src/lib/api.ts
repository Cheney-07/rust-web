import axios from 'axios';
import type {
  Teacher,
  Course,
  CreateTeacherRequest,
  UpdateTeacherRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
} from './types';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const healthCheck = async () => {
  const response = await api.get<string>('/health');
  return response.data;
};

// Teacher APIs
export const getTeachers = async (): Promise<Teacher[]> => {
  const response = await api.get<Teacher[]>('/teacher/');
  return response.data;
};

export const getTeacher = async (teacherId: number): Promise<Teacher> => {
  const response = await api.get<Teacher>(`/teacher/${teacherId}`);
  return response.data;
};

export const createTeacher = async (data: CreateTeacherRequest): Promise<Teacher> => {
  const response = await api.post<Teacher>('/teacher/', data);
  return response.data;
};

export const updateTeacher = async (
  teacherId: number,
  data: UpdateTeacherRequest
): Promise<Teacher> => {
  const response = await api.put<Teacher>(`/teacher/${teacherId}`, data);
  return response.data;
};

export const deleteTeacher = async (teacherId: number): Promise<string> => {
  const response = await api.delete<string>(`/teacher/${teacherId}`);
  return response.data;
};

// Course APIs
export const getCoursesByTeacher = async (teacherId: number): Promise<Course[]> => {
  const response = await api.get<Course[]>(`/course/${teacherId}`);
  return response.data;
};

export const getCourse = async (teacherId: number, courseId: number): Promise<Course> => {
  const response = await api.get<Course>(`/course/${teacherId}/${courseId}`);
  return response.data;
};

export const createCourse = async (data: CreateCourseRequest): Promise<Course> => {
  const response = await api.post<Course>('/course/', data);
  return response.data;
};

export const updateCourse = async (
  teacherId: number,
  courseId: number,
  data: UpdateCourseRequest
): Promise<Course> => {
  const response = await api.put<Course>(`/course/${teacherId}/${courseId}`, data);
  return response.data;
};

export const deleteCourse = async (teacherId: number, courseId: number): Promise<string> => {
  const response = await api.delete<string>(`/course/${teacherId}/${courseId}`);
  return response.data;
};
