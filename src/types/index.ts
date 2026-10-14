export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description: string;
  icon_name: string;
  age_min: number;
  age_max: number;
  duration_weeks: number;
  price_per_month: number;
  category: string;
  difficulty: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  full_name: string;
  specialty: string;
  bio: string;
  photo_url: string;
  experience_years: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  student_name: string;
  course_slug: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface EnrollmentRequest {
  id: string;
  full_name: string;
  phone: string;
  course_id: string | null;
  parent_name: string;
  student_age: number | null;
  notes: string;
  status: 'yangi' | 'tasdiqlangan' | 'rad_etilgan' | "boglanilgan";
  admin_notes: string;
  created_at: string;
  updated_at: string;
  course?: Course | null;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  created_at: string;
}

export type EnrollmentStatus = 'yangi' | 'tasdiqlangan' | 'rad_etilgan' | 'boglanilgan';

export const STATUS_LABELS: Record<EnrollmentStatus, string> = {
  yangi: 'Yangi',
  tasdiqlangan: 'Tasdiqlangan',
  rad_etilgan: 'Rad etilgan',
  boglanilgan: "Bog'lanilgan",
};

export const STATUS_COLORS: Record<EnrollmentStatus, string> = {
  yangi: 'bg-blue-100 text-blue-700 border-blue-200',
  tasdiqlangan: 'bg-green-100 text-green-700 border-green-200',
  rad_etilgan: 'bg-red-100 text-red-700 border-red-200',
  boglanilgan: 'bg-amber-100 text-amber-700 border-amber-200',
};

export const CATEGORY_LABELS: Record<string, string> = {
  asosiy: 'Asosiy',
  dasturlash: 'Dasturlash',
  robototexnika: 'Robototexnika',
  dizayn: 'Dizayn',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  boshlangich: 'Boshlangich',
  orta: "O'rta",
  murakkab: 'Murakkab',
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  boshlangich: 'bg-green-100 text-green-700 border-green-200',
  orta: 'bg-amber-100 text-amber-700 border-amber-200',
  murakkab: 'bg-red-100 text-red-700 border-red-200',
};
