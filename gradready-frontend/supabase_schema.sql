-- SUPABASE SCHEMA SETUP FOR GRADREADY

-- 1. Enable pgcrypto (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create tables
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    student_id TEXT UNIQUE,
    program TEXT,
    college TEXT,
    year_level TEXT,
    semester TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    head TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: student_id links to students table id for tracking per-student requirements
CREATE TABLE IF NOT EXISTS public.requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id TEXT REFERENCES public.departments(id),
    student_auth_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, submitted, missing, needs_revision, cleared
    due_date DATE,
    revision_note TEXT,
    uploaded_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.offices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    room TEXT,
    hours TEXT,
    phone TEXT,
    email TEXT,
    head TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Departments & Offices: Everyone can read
CREATE POLICY "Public profiles are viewable by everyone." ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public offices are viewable by everyone." ON public.offices FOR SELECT USING (true);

-- Students: Only the user can view/update their own profile
CREATE POLICY "Users can view own profile." ON public.students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile." ON public.students FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.students FOR UPDATE USING (auth.uid() = id);

-- Requirements: Only the user can view/update their own requirements
CREATE POLICY "Users can view own requirements." ON public.requirements FOR SELECT USING (auth.uid() = student_auth_id);
CREATE POLICY "Users can insert own requirements." ON public.requirements FOR INSERT WITH CHECK (auth.uid() = student_auth_id);
CREATE POLICY "Users can update own requirements." ON public.requirements FOR UPDATE USING (auth.uid() = student_auth_id);

-- 5. Storage setup for clearance documents
INSERT INTO storage.buckets (id, name, public) VALUES ('clearance-documents', 'clearance-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'clearance-documents');
CREATE POLICY "Documents are publically viewable"
ON storage.objects FOR SELECT USING (bucket_id = 'clearance-documents');
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'clearance-documents');


-- 6. Insert Seed Data for Departments & Offices
INSERT INTO public.departments (id, name, icon, head) VALUES
('library', 'University Library', '📚', 'Ms. Elena R. Santos'),
('registrar', 'Registrar''s Office', '📋', 'Dr. Marco L. Villanueva'),
('dean', 'Dean''s Office (CITE)', '🎓', 'Dr. Anna Mae T. Cruz'),
('accounting', 'Accounting Office', '💰', 'Mr. Roberto A. Domingo'),
('student-affairs', 'Student Affairs Office', '🤝', 'Ms. Patricia G. Reyes'),
('dormitory', 'Dormitory Management', '🏠', 'Mr. Angelo J. Ferrer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.offices (id, name, location, room, hours, phone, email, head, status) VALUES
('library', 'University Library', 'Main Building, 2nd Floor', 'Room 201-205', 'Mon–Fri: 7:30 AM – 6:00 PM | Sat: 8:00 AM – 12:00 PM', '(033) 337-4841 loc. 210', 'library@usa.edu.ph', 'Ms. Elena R. Santos', 'open'),
('registrar', 'Registrar''s Office', 'Administration Building, Ground Floor', 'Room 101', 'Mon–Fri: 8:00 AM – 5:00 PM', '(033) 337-4841 loc. 101', 'registrar@usa.edu.ph', 'Dr. Marco L. Villanueva', 'open'),
('dean', 'Dean''s Office (CITE)', 'CITE Building, 3rd Floor', 'Room 301', 'Mon–Fri: 8:00 AM – 5:00 PM', '(033) 337-4841 loc. 301', 'cite.dean@usa.edu.ph', 'Dr. Anna Mae T. Cruz', 'open'),
('accounting', 'Accounting Office', 'Administration Building, Ground Floor', 'Room 103-104', 'Mon–Fri: 8:00 AM – 4:30 PM', '(033) 337-4841 loc. 103', 'accounting@usa.edu.ph', 'Mr. Roberto A. Domingo', 'open'),
('student-affairs', 'Student Affairs Office', 'Student Center, 2nd Floor', 'Room 210', 'Mon–Fri: 8:00 AM – 5:00 PM', '(033) 337-4841 loc. 210', 'studentaffairs@usa.edu.ph', 'Ms. Patricia G. Reyes', 'open'),
('dormitory', 'Dormitory Management', 'Dormitory Building, Ground Floor', 'Room 001', 'Mon–Sat: 7:00 AM – 9:00 PM', '(033) 337-4841 loc. 400', 'dormitory@usa.edu.ph', 'Mr. Angelo J. Ferrer', 'open')
ON CONFLICT (id) DO NOTHING;
