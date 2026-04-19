export interface Teacher {
  id: number;
  name: string;
  picture_url: string;
  profile: string;
}

export interface Course {
  id: number;
  teacher_id: number;
  name: string;
  time: string | null;
  description: string;
  format: string;
  structure: string;
  duration: string;
  price: number;
  language: string;
  level: string;
}

export interface CreateTeacherRequest {
  name: string;
  picture_url: string;
  profile: string;
}

export interface UpdateTeacherRequest {
  name?: string;
  picture_url?: string;
  profile?: string;
}

export interface CreateCourseRequest {
  teacher_id: number;
  name: string;
  description?: string;
  format?: string;
  structure?: string;
  duration?: string;
  price?: number;
  language?: string;
  level?: string;
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  format?: string;
  structure?: string;
  duration?: string;
  price?: number;
  language?: string;
  level?: string;
}
