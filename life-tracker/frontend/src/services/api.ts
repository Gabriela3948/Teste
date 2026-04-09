import axios from 'axios';
import type { User, Goal, Task, Meal, Exercise, MoodEntry, SleepEntry, BodyEntry, MenstrualEntry } from '../types';

const api = axios.create({ baseURL: '/api' });

// Users
export const createUser = (data: Partial<User>) => api.post('/users', data).then(r => r.data);
export const getUser = (id: string) => api.get(`/users/${id}`).then(r => r.data);
export const updateUser = (id: string, data: Partial<User>) => api.put(`/users/${id}`, data).then(r => r.data);
export const saveDiscResults = (id: string, data: { disc_profile: string; disc_scores: Record<string, number> }) =>
  api.post(`/users/${id}/disc`, data).then(r => r.data);

// Goals
export const getGoals = (userId: string) => api.get(`/goals/${userId}`).then(r => r.data);
export const createGoal = (userId: string, data: Partial<Goal>) => api.post(`/goals/${userId}`, data).then(r => r.data);
export const updateGoal = (userId: string, goalId: string, data: Partial<Goal>) =>
  api.put(`/goals/${userId}/${goalId}`, data).then(r => r.data);
export const deleteGoal = (userId: string, goalId: string) => api.delete(`/goals/${userId}/${goalId}`).then(r => r.data);

// Daily entries
export const getDailyEntry = (userId: string, date: string) => api.get(`/daily/${userId}/${date}`).then(r => r.data);
export const getDailyList = (userId: string, params?: { from?: string; to?: string }) =>
  api.get(`/daily/${userId}`, { params }).then(r => r.data);
export const saveDailyEntry = (userId: string, date: string, data: { general_notes?: string; work_hours?: number; selfcare_hours?: number; procrastination_hours?: number }) =>
  api.post(`/daily/${userId}/${date}`, data).then(r => r.data);
export const analyzeDailyEntry = (userId: string, date: string) =>
  api.post(`/daily/${userId}/${date}/analyze`).then(r => r.data);

// Tasks
export const createTask = (userId: string, date: string, data: Partial<Task>) =>
  api.post(`/daily/${userId}/${date}/tasks`, data).then(r => r.data);
export const updateTask = (userId: string, date: string, taskId: string, data: Partial<Task>) =>
  api.put(`/daily/${userId}/${date}/tasks/${taskId}`, data).then(r => r.data);
export const deleteTask = (userId: string, date: string, taskId: string) =>
  api.delete(`/daily/${userId}/${date}/tasks/${taskId}`).then(r => r.data);

// Meals
export const createMeal = (userId: string, date: string, data: Partial<Meal>) =>
  api.post(`/daily/${userId}/${date}/meals`, data).then(r => r.data);
export const updateMeal = (userId: string, date: string, mealId: string, data: Partial<Meal>) =>
  api.put(`/daily/${userId}/${date}/meals/${mealId}`, data).then(r => r.data);
export const deleteMeal = (userId: string, date: string, mealId: string) =>
  api.delete(`/daily/${userId}/${date}/meals/${mealId}`).then(r => r.data);

// Exercises
export const createExercise = (userId: string, date: string, data: Partial<Exercise>) =>
  api.post(`/daily/${userId}/${date}/exercises`, data).then(r => r.data);
export const deleteExercise = (userId: string, date: string, exId: string) =>
  api.delete(`/daily/${userId}/${date}/exercises/${exId}`).then(r => r.data);

// Mood
export const createMood = (userId: string, date: string, data: Partial<MoodEntry>) =>
  api.post(`/daily/${userId}/${date}/mood`, data).then(r => r.data);
export const deleteMood = (userId: string, date: string, moodId: string) =>
  api.delete(`/daily/${userId}/${date}/mood/${moodId}`).then(r => r.data);

// Sleep
export const saveSleep = (userId: string, date: string, data: Partial<SleepEntry>) =>
  api.post(`/daily/${userId}/${date}/sleep`, data).then(r => r.data);

// Body
export const saveBody = (userId: string, date: string, data: Partial<BodyEntry>) =>
  api.post(`/daily/${userId}/${date}/body`, data).then(r => r.data);

// Menstrual
export const saveMenstrual = (userId: string, date: string, data: Partial<MenstrualEntry>) =>
  api.post(`/daily/${userId}/${date}/menstrual`, data).then(r => r.data);

// Reports
export const getAnalytics = (userId: string, params?: { from?: string; to?: string }) =>
  api.get(`/reports/${userId}/analytics`, { params }).then(r => r.data);
export const generateWeeklyReport = (userId: string, date: string, force = false) =>
  api.post(`/reports/${userId}/weekly`, { date, force }).then(r => r.data);
export const generateMonthlyReport = (userId: string, year: number, month: number, force = false) =>
  api.post(`/reports/${userId}/monthly`, { year, month, force }).then(r => r.data);
export const getReportHistory = (userId: string) => api.get(`/reports/${userId}/history`).then(r => r.data);
