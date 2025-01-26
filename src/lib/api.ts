import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Types
export interface User {
  id: string;
  email: string;
}

export interface Task {
  id: string;      // For frontend use
  _id: string;     // From MongoDB
  title: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'pending' | 'finished';
  startTime: string;
  endTime: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
  userId?: string;
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

// API instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
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
      console.log('Login attempt:', { email, url: `${api.defaults.baseURL}/auth/login` });
      const response = await api.post('/auth/login', { email, password });
      
      // Store token in cookie
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 30 });
      }
      
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Login failed:', error.response?.data || error.message);
      }
      throw error;
    }
  },

  signup: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/signup', { 
        email, 
        password,
        confirmPassword: password 
      });
      
      // Store token in cookie
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 30 });
      }
      
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('API Signup Error:', error.response?.data || error);
      }
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
    try {
      console.log('Creating task:', task);
      const response = await api.post<Task>('/tasks', {
        ...task,
        startTime: new Date(task.startTime).toISOString(),
        endTime: new Date(task.endTime).toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  update: async (taskId: string, task: UpdateTaskInput) => {
    try {
      // Use _id for MongoDB
      const response = await api.patch<Task>(`/tasks/${taskId}`, {
        title: task.title,
        priority: task.priority,
        status: task.status?.toLowerCase(),
        startTime: task.startTime?.toISOString(),
        endTime: task.endTime?.toISOString()
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('API update error:', {
          message: error.message,
          data: error.response?.data,
          status: error.response?.status
        });
      }
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },

  getStats: async () => {
    const response = await api.get<TaskStats>('/tasks/stats');
    return response.data;
  }
};
