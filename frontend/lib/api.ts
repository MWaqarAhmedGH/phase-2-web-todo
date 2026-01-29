/**
 * API client for backend communication.
 *
 * All requests include JWT token in Authorization header.
 * Base URL is read from NEXT_PUBLIC_API_URL environment variable.
 */

import { getToken } from "./auth-client";

// Base URL for backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Task data returned from the API.
 */
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Data required to create a new task.
 */
export interface CreateTaskData {
  title: string;
  description?: string;
}

/**
 * Data for updating an existing task.
 */
export interface UpdateTaskData {
  title?: string;
  description?: string;
}

/**
 * API error with status code and message.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Make an authenticated request to the backend API.
 *
 * @param endpoint - API endpoint path (without base URL)
 * @param options - Fetch options (method, body, etc.)
 * @returns Response data as JSON
 * @throws ApiError if response is not OK
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get JWT token from Better Auth
  console.log("API: Getting token...");
  const token = await getToken();
  console.log("API: Token received:", token ? `${token.substring(0, 20)}...` : "null");

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please sign in.");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log("API: Making request to:", url);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Handle non-2xx responses
  if (!response.ok) {
    let message = "An error occurred";

    try {
      const errorData = await response.json();
      message = errorData.detail || errorData.message || message;
    } catch {
      // Response body is not JSON
      message = response.statusText || message;
    }

    throw new ApiError(response.status, message);
  }

  // Handle 204 No Content (DELETE responses)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Get all tasks for a user.
 *
 * @param userId - The user's ID
 * @returns Array of tasks
 */
export async function getTasks(userId: string): Promise<Task[]> {
  return apiRequest<Task[]>(`/api/${userId}/tasks`);
}

/**
 * Create a new task.
 *
 * @param userId - The user's ID
 * @param data - Task data (title, description)
 * @returns Created task
 */
export async function createTask(
  userId: string,
  data: CreateTaskData
): Promise<Task> {
  return apiRequest<Task>(`/api/${userId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get a single task by ID.
 *
 * @param userId - The user's ID
 * @param taskId - The task's ID
 * @returns Task data
 */
export async function getTask(userId: string, taskId: number): Promise<Task> {
  return apiRequest<Task>(`/api/${userId}/tasks/${taskId}`);
}

/**
 * Update an existing task.
 *
 * @param userId - The user's ID
 * @param taskId - The task's ID
 * @param data - Fields to update (title, description)
 * @returns Updated task
 */
export async function updateTask(
  userId: string,
  taskId: number,
  data: UpdateTaskData
): Promise<Task> {
  return apiRequest<Task>(`/api/${userId}/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a task.
 *
 * @param userId - The user's ID
 * @param taskId - The task's ID
 */
export async function deleteTask(
  userId: string,
  taskId: number
): Promise<void> {
  await apiRequest<void>(`/api/${userId}/tasks/${taskId}`, {
    method: "DELETE",
  });
}

/**
 * Toggle task completion status.
 *
 * @param userId - The user's ID
 * @param taskId - The task's ID
 * @returns Updated task with toggled completed status
 */
export async function toggleTask(
  userId: string,
  taskId: number
): Promise<Task> {
  return apiRequest<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
    method: "PATCH",
  });
}
