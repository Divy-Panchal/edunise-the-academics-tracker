import { useState } from "react";
import { TrendingUp, Plus, Award, BookOpen, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const GradeTracker = () => {
  const [subjects] = useState([
    {
      id: 1,
      name: "Calculus II",
      code: "MATH 251",
      credits: 4,
      grades: [
        { type: "Midterm 1", score: 85, maxScore: 100, weight: 20 },
        { type: "Assignment 1", score: 92, maxScore: 100, weight: 10 },
        { type: "Assignment 2", score: 88, maxScore: 100, weight: 10 },
        { type: "Quiz 1", score: 95, maxScore: 100, weight: 5 }
      ],
      currentGrade: 87.5,
      targetGrade: 90
    },
    {
      id: 2,
      name: "Physics I",
      code: "PHYS 201",
      credits: 3,
      grades: [
        { type: "Lab Report 1", score: 90, maxScore: 100, weight: 15 },
        { type: "Midterm", score: 82, maxScore: 100, weight: 25 },
        { type: "Quiz 1", score: 88, maxScore: 100, weight: 10 }
      ],
      currentGrade: 84.2,
      targetGrade: 85
    },
    {
      id: 3,
      name: "World History",
      code: "HIST 101",
      credits: 3,
      grades: [
        { type: "Essay 1", score: 91, maxScore: 100, weight: 30 },
        { type: "Midterm", score: 89, maxScore: 100, weight: 25 }
      ],
      currentGrade: 90.2,
      targetGrade: 88
    }
  ]);

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      const gradePoints = getGradePoints(subject.currentGrade);
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
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 65) return "D";
    return "F";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "text-green-600 bg-green-50 border-green-200";
    if (grade.startsWith('B')) return "text-blue-600 bg-blue-50 border-blue-200";
    if (grade.startsWith('C')) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (grade.startsWith('D')) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getProgressColor = (current: number, target: number) => {
    if (current >= target) return "bg-green-500";
    if (current >= target - 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grade Tracker</h1>
          <p className="text-muted-foreground">Monitor your academic performance</p>
        </div>
        <Button className="bg-gradient-primary text-white border-0 shadow-soft">
          <Plus className="w-4 h-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {/* GPA Overview */}
      <Card className="shadow-card bg-gradient-primary text-white border-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <Card className="bg-gradient-secondary text-white border-0 shadow-soft">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">{subjects.length}</div>
            <div className="text-xs opacity-90">Subjects</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-accent text-white border-0 shadow-soft">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">
              {subjects.filter(s => s.currentGrade >= s.targetGrade).length}
            </div>
            <div className="text-xs opacity-90">On Target</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-soft">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-foreground">
              {(subjects.reduce((sum, s) => sum + s.currentGrade, 0) / subjects.length).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground animate-fade-up" style={{ animationDelay: '0.3s' }}>
          Current Courses
        </h2>
        
        {subjects.map((subject, index) => (
          <Card 
            key={subject.id} 
            className="shadow-card bg-white/70 backdrop-blur-sm border-0 animate-fade-up"
            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{subject.code} • {subject.credits} credits</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={getGradeColor(getLetterGrade(subject.currentGrade))}>
                    {getLetterGrade(subject.currentGrade)}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    {subject.currentGrade.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress to Target */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress to Target ({subject.targetGrade}%)</span>
                  <span className={`font-medium ${
                    subject.currentGrade >= subject.targetGrade 
                      ? 'text-green-600' 
                      : 'text-orange-600'
                  }`}>
                    {subject.currentGrade >= subject.targetGrade ? 'On track' : 'Needs improvement'}
                  </span>
                </div>
                <Progress 
                  value={(subject.currentGrade / subject.targetGrade) * 100} 
                  className="h-2"
                />
              </div>

              {/* Recent Grades */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Recent Grades</h4>
                <div className="space-y-2">
                  {subject.grades.slice(-3).map((grade, gradeIndex) => (
                    <div key={gradeIndex} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">{grade.type}</div>
                        <div className="text-xs text-muted-foreground">{grade.weight}% weight</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {grade.score}/{grade.maxScore}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="shadow-card bg-white/70 backdrop-blur-sm border-0 animate-fade-up" style={{ animationDelay: '0.7s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeTracker;