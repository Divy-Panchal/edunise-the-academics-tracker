import { useState } from "react";
import { TrendingUp, Award, BookOpen, BarChart3, Brain, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AddGradeDialog } from "./AddGradeDialog";
import { AIPerformanceReport } from "./AIPerformanceReport";
import { useToast } from "@/hooks/use-toast";

interface Grade {
  id: string;
  type: string;
  score: number;
  maxScore: number;
  weight: number;
  date: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: string;
  grades: Grade[];
}

const GradeTracker = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Calculus II",
      code: "MATH 251",
      credits: 4,
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [currentView, setCurrentView] = useState<'overview' | 'ai-report'>('overview');
  const { toast } = useToast();

  const calculateSubjectAverage = (subject: Subject) => {
    if (subject.grades.length === 0) return 0;
    
    const totalWeightedScore = subject.grades.reduce((sum, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      return sum + (percentage * grade.weight);
    }, 0);
    
    const totalWeight = subject.grades.reduce((sum, grade) => sum + grade.weight, 0);
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      const average = calculateSubjectAverage(subject);
      const gradePoints = getGradePoints(average);
      totalPoints += gradePoints * subject.credits;
      totalCredits += subject.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const getGradePoints = (percentage: number) => {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 3.7;
    if (percentage >= 90) return 3.3;
    if (percentage >= 87) return 3.0;
    if (percentage >= 83) return 2.7;
    if (percentage >= 80) return 2.3;
    if (percentage >= 77) return 2.0;
    if (percentage >= 73) return 1.7;
    if (percentage >= 70) return 1.3;
    if (percentage >= 65) return 1.0;
    return 0.0;
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
  const handleDeleteSubject = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    
    if (subject) {
      toast({
        title: "Subject Deleted",
        description: `${subject.name} has been removed successfully.`,
      });
    }
  };
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 65) return "D";
    return "F";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "text-success bg-success/10 border-success/20";
    if (grade.startsWith('B')) return "text-primary bg-primary/10 border-primary/20";
    if (grade.startsWith('C')) return "text-warning bg-warning/10 border-warning/20";
    if (grade.startsWith('D')) return "text-destructive bg-destructive/10 border-destructive/20";
    return "text-destructive bg-destructive/20 border-destructive";
  };

  const handleAddGrade = (subjectId: string, grade: Omit<Grade, 'id'>) => {
    const newGrade = {
      ...grade,
      id: Date.now().toString()
    };

    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? { ...subject, grades: [...subject.grades, newGrade] }
        : subject
    ));
  };

  const handleAddSubject = (newSubject: Omit<Subject, 'id' | 'grades'>) => {
    const subject = {
      ...newSubject,
      id: Date.now().toString(),
      grades: []
    };

    setSubjects(prev => [...prev, subject]);
  };

  const handleDeleteGrade = (subjectId: string, gradeId: string) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? { ...subject, grades: subject.grades.filter(grade => grade.id !== gradeId) }
        : subject
    ));

    toast({
      title: "Grade Deleted",
      description: "Grade has been removed successfully.",
    });
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grade Tracker</h1>
          <p className="text-muted-foreground">Monitor your academic performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-card rounded-lg p-1 border border-border">
            <Button
              variant={currentView === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('overview')}
              className="h-8"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={currentView === 'ai-report' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('ai-report')}
              className="h-8"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Report
            </Button>
          </div>
          <AddGradeDialog 
            subjects={subjects}
            onAddGrade={handleAddGrade}
            onAddSubject={handleAddSubject}
          />
        </div>
      </div>

      {currentView === 'overview' ? (
        <>
          {/* GPA Overview */}
          {subjects.length > 0 ? (
            <Card className="shadow-elegant bg-gradient-primary text-white border-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-6 h-6" />
                      <span className="text-lg font-semibold">Current GPA</span>
                    </div>
                    <div className="text-4xl font-bold">{calculateGPA()}</div>
                    <div className="text-sm opacity-90">
                      {subjects.reduce((sum, s) => sum + s.credits, 0)} credit hours
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-300 font-medium text-lg">↗ Trending Up</div>
                    <div className="text-sm opacity-90">vs last semester</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Quick Stats */}
          {subjects.length > 0 && (
            <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Card className="bg-gradient-secondary text-white border-0 shadow-elegant">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">{subjects.length}</div>
                  <div className="text-xs opacity-90">Subjects</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-accent text-white border-0 shadow-elegant">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">
                    {subjects.filter(s => {
                      const avg = calculateSubjectAverage(s);
                      return avg >= 90;
                    }).length}
                  </div>
                  <div className="text-xs opacity-90">A Grade</div>
                </CardContent>
              </Card>
              <Card className="bg-card/70 backdrop-blur-sm border-border shadow-elegant">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-foreground">
                    {subjects.length > 0 ? (subjects.reduce((sum, s) => sum + calculateSubjectAverage(s), 0) / subjects.length).toFixed(1) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subjects List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground animate-fade-up" style={{ animationDelay: '0.3s' }}>
              Current Courses
            </h2>
            
            {subjects.length === 0 ? (
              <Card className="bg-white/90 dark:bg-gray-900/90 border-border shadow-elegant backdrop-blur-md">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Subjects Added</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first subject to track your grades.</p>
                  <AddGradeDialog 
                    subjects={subjects}
                    onAddGrade={handleAddGrade}
                    onAddSubject={handleAddSubject}
                  />
                </CardContent>
              </Card>
            ) : (
              subjects.map((subject, index) => {
                const average = calculateSubjectAverage(subject);
                const letterGrade = getLetterGrade(average);
                
                return (
                  <Card 
                    key={subject.id} 
                    className="shadow-elegant bg-white/90 dark:bg-gray-900/90 border-border animate-fade-up backdrop-blur-md"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-foreground">{subject.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{subject.code} • {subject.credits} credits • {subject.semester}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <Badge variant="outline" className={getGradeColor(letterGrade)}>
                              {letterGrade}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {average.toFixed(1)}%
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubject(subject.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Current Performance</span>
                          <span className={`font-medium ${
                            average >= 90 ? 'text-success' : 
                            average >= 80 ? 'text-warning' : 
                            'text-destructive'
                          }`}>
                            {average >= 90 ? 'Excellent' : average >= 80 ? 'Good' : 'Needs Improvement'}
                          </span>
                        </div>
                        <Progress 
                          value={average} 
                          className="h-2"
                        />
                      </div>

                      {/* Grades Table */}
                      {subject.grades.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">All Grades</h4>
                          <div className="rounded-lg border border-border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/30">
                                  <TableHead className="text-foreground">Type</TableHead>
                                  <TableHead className="text-foreground">Score</TableHead>
                                  <TableHead className="text-foreground">Weight</TableHead>
                                  <TableHead className="text-foreground">Date</TableHead>
                                  <TableHead className="text-foreground w-16"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subject.grades.map((grade) => (
                                  <TableRow key={grade.id} className="border-border">
                                    <TableCell className="font-medium text-foreground">{grade.type}</TableCell>
                                    <TableCell className="text-foreground">
                                      {grade.score}/{grade.maxScore} ({((grade.score / grade.maxScore) * 100).toFixed(1)}%)
                                    </TableCell>
                                    <TableCell className="text-foreground">{grade.weight}%</TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(grade.date).toLocaleDateString()}</TableCell>