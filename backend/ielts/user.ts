import { api, APIError } from "encore.dev/api";
import { ieltsDB } from "./db";

export interface User {
  id: number;
  name: string;
  targetBand: number;
  examDate?: string;
  language: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  targetBand: number;
  examDate?: string;
  language?: string;
  theme?: string;
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  targetBand?: number;
  examDate?: string;
  language?: string;
  theme?: string;
}

// Creates a new user profile.
export const createUser = api<CreateUserRequest, User>(
  { expose: true, method: "POST", path: "/users" },
  async (req) => {
    const user = await ieltsDB.queryRow<User>`
      INSERT INTO users (name, target_band, exam_date, language, theme)
      VALUES (${req.name}, ${req.targetBand}, ${req.examDate || null}, ${req.language || 'en'}, ${req.theme || 'light'})
      RETURNING id, name, target_band as "targetBand", exam_date as "examDate", language, theme, 
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!user) {
      throw APIError.internal("Failed to create user");
    }
    
    return user;
  }
);

// Retrieves a user by ID.
export const getUser = api<{ id: number }, User>(
  { expose: true, method: "GET", path: "/users/:id" },
  async ({ id }) => {
    const user = await ieltsDB.queryRow<User>`
      SELECT id, name, target_band as "targetBand", exam_date as "examDate", language, theme,
             created_at as "createdAt", updated_at as "updatedAt"
      FROM users WHERE id = ${id}
    `;
    
    if (!user) {
      throw APIError.notFound("User not found");
    }
    
    return user;
  }
);

// Updates a user profile.
export const updateUser = api<UpdateUserRequest, User>(
  { expose: true, method: "PUT", path: "/users/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (req.name !== undefined) {
      updates.push(`name = $${values.length + 1}`);
      values.push(req.name);
    }
    if (req.targetBand !== undefined) {
      updates.push(`target_band = $${values.length + 1}`);
      values.push(req.targetBand);
    }
    if (req.examDate !== undefined) {
      updates.push(`exam_date = $${values.length + 1}`);
      values.push(req.examDate);
    }
    if (req.language !== undefined) {
      updates.push(`language = $${values.length + 1}`);
      values.push(req.language);
    }
    if (req.theme !== undefined) {
      updates.push(`theme = $${values.length + 1}`);
      values.push(req.theme);
    }
    
    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(req.id);
    
    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING id, name, target_band as "targetBand", exam_date as "examDate", language, theme,
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    const user = await ieltsDB.rawQueryRow<User>(query, ...values);
    
    if (!user) {
      throw APIError.notFound("User not found");
    }
    
    return user;
  }
);
