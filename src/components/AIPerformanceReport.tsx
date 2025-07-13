import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

interface AIPerformanceReportProps {
  subjects: Subject[];
}

export const AIPerformanceReport = ({ subjects }: AIPerformanceReportProps) => {
  const calculateSubjectAverage = (subject: Subject) => {
    if (subject.grades.length === 0) return 0;
    
    const totalWeightedScore = subject.grades.reduce((sum, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      return sum + (percentage * grade.weight);
    }, 0);
    
    const totalWeight = subject.grades.reduce((sum, grade) => sum + grade.weight, 0);
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const getSubjectPerformance = () => {
    return subjects.map(subject => ({
      ...subject,
      average: calculateSubjectAverage(subject),
      trend: calculateTrend(subject),
      riskLevel: getRiskLevel(calculateSubjectAverage(subject))
    })).sort((a, b) => a.average - b.average);
  };

  const calculateTrend = (subject: Subject) => {
    if (subject.grades.length < 2) return 'stable';
    
    const sortedGrades = [...subject.grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recentGrades = sortedGrades.slice(-3);
    
    if (recentGrades.length < 2) return 'stable';
    
    const firstAvg = recentGrades[0].score / recentGrades[0].maxScore * 100;
    const lastAvg = recentGrades[recentGrades.length - 1].score / recentGrades[recentGrades.length - 1].maxScore * 100;
    
    const difference = lastAvg - firstAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  };

  const getRiskLevel = (average: number) => {
    if (average >= 90) return 'low';
    if (average >= 80) return 'medium';
    if (average >= 70) return 'high';
    return 'critical';
  };

  const getOverallGPA = () => {
    if (subjects.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    subjects.forEach(subject => {
      const average = calculateSubjectAverage(subject);
      const gradePoints = getGradePoints(average);
      totalPoints += gradePoints * subject.credits;
      totalCredits += subject.credits;
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
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

  const getRecommendations = () => {
    const performance = getSubjectPerformance();
    const recommendations = [];
    
    // Focus on lowest performing subjects
    const poorPerforming = performance.filter(s => s.average < 80);
    if (poorPerforming.length > 0) {
      recommendations.push({
        type: 'urgent',
        title: 'Immediate Attention Required',
        subjects: poorPerforming.slice(0, 2).map(s => s.name),
        description: 'These subjects need immediate focus to improve your overall GPA.'
      });
    }
    
    // Identify declining trends
    const declining = performance.filter(s => s.trend === 'declining');
    if (declining.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Performance Declining',
        subjects: declining.map(s => s.name),
        description: 'These subjects show a declining trend. Consider adjusting your study strategy.'
      });
    }
    
    // Highlight improving subjects
    const improving = performance.filter(s => s.trend === 'improving');
    if (improving.length > 0) {
      recommendations.push({
        type: 'positive',
        title: 'Great Progress',
        subjects: improving.map(s => s.name),
        description: 'Keep up the excellent work in these subjects!'
      });
    }
    
    return recommendations;
  };

  const performance = getSubjectPerformance();
  const recommendations = getRecommendations();
  const overallGPA = getOverallGPA();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Target className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      low: 'bg-success/10 text-success border-success/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      high: 'bg-destructive/10 text-destructive border-destructive/20',
      critical: 'bg-destructive text-destructive-foreground'
    };

    return (
      <Badge variant="outline" className={colors[riskLevel as keyof typeof colors]}>
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </Badge>
    );
  };

  if (subjects.length === 0) {
    return (
      <Card className="bg-card border-border shadow-elegant">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
          <p className="text-muted-foreground">Add some subjects and grades to get your AI performance report.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-white border-0 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold">{overallGPA.toFixed(2)}</div>
              <div className="text-sm opacity-90">Current GPA</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{subjects.length}</div>
              <div className="text-sm opacity-90">Active Subjects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          AI Recommendations
        </h3>
        
        {recommendations.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground">No specific recommendations at this time. Keep up the good work!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <Card key={index} className="bg-card border-border shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      rec.type === 'urgent' ? 'bg-destructive/10' :
                      rec.type === 'warning' ? 'bg-warning/10' :
                      'bg-success/10'
                    }`}>
                      {rec.type === 'urgent' ? (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      ) : rec.type === 'warning' ? (
                        <TrendingDown className="w-4 h-4 text-warning" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Subject Performance Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Subject Performance Analysis
        </h3>
        
        <div className="space-y-3">
          {performance.map((subject) => (
            <Card key={subject.id} className="bg-card border-border shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{subject.name}</h4>
                    <p className="text-sm text-muted-foreground">{subject.code} • {subject.credits} credits</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(subject.trend)}
                    {getRiskBadge(subject.riskLevel)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Average</span>
                    <span className="font-semibold text-foreground">{subject.average.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={subject.average} 
                    className={`h-2 ${
                      subject.average >= 90 ? 'text-success' :
                      subject.average >= 80 ? 'text-warning' :
                      'text-destructive'
                    }`}
                  />
                  <div className="text-xs text-muted-foreground">
                    {subject.grades.length} grade{subject.grades.length !== 1 ? 's' : ''} recorded
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};