/*
  # Create subjects and grades tables for academic tracking

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, subject name)
      - `code` (text, subject code like "MATH 101")
      - `credits` (integer, credit hours)
      - `semester` (text, semester like "Fall 2024")
      - `year` (integer, academic year)
      - `instructor` (text, instructor name)
      - `description` (text, optional description)
      - `color` (text, optional color for UI)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `grades`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `subject_id` (uuid, foreign key to subjects)
      - `assignment` (text, assignment name)
      - `score` (numeric, points earned)
      - `max_score` (numeric, total points possible)
      - `date` (date, when assignment was due/completed)
      - `type` (text, assignment type)
      - `weight` (numeric, weight for grade calculation)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Users can only access their own records

  3. Features
    - Automatic timestamp updates
    - Cascade deletion when subjects are deleted
    - Proper foreign key relationships
*/

-- Create update function for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  semester TEXT NOT NULL,
  year INTEGER NOT NULL,
  instructor TEXT,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS public.grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  assignment TEXT NOT NULL,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL DEFAULT 100,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL DEFAULT 'Assignment',
  weight NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Create policies for subjects
CREATE POLICY "Users can view their own subjects" 
ON public.subjects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subjects" 
ON public.subjects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects" 
ON public.subjects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects" 
ON public.subjects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on grades table
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Create policies for grades
CREATE POLICY "Users can view their own grades" 
ON public.grades 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own grades" 
ON public.grades 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grades" 
ON public.grades 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grades" 
ON public.grades 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_subjects_updated_at ON public.subjects;
CREATE TRIGGER update_subjects_updated_at
BEFORE UPDATE ON public.subjects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_grades_updated_at ON public.grades;
CREATE TRIGGER update_grades_updated_at
BEFORE UPDATE ON public.grades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_grades_user_id ON public.grades(user_id);
CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON public.grades(subject_id);
CREATE INDEX IF NOT EXISTS idx_grades_date ON public.grades(date);