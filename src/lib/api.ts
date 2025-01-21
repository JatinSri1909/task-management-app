import axios from 'axios';
import { auth } from './auth';

// Types
export interface Task {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'pending' | 'finished';
  userId: string;
}

export interface CreateTaskInput {
  title: string;
  startTime: Date;
  endTime: Date;
  priority: 1 | 2 | 3 | 4 | 5;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: 'pending' | 'finished';
}

export interface TaskStats {
  totalTasks: number;
  completedPercentage: number;
  pendingPercentage: number;
  pendingTasksByPriority: {
    priority: number;
    timeElapsed: number;
    estimatedTimeLeft: number;
  }[];
  averageCompletionTime: number;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

// API class
export const api = {
  // Configure axios instance
  init: () => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Add auth header interceptor
    axios.interceptors.request.use((config) => {
      const token = auth.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  },

  // Tasks
  tasks: {
    getAll: async (page = 1, limit = 10, filters?: { priority?: number; status?: string }, sort?: { field: string; order: 'asc' | 'desc' }): Promise<TasksResponse> => {
      const response = await axios.get('/api/tasks', { params: { page, limit, ...filters, ...sort } });
      return response.data;
    },

    getById: async (id: string): Promise<Task> => {
      const response = await axios.get(`/api/tasks/${id}`);
      return response.data;
    },

    create: async (task: CreateTaskInput): Promise<Task> => {
      const response = await axios.post('/api/tasks', task);
      return response.data;
    },

    update: async (id: string, updates: UpdateTaskInput): Promise<Task> => {
      const response = await axios.patch(`/api/tasks/${id}`, updates);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await axios.delete(`/api/tasks/${id}`);
    }
  },

  // Dashboard
  dashboard: {
    getStats: async (): Promise<TaskStats> => {
      const response = await axios.get('/api/tasks/stats');
      return response.data;
    }
  }
};
