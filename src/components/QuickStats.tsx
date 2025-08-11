import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar, CheckCircle, Clock, Target, BookOpen } from "lucide-react";

const QuickStats = () => {
  const stats = [
    {
      title: "Current GPA",
      value: "3.8",
      icon: TrendingUp,
      gradient: "bg-gradient-primary",
      change: "+0.2"
    },
    {
      title: "This Week",
      value: "12",
      subtitle: "Tasks Done",
      icon: CheckCircle,
      gradient: "bg-gradient-secondary",
      change: "+3"
    },
    {
      title: "Study Time",
      value: "4.5h",
      subtitle: "Today",
      icon: Clock,
      gradient: "bg-gradient-accent",
      change: "+1.2h"
    },
    {
      title: "Streak",
      value: "7",
      subtitle: "Days",
      icon: Target,
      gradient: "bg-gradient-primary",
      change: "+1"
    },
    {
      title: "Subjects",
      value: "6",
      subtitle: "Active",
      icon: BookOpen,
      gradient: "bg-gradient-secondary",
      change: "+1"
    },
    {
      title: "Due Soon",
      value: "3",
      subtitle: "Assignments",
      icon: Calendar,
      gradient: "bg-gradient-accent",
      change: "-2"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-card hover:shadow-soft transition-smooth">
            <CardContent className="p-4 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.gradient} text-white animate-pulse-glow`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-medium ${
                  stat.change.startsWith('+') ? 'text-success' : 'text-destructive'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground animate-bounce-gentle">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.title}</div>
                {stat.subtitle && (
                  <div className="text-xs text-muted-foreground opacity-75">{stat.subtitle}</div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;