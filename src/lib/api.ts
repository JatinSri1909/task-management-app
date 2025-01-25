import axios from 'axios';
import Cookies from 'js-cookie';

// Types
export interface Task {
  id: string;
  title: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'pending' | 'finished';
  startTime: string;
  endTime: string;
  userId: string;
}

export interface CreateTaskInput {
  title: string;
  priority: 1 | 2 | 3 | 4 | 5;
  startTime: Date;
  endTime: Date;
}

export interface UpdateTaskInput {
  title?: string;
  priority?: 1 | 2 | 3 | 4 | 5;
  status?: 'pending' | 'finished';
  startTime?: Date;
  endTime?: Date;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface TaskStats {
  overview: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completedPercentage: number;
    pendingPercentage: number;
    averageTime: number;
  };
  timeMetrics: {
    averageCompletionTime: number;
    totalTimeElapsed: number;
    totalTimeToFinish: number;
    pendingTasksByPriority: Array<{
      priority: number;
      count: number;
      timeElapsed: number;
      estimatedTimeLeft: number;
    }>;
  };
}

export interface User {
  id: string;
  email: string;
}

// API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for cookies
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
  });
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('API Login Error:', error);
      throw error;
    }
  },

  signup: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/signup', { email, password });
      return response.data;
    } catch (error: unknown) {
      console.error('API Signup Error:', error);
      throw error;
    }
  }
};

// Tasks API
export const tasks = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    priority?: number;
    status?: string;
    field?: string;
    order?: 'asc' | 'desc';
  }) => {
    const response = await api.get<TasksResponse>('/tasks', { params });
    return response.data;
  },

  create: async (task: CreateTaskInput) => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  update: async (id: string, task: UpdateTaskInput) => {
    try {
      console.log('Updating task:', { id, task });
      
      const payload = {
        ...task,
        startTime: task.startTime?.toISOString(),
        endTime: task.endTime?.toISOString()
      };
      
      console.log('API payload:', payload);
      
      const response = await api.patch<Task>(`/tasks/${id}`, payload);
      
      console.log('Update response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('API Update Error:', {
        error,
        id,
        task,
        response: error.response?.data
      });
      throw error;
    }
  },

  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },

  getStats: async () => {
    const response = await api.get<TaskStats>('/tasks/stats');
    return response.data;
  }
};
