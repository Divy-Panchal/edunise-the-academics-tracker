import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target, BookOpen, BarChart3, Calendar, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

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

  // Enhanced Analytics Functions
  const getPerformanceByGradeType = () => {
    const gradeTypeMap = new Map();
    
    subjects.forEach(subject => {
      subject.grades.forEach(grade => {
        const percentage = (grade.score / grade.maxScore) * 100;
        if (!gradeTypeMap.has(grade.type)) {
          gradeTypeMap.set(grade.type, { total: 0, count: 0, scores: [] });
        }
        const current = gradeTypeMap.get(grade.type);
        current.total += percentage;
        current.count += 1;
        current.scores.push(percentage);
      });
    });

    return Array.from(gradeTypeMap.entries()).map(([type, data]) => ({
      name: type,
      average: Math.round(data.total / data.count),
      count: data.count,
      fill: getGradeTypeColor(type)
    })).sort((a, b) => b.average - a.average);
  };

  const getGradeTypeColor = (type: string) => {
    const colors = {
      'Midterm Exam': 'hsl(var(--primary))',
      'Final Exam': 'hsl(var(--destructive))',
      'Assignment': 'hsl(var(--secondary))',
      'Quiz': 'hsl(var(--accent))',
      'Lab Report': 'hsl(142 76% 36%)',
      'Project': 'hsl(263 70% 50%)',
      'Homework': 'hsl(217 91% 60%)',
      'Presentation': 'hsl(150 60% 70%)'
    };
    return colors[type as keyof typeof colors] || 'hsl(var(--muted))';
  };

  const getPerformanceTrend = () => {
    const allGrades = subjects.flatMap(subject => 
      subject.grades.map(grade => ({
        ...grade,
        subject: subject.name,
        percentage: (grade.score / grade.maxScore) * 100,
        date: new Date(grade.date)
      }))
    ).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Group by month for trend analysis
    const monthlyData = new Map();
    allGrades.forEach(grade => {
      const monthKey = `${grade.date.getFullYear()}-${String(grade.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { total: 0, count: 0 });
      }
      const current = monthlyData.get(monthKey);
      current.total += grade.percentage;
      current.count += 1;
    });

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      average: Math.round(data.total / data.count),
      count: data.count
    }));
  };

  const getGradeDistribution = () => {
    const allGrades = subjects.flatMap(subject => 
      subject.grades.map(grade => (grade.score / grade.maxScore) * 100)
    );

    const distribution = {
      'A (90-100%)': allGrades.filter(g => g >= 90).length,
      'B (80-89%)': allGrades.filter(g => g >= 80 && g < 90).length,
      'C (70-79%)': allGrades.filter(g => g >= 70 && g < 80).length,
      'D (60-69%)': allGrades.filter(g => g >= 60 && g < 70).length,
      'F (<60%)': allGrades.filter(g => g < 60).length,
    };

    const colors = ['hsl(142 76% 36%)', 'hsl(217 91% 60%)', 'hsl(263 70% 50%)', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

    return Object.entries(distribution).map(([grade, count], index) => ({
      name: grade,
      value: count,
      fill: colors[index]
    })).filter(item => item.value > 0);
  };

  const generateInsights = () => {
    const performance = getSubjectPerformance();
    const gradeTypePerformance = getPerformanceByGradeType();
    const insights = [];

    // Subject-based insights
    const weakestSubject = performance[0];
    const strongestSubject = performance[performance.length - 1];

    if (weakestSubject && strongestSubject) {
      insights.push({
        type: 'subject',
        title: 'Subject Performance Gap',
        description: `${strongestSubject.name} (${strongestSubject.average.toFixed(1)}%) outperforms ${weakestSubject.name} (${weakestSubject.average.toFixed(1)}%) by ${(strongestSubject.average - weakestSubject.average).toFixed(1)} points.`,
        recommendation: `Focus additional study time on ${weakestSubject.name}. Consider applying successful strategies from ${strongestSubject.name}.`
      });
    }

    // Grade type insights
    if (gradeTypePerformance.length > 1) {
      const weakestType = gradeTypePerformance[gradeTypePerformance.length - 1];
      const strongestType = gradeTypePerformance[0];
      
      insights.push({
        type: 'assessment',
        title: 'Assessment Type Analysis',
        description: `You perform best on ${strongestType.name} (${strongestType.average}%) and struggle most with ${weakestType.name} (${weakestType.average}%).`,
        recommendation: `Practice more ${weakestType.name.toLowerCase()} formats. Consider different preparation strategies for this assessment type.`
      });
    }

    // Trend insights
    const declining = performance.filter(s => s.trend === 'declining');
    if (declining.length > 0) {
      insights.push({
        type: 'trend',
        title: 'Performance Decline Alert',
        description: `${declining.length} subject(s) showing declining performance: ${declining.map(s => s.name).join(', ')}.`,
        recommendation: 'Review recent study habits and consider adjusting your approach for these subjects.'
      });
    }

    return insights;
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
        description: 'These subjects need immediate focus to improve your overall GPA.',
        action: 'Schedule extra study sessions and seek help if needed.'
      });
    }
    
    // Identify declining trends
    const declining = performance.filter(s => s.trend === 'declining');
    if (declining.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Performance Declining',
        subjects: declining.map(s => s.name),
        description: 'These subjects show a declining trend. Consider adjusting your study strategy.',
        action: 'Review recent assignments and identify areas of confusion.'
      });
    }
    
    // Highlight improving subjects
    const improving = performance.filter(s => s.trend === 'improving');
    if (improving.length > 0) {
      recommendations.push({
        type: 'positive',
        title: 'Great Progress',
        subjects: improving.map(s => s.name),
        description: 'Keep up the excellent work in these subjects!',
        action: 'Continue current study methods and consider sharing strategies with other subjects.'
      });
    }
    
    return recommendations;
  };

  const performance = getSubjectPerformance();
  const recommendations = getRecommendations();
  const overallGPA = getOverallGPA();
  const gradeTypeData = getPerformanceByGradeType();
  const trendData = getPerformanceTrend();
  const distributionData = getGradeDistribution();
  const insights = generateInsights();

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold">{overallGPA.toFixed(2)}</div>
              <div className="text-sm opacity-90">Current GPA</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{subjects.length}</div>
              <div className="text-sm opacity-90">Active Subjects</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{subjects.reduce((sum, s) => sum + s.grades.length, 0)}</div>
              <div className="text-sm opacity-90">Total Grades</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{Math.round(subjects.reduce((sum, s) => sum + calculateSubjectAverage(s), 0) / subjects.length)}%</div>
              <div className="text-sm opacity-90">Avg Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                {insight.type === 'subject' && <BookOpen className="w-4 h-4 text-primary" />}
                {insight.type === 'assessment' && <BarChart3 className="w-4 h-4 text-secondary" />}
                {insight.type === 'trend' && <TrendingDown className="w-4 h-4 text-warning" />}
                {insight.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
              <p className="text-sm text-primary font-medium">💡 {insight.recommendation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance by Grade Type */}
      {gradeTypeData.length > 0 && (
        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Performance by Assessment Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeTypeData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-primary">Average: {payload[0].value}%</p>
                            <p className="text-muted-foreground text-sm">
                              {gradeTypeData.find(d => d.name === label)?.count} assessments
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="average" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {gradeTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.average}%</div>
                    <div className="text-xs text-muted-foreground">{item.count} items</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grade Distribution */}
      {distributionData.length > 0 && (
        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Trend */}
      {trendData.length > 1 && (
        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Performance Trend Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-primary">Average: {payload[0].value}%</p>
                            <p className="text-muted-foreground text-sm">
                              {trendData.find(d => d.month === label)?.count} grades
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

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
                      <p className="text-sm text-primary font-medium mb-2">🎯 {rec.action}</p>
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