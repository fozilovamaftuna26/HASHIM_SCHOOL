/*
# Hashim School — Boshlang'ich ma'lumotlar bazasi sxemasi

1. Yangi jadvallar
- `courses` — kurslar ro'yxati (kompyuter savodxonligi, Python, Arduino va h.k.)
  - id, slug, title, description, long_description, icon_name, age_min, age_max,
    duration_weeks, price_per_month, category, difficulty, is_active, display_order, created_at, updated_at
- `teachers` — o'qituvchilar
  - id, full_name, specialty, bio, photo_url, experience_years, display_order, created_at, updated_at
- `projects` — o'quvchilarning loyihalari
  - id, title, student_name, course_slug, description, image_url, display_order, created_at
- `enrollment_requests` — ro'yxatdan o'tish so'rovlari
  - id, full_name, phone, course_id, parent_name, student_age, notes, status, admin_notes, created_at, updated_at
- `faq_entries` — tez-tez beriladigan savollar
  - id, question, answer, category, display_order, created_at

2. Xavfsizlik (RLS)
- courses, teachers, projects, faq_entries: jamoatchilik o'qishi mumkin; admin CRUD
- enrollment_requests: anon faqat INSERT qila oladi; admin to'liq CRUD

3. Eslatmalar
- Admin huquqlari authenticated role orqali beriladi (Supabase Auth email/password)
- Enrollment requestlarni faqat admin ko'ra oladi
*/

-- ===== COURSES =====
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  long_description text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Code',
  age_min int NOT NULL DEFAULT 7,
  age_max int NOT NULL DEFAULT 18,
  duration_weeks int NOT NULL DEFAULT 12,
  price_per_month numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'dasturlash',
  difficulty text NOT NULL DEFAULT 'boshlangich',
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_courses" ON courses;
CREATE POLICY "public_read_courses"
  ON courses FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_courses" ON courses;
CREATE POLICY "admin_insert_courses"
  ON courses FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_courses" ON courses;
CREATE POLICY "admin_update_courses"
  ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_courses" ON courses;
CREATE POLICY "admin_delete_courses"
  ON courses FOR DELETE TO authenticated USING (true);

-- ===== TEACHERS =====
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  specialty text NOT NULL,
  bio text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  experience_years int NOT NULL DEFAULT 1,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_teachers" ON teachers;
CREATE POLICY "public_read_teachers"
  ON teachers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_teachers" ON teachers;
CREATE POLICY "admin_insert_teachers"
  ON teachers FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_teachers" ON teachers;
CREATE POLICY "admin_update_teachers"
  ON teachers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_teachers" ON teachers;
CREATE POLICY "admin_delete_teachers"
  ON teachers FOR DELETE TO authenticated USING (true);

-- ===== PROJECTS =====
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  student_name text NOT NULL,
  course_slug text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects"
  ON projects FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects"
  ON projects FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects"
  ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects"
  ON projects FOR DELETE TO authenticated USING (true);

-- ===== ENROLLMENT REQUESTS =====
CREATE TABLE IF NOT EXISTS enrollment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  parent_name text DEFAULT '',
  student_age int,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'yangi' CHECK (status IN ('yangi','tasdiqlangan','rad_etilgan','boglanilgan')),
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE enrollment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_enrollment" ON enrollment_requests;
CREATE POLICY "public_insert_enrollment"
  ON enrollment_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_enrollments" ON enrollment_requests;
CREATE POLICY "admin_read_enrollments"
  ON enrollment_requests FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_enrollments" ON enrollment_requests;
CREATE POLICY "admin_update_enrollments"
  ON enrollment_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_enrollments" ON enrollment_requests;
CREATE POLICY "admin_delete_enrollments"
  ON enrollment_requests FOR DELETE TO authenticated USING (true);

-- ===== FAQ =====
CREATE TABLE IF NOT EXISTS faq_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'umumiy',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faq_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_faq" ON faq_entries;
CREATE POLICY "public_read_faq"
  ON faq_entries FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_faq" ON faq_entries;
CREATE POLICY "admin_insert_faq"
  ON faq_entries FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_faq" ON faq_entries;
CREATE POLICY "admin_update_faq"
  ON faq_entries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_faq" ON faq_entries;
CREATE POLICY "admin_delete_faq"
  ON faq_entries FOR DELETE TO authenticated USING (true);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_enrollment_status ON enrollment_requests(status);
CREATE INDEX IF NOT EXISTS idx_enrollment_course ON enrollment_requests(course_id);
