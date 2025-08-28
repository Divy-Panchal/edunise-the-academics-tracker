/*
  # Create grades table for academic tracking

  1. New Tables
    - `grades`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `subject` (text, course/subject name)
      - `assignment` (text, assignment/test name)
      - `score` (integer, points earned)
      - `max_score` (integer, total possible points)
      - `date` (text, date of assignment)
      - `type` (text, type of assignment - exam, quiz, homework, etc.)
      - `weight` (numeric, weight/importance of assignment)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `grades` table
    - Add policies for authenticated users to manage their own grades
    - Users can only access their own grade records

  3. Triggers
    - Add automatic timestamp update trigger
*/

-- Create grades table
CREATE TABLE IF NOT EXISTS public.grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  assignment TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Assignment',
  weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
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

-- Create trigger for automatic timestamp updates on grades table
CREATE TRIGGER update_grades_updated_at
BEFORE UPDATE ON public.grades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();