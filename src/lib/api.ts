import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Class {
  id: string;
  name: string;
  grade: number;
}

export interface SchoolWithClasses {
  id: string;
  name: string;
  cityId: string;
  Class: Class[];
}

export interface Experience {
  id: string;
  name: string;
  classId: string;
  userId: string;
  pin: string;
  createdAt: string;
}

export interface CreateExperienceRequest {
  name: string;
  classId: string;
}

// API Services
export const schoolService = {
  async getSchoolWithClasses(): Promise<SchoolWithClasses> {
    const response = await api.get(`/school/withClasses`);
    return response.data;
  },
};

export const experienceService = {
  async createExperience(data: CreateExperienceRequest): Promise<Experience> {
    const response = await api.post("/experience", data);
    return response.data;
  },
  async getExperience(pin: string): Promise<Experience> {
    const response = await api.get(`/experience/getOne?pin=${pin}`);
    return response.data;
  },
};
