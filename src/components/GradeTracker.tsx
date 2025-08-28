import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, TrendingUp, TrendingDown, Minus, Trash2 } from 'lucide-react';
import { AddGradeDialog } from './AddGradeDialog';
import { AIPerformanceReport } from './AIPerformanceReport';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface Grade {
  id: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  date: string;
  type: string;
  weight?: number;
}

export interface Subject {
  name: string;
  grades: Grade[];
  average: number;
  trend: 'up' | 'down' | 'stable';
}

export function GradeTracker() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAIReport, setShowAIReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: grades, error } = await supabase
        .from('grades')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Group grades by subject and calculate averages
      const subjectMap = new Map<string, Grade[]>();
      
      grades?.forEach((grade) => {
        if (!subjectMap.has(grade.subject)) {
          subjectMap.set(grade.subject, []);
        }
        subjectMap.get(grade.subject)!.push({
          id: grade.id,
          subject: grade.subject,
          assignment: grade.assignment,
          score: grade.score,
          maxScore: grade.max_score,
          date: grade.date,
          type: grade.type,
          weight: grade.weight
        });
      });

      const processedSubjects: Subject[] = Array.from(subjectMap.entries()).map(([name, grades]) => {
        const average = calculateAverage(grades);
        const trend = calculateTrend(grades);
        
        return {
          name,
          grades,
          average,
          trend
        };
      });

      setSubjects(processedSubjects);
    } catch (error) {
      console.error('Error loading grades:', error);
      toast({
        title: "Error",
        description: "Failed to load grades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (grades: Grade[]): number => {
    if (grades.length === 0) return 0;
    
    const totalWeightedScore = grades.reduce((sum, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
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

  const handleAddGrade = async (gradeData: Omit<Grade, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('grades')
        .insert({
          user_id: user.id,
          subject: gradeData.subject,
          assignment: gradeData.assignment,
          score: gradeData.score,
          max_score: gradeData.maxScore,
          date: gradeData.date,
          type: gradeData.type,
          weight: gradeData.weight
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Grade added successfully",
      });

      loadGrades();
      setIsAddGradeOpen(false);
    } catch (error) {
      console.error('Error adding grade:', error);
      toast({
        title: "Error",
        description: "Failed to add grade",
        variant: "destructive",
      });
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Add a placeholder grade to create the subject
      const { error } = await supabase
        .from('grades')
        .insert({
          user_id: user.id,
          subject: newSubjectName.trim(),
          assignment: 'Initial Entry',
          score: 0,
          max_score: 100,
          date: new Date().toISOString().split('T')[0],
          type: 'Other',
          weight: 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subject added successfully",
      });

      loadGrades();
      setIsAddSubjectOpen(false);
      setNewSubjectName('');
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "Error",
        description: "Failed to add subject",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubject = async (subjectName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('user_id', user.id)
        .eq('subject', subjectName);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subject deleted successfully",
      });

      loadGrades();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: "Failed to delete subject",
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grade Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your academic performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Add New Subject</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Create a new subject to track grades for.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject-name" className="text-right text-gray-900 dark:text-white">
                    Name
                  </Label>
                  <Input
                    id="subject-name"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="col-span-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="e.g., Mathematics"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleAddSubject}
                  disabled={!newSubjectName.trim()}
                  className="h-10"
                >
                  Add Subject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => setIsAddGradeOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowAIReport(true)}
            size="sm"
          >
            AI Report
          </Button>
        </div>
      </div>

      {subjects.length === 0 ? (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No subjects yet</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.name} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {subject.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getTrendIcon(subject.trend)}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-gray-900">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-white">Delete Subject</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                          Are you sure you want to delete "{subject.name}"? This will remove all grades for this subject. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteSubject(subject.name)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {subject.average.toFixed(1)}%
                    </span>
                    <Badge 
                      className={`${getGradeColor(subject.average)} text-white`}
                    >
                      {subject.grades.length} grade{subject.grades.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Recent Grades:</h4>
                    {subject.grades.slice(0, 3).map((grade) => (
                      <div key={grade.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                          {grade.assignment}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {grade.score}/{grade.maxScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddGradeDialog
        isOpen={isAddGradeOpen}
        onClose={() => setIsAddGradeOpen(false)}
        onAddGrade={handleAddGrade}
        subjects={subjects.map(s => s.name)}
      />

      <AIPerformanceReport
        isOpen={showAIReport}
        onClose={() => setShowAIReport(false)}
        subjects={subjects}
      />
    </div>
  );
}