import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  progress: number;
}

const AssignmentTracker = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Database Design Project",
      subject: "DBMS",
      dueDate: "2024-01-25",
      priority: "high",
      status: "in-progress",
      progress: 60
    },
    {
      id: "2",
      title: "Algorithm Analysis Report",
      subject: "Data Structures",
      dueDate: "2024-01-28",
      priority: "medium",
      status: "pending",
      progress: 0
    },
    {
      id: "3",
      title: "Web Development Portfolio",
      subject: "Web Tech",
      dueDate: "2024-02-02",
      priority: "low",
      status: "in-progress",
      progress: 30
    }
  ]);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-primary" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
  };

  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="h-full shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Assignments</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.map((assignment) => {
          const daysLeft = getDaysLeft(assignment.dueDate);
          return (
            <div
              key={assignment.id}
              className="p-4 rounded-xl bg-card border border-border hover:shadow-card transition-smooth"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate mb-1">{assignment.title}</h4>
                  <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(assignment.status)}
                  <Badge className={`text-xs ${getPriorityStyle(assignment.priority)}`}>
                    {assignment.priority}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Due in {daysLeft} days
                </span>
              </div>

              {assignment.status === "in-progress" && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-medium">{assignment.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${assignment.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AssignmentTracker;