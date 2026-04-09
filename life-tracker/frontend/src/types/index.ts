export interface User {
  id: string;
  name: string;
  email?: string;
  birth_date?: string;
  weight?: number;
  height?: number;
  occupation?: string;
  lifestyle?: string;
  pre_existing_conditions?: string;
  medications?: string;
  sleep_goal_hours?: number;
  daily_calorie_goal?: number;
  disc_profile?: string;
  disc_scores?: string;
  onboarding_completed?: number;
}

export interface Goal {
  id: string;
  user_id: string;
  category: 'health' | 'work' | 'personal' | 'financial' | 'relationship' | 'spiritual';
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  deadline?: string;
  priority: number;
  active: number;
}

export interface Task {
  id: string;
  user_id: string;
  entry_date: string;
  title: string;
  category: 'work' | 'personal' | 'selfcare' | 'procrastination';
  completed: number;
  duration_minutes: number;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Meal {
  id: string;
  user_id: string;
  entry_date: string;
  meal_type: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'late_snack';
  description: string;
  estimated_calories?: number;
  quality_score?: number;
  compulsion_flag: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  user_id: string;
  entry_date: string;
  exercise_type: string;
  duration_minutes: number;
  intensity: 'low' | 'moderate' | 'high';
  calories_burned?: number;
  notes?: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  entry_date: string;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
  mood_score: number;
  emotions?: string;
  energy_level?: number;
  anxiety_level?: number;
  triggers?: string;
  observations?: string;
}

export interface SleepEntry {
  id: string;
  user_id: string;
  entry_date: string;
  bedtime?: string;
  wake_time?: string;
  total_hours?: number;
  quality_score?: number;
  interruptions?: number;
  notes?: string;
}

export interface BodyEntry {
  id: string;
  user_id: string;
  entry_date: string;
  weight?: number;
  energy_feeling?: string;
  physical_symptoms?: string;
  body_notes?: string;
}

export interface MenstrualEntry {
  id: string;
  user_id: string;
  entry_date: string;
  phase?: 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
  flow_intensity?: 'none' | 'light' | 'moderate' | 'heavy';
  cramps_level?: number;
  mood_impact?: string;
  symptoms?: string;
  notes?: string;
}

export interface DailyEntry {
  id: string;
  user_id: string;
  entry_date: string;
  productivity_score?: number;
  work_hours?: number;
  selfcare_hours?: number;
  procrastination_hours?: number;
  general_notes?: string;
  ai_analysis?: AIAnalysis;
}

export interface AIAnalysis {
  productivity_score: number;
  work_percentage: number;
  selfcare_percentage: number;
  procrastination_percentage: number;
  calorie_analysis: string;
  sleep_analysis: string;
  mood_analysis: string;
  compulsion_flags: string[];
  time_drains: string[];
  highlights: string[];
  failures: string[];
  goal_progress: string;
  recommendations: string[];
  summary: string;
  tomorrow_focus: string;
}

export interface DailyData {
  entry?: DailyEntry;
  tasks: Task[];
  meals: Meal[];
  exercises: Exercise[];
  moods: MoodEntry[];
  sleep?: SleepEntry;
  body?: BodyEntry;
  menstrual?: MenstrualEntry;
}
