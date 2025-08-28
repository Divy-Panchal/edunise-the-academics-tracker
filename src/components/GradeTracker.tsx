import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, TrendingUp, TrendingDown, Minus, Trash2, GraduationCap, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface Grade {
  id: string;
  subject_id: string;
  subject_name: string;
  assignment: string;
  score: number;
  max_score: number;
  date: string;
  type: string;
  weight: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: string;
  year: number;
  instructor?: string;
  description?: string;
  color?: string;
  grades: Grade[];
  average: number;
  trend: 'up' | 'down' | 'stable';
}

export function GradeTracker() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Add Subject Form State
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    credits: '3',
    semester: '',
    year: new Date().getFullYear().toString(),
    instructor: '',
    description: '',
    color: '#3B82F6'
  });

  // Add Grade Form State
  const [gradeForm, setGradeForm] = useState({
    subject_id: '',
    assignment: '',
    score: '',
    max_score: '100',
    date: new Date().toISOString().split('T')[0],
    type: 'Assignment',
    weight: '1'
  });

  useEffect(() => {
    loadSubjectsAndGrades();
  }, []);

  const loadSubjectsAndGrades = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('semester', { ascending: false });

      if (subjectsError) throw subjectsError;

      // Load grades
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select(`
          *,
          subjects!inner(name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (gradesError) throw gradesError;

      // Process subjects with their grades
      const processedSubjects: Subject[] = (subjectsData || []).map(subject => {
        const subjectGrades = (gradesData || [])
          .filter(grade => grade.subject_id === subject.id)
          .map(grade => ({
            id: grade.id,
            subject_id: grade.subject_id || '',
            subject_name: subject.name,
            assignment: grade.assignment,
            score: grade.score,
            max_score: grade.max_score,
            date: grade.date,
            type: grade.type,
            weight: grade.weight || 1
          }));

        const average = calculateAverage(subjectGrades);
        const trend = calculateTrend(subjectGrades);

        return {
          id: subject.id,
          name: subject.name,
          code: subject.code,
          credits: subject.credits,
          semester: subject.semester,
          year: subject.year,
          instructor: subject.instructor,
          description: subject.description,
          color: subject.color,
          grades: subjectGrades,
          average,
          trend
        };
      });

      setSubjects(processedSubjects);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load subjects and grades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (grades: Grade[]): number => {
    if (grades.length === 0) return 0;
    
    const totalWeightedScore = grades.reduce((sum, grade) => {
      const percentage = (grade.score / grade.max_score) * 100;
      const weight = grade.weight || 1;
      return sum + (percentage * weight);
    }, 0);
    
    const totalWeight = grades.reduce((sum, grade) => sum + (grade.weight || 1), 0);
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const calculateTrend = (grades: Grade[]): 'up' | 'down' | 'stable' => {
    if (grades.length < 2) return 'stable';
    
    const sortedGrades = [...grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recent = sortedGrades.slice(-3);
    const older = sortedGrades.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = calculateAverage(recent);
    const olderAvg = calculateAverage(older);
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 2) return 'up';
    if (difference < -2) return 'down';
    return 'stable';
  };

  const handleAddSubject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!subjectForm.name.trim() || !subjectForm.code.trim() || !subjectForm.semester.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields (Name, Code, Semester).",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('subjects')
        .insert({
          user_id: user.id,
          name: subjectForm.name.trim(),
          code: subjectForm.code.trim(),
          credits: parseInt(subjectForm.credits),
          semester: subjectForm.semester,
          year: parseInt(subjectForm.year),
          instructor: subjectForm.instructor.trim() || null,
          description: subjectForm.description.trim() || null,
          color: subjectForm.color
        });

      if (error) throw error;

      toast({
        title: "Success! 📚",
        description: `${subjectForm.name} has been added successfully.`,
      });

      // Reset form
      setSubjectForm({
        name: '',
        code: '',
        credits: '3',
        semester: '',
        year: new Date().getFullYear().toString(),
        instructor: '',
        description: '',
        color: '#3B82F6'
      });

      setIsAddSubjectOpen(false);
      loadSubjectsAndGrades();
    } catch (error: any) {
      console.error('Error adding subject:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add subject",
        variant: "destructive",
      });
    }
  };

  const handleAddGrade = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!gradeForm.subject_id || !gradeForm.assignment.trim() || !gradeForm.score || !gradeForm.max_score) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('grades')
        .insert({
          user_id: user.id,
          subject_id: gradeForm.subject_id,
          assignment: gradeForm.assignment.trim(),
          score: parseInt(gradeForm.score),
          max_score: parseInt(gradeForm.max_score),
          date: gradeForm.date,
          type: gradeForm.type,
          weight: parseFloat(gradeForm.weight)
        });

      if (error) throw error;

      toast({
        title: "Success! 🎯",
        description: "Grade has been added successfully.",
      });

      // Reset form
      setGradeForm({
        subject_id: '',
        assignment: '',
        score: '',
        max_score: '100',
        date: new Date().toISOString().split('T')[0],
        type: 'Assignment',
        weight: '1'
      });

      setIsAddGradeOpen(false);
      loadSubjectsAndGrades();
    } catch (error: any) {
      console.error('Error adding grade:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add grade",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Subject Deleted",
        description: `${subjectName} has been removed successfully.`,
      });

      loadSubjectsAndGrades();
    } catch (error: any) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete subject",
        variant: "destructive",
      });
    }
  };

  const getGradeColor = (average: number) => {
    if (average >= 90) return 'bg-green-500';
    if (average >= 80) return 'bg-blue-500';
    if (average >= 70) return 'bg-yellow-500';
    if (average >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLetterGrade = (average: number) => {
    if (average >= 97) return 'A+';
    if (average >= 93) return 'A';
    if (average >= 90) return 'A-';
    if (average >= 87) return 'B+';
    if (average >= 83) return 'B';
    if (average >= 80) return 'B-';
    if (average >= 77) return 'C+';
    if (average >= 73) return 'C';
    if (average >= 70) return 'C-';
    if (average >= 67) return 'D+';
    if (average >= 65) return 'D';
    return 'F';
  };

  const semesters = [
    "Fall 2024", "Spring 2024", "Summer 2024",
    "Fall 2025", "Spring 2025", "Summer 2025",
    "Fall 2023", "Spring 2023", "Summer 2023"
  ];

  const gradeTypes = [
    "Assignment", "Quiz", "Midterm Exam", "Final Exam", 
    "Lab Report", "Project", "Presentation", "Homework",
    "Participation", "Attendance", "Other"
  ];

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  if (loading) {
    return (
      <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grade Tracker</h1>
          <p className="text-muted-foreground">Monitor your academic performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Add Subject Dialog */}
          <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-card/50 border-border/50">
                <BookOpen className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Subject</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Create a new subject to track grades for.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="subject-name" className="text-foreground">Subject Name *</Label>
                    <Input
                      id="subject-name"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-background border-border text-foreground"
                      placeholder="e.g., Calculus II"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-code" className="text-foreground">Subject Code *</Label>
                    <Input
                      id="subject-code"
                      value={subjectForm.code}
                      onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
                      className="bg-background border-border text-foreground"
                      placeholder="e.g., MATH 251"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="credits" className="text-foreground">Credits *</Label>
                    <Select value={subjectForm.credits} onValueChange={(value) => setSubjectForm(prev => ({ ...prev, credits: value }))}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="1">1 Credit</SelectItem>
                        <SelectItem value="2">2 Credits</SelectItem>
                        <SelectItem value="3">3 Credits</SelectItem>
                        <SelectItem value="4">4 Credits</SelectItem>
                        <SelectItem value="5">5 Credits</SelectItem>
                        <SelectItem value="6">6 Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-foreground">Semester *</Label>
                    <Select value={subjectForm.semester} onValueChange={(value) => setSubjectForm(prev => ({ ...prev, semester: value }))}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester} className="text-foreground">
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-foreground">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={subjectForm.year}
                      onChange={(e) => setSubjectForm(prev => ({ ...prev, year: e.target.value }))}
                      className="bg-background border-border text-foreground"
                      min="2020"
                      max="2030"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor" className="text-foreground">Instructor</Label>
                  <Input
                    id="instructor"
                    value={subjectForm.instructor}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, instructor: e.target.value }))}
                    className="bg-background border-border text-foreground"
                    placeholder="e.g., Dr. Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={subjectForm.description}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-background border-border text-foreground"
                    placeholder="Optional course description..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Color Theme</Label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSubjectForm(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          subjectForm.color === color ? 'border-foreground scale-110' : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Button onClick={handleAddSubject} className="w-full bg-gradient-primary text-white">
                  Add Subject
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Add Grade Dialog */}
          <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Grade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Grade</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Add a grade for one of your subjects.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grade-subject" className="text-foreground">Subject *</Label>
                  <Select value={gradeForm.subject_id} onValueChange={(value) => setGradeForm(prev => ({ ...prev, subject_id: value }))}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id} className="text-foreground">
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignment" className="text-foreground">Assignment Name *</Label>
                  <Input
                    id="assignment"
                    value={gradeForm.assignment}
                    onChange={(e) => setGradeForm(prev => ({ ...prev, assignment: e.target.value }))}
                    className="bg-background border-border text-foreground"
                    placeholder="e.g., Midterm Exam"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="score" className="text-foreground">Score *</Label>
                    <Input
                      id="score"
                      type="number"
                      value={gradeForm.score}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, score: e.target.value }))}
                      className="bg-background border-border text-foreground"
                      placeholder="85"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-score" className="text-foreground">Max Score *</Label>
                    <Input
                      id="max-score"
                      type="number"
                      value={gradeForm.max_score}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, max_score: e.target.value }))}
                      className="bg-background border-border text-foreground"
                      placeholder="100"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="grade-type" className="text-foreground">Type</Label>
                    <Select value={gradeForm.type} onValueChange={(value) => setGradeForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {gradeTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-foreground">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-foreground">Weight</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={gradeForm.weight}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, weight: e.target.value }))}
                      className="bg-background border-border text-foreground"
                      placeholder="1.0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade-date" className="text-foreground">Date *</Label>
                  <Input
                    id="grade-date"
                    type="date"
                    value={gradeForm.date}
                    onChange={(e) => setGradeForm(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <Button onClick={handleAddGrade} className="w-full bg-gradient-primary text-white">
                  Add Grade
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {subjects.length === 0 ? (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-card animate-fade-up">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No subjects yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding a subject and then add grades to track your performance.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddSubjectOpen(true)} variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
              <Button onClick={() => setIsAddGradeOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Grade
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {subjects.map((subject, index) => (
            <Card key={subject.id} className="bg-card/80 backdrop-blur-sm border-border/50 shadow-card hover:shadow-soft transition-smooth animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {subject.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(subject.trend)}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                          Delete Subject
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Are you sure you want to delete "{subject.name}"? This will remove all grades for this subject. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-background border-border text-foreground">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteSubject(subject.id, subject.name)}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Delete Subject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {subject.average.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {getLetterGrade(subject.average)}
                    </div>
                    <div className="text-sm text-muted-foreground">Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {subject.credits}
                    </div>
                    <div className="text-sm text-muted-foreground">Credits</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Semester</span>
                    <Badge variant="secondary">{subject.semester}</Badge>
                  </div>
                  {subject.instructor && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Instructor</span>
                      <span className="text-sm text-foreground">{subject.instructor}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Grades</span>
                    <Badge className={`${getGradeColor(subject.average)} text-white`}>
                      {subject.grades.length} recorded
                    </Badge>
                  </div>
                </div>
                
                {subject.grades.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Recent Grades:</h4>
                    <div className="space-y-1">
                      {subject.grades.slice(0, 3).map((grade) => (
                        <div key={grade.id} className="flex justify-between items-center text-sm p-2 rounded bg-muted/30">
                          <span className="text-muted-foreground truncate mr-2">
                            {grade.assignment}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {grade.type}
                            </Badge>
                            <span className="font-medium text-foreground">
                              {grade.score}/{grade.max_score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}