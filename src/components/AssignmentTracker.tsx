import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  progress: number;
  description?: string;
}

const AssignmentTracker = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Database Design Project",
      subject: "DBMS",
      dueDate: "2024-01-25",
      dueTime: "23:59",
      priority: "high",
      status: "in-progress",
      progress: 60,
      description: "Complete the database schema design for the e-commerce project"
    },
    {
      id: "2",
      title: "Algorithm Analysis Report",
      subject: "Data Structures",
      dueDate: "2024-01-28",
      dueTime: "15:30",
      priority: "medium",
      status: "pending",
      progress: 0,
      description: "Analyze time complexity of sorting algorithms"
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    dueDate: "",
    dueTime: "",
    priority: "medium" as "high" | "medium" | "low",
    description: ""
  });

  const addAssignment = () => {
    if (formData.title.trim() && formData.subject.trim() && formData.dueDate && formData.dueTime) {
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        title: formData.title,
        subject: formData.subject,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        priority: formData.priority,
        status: "pending",
        progress: 0,
        description: formData.description
      };
      
      setAssignments([...assignments, newAssignment]);
      
      // Reset form
      setFormData({
        title: "",
        subject: "",
        dueDate: "",
        dueTime: "",
        priority: "medium",
        description: ""
      });
      
      setShowAddDialog(false);
      
      toast({
        title: "Assignment Added! 📚",
        description: `${newAssignment.title} has been added to your assignments.`,
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const deleteAssignment = (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    setAssignments(assignments.filter(assignment => assignment.id !== id));
    
    if (assignment) {
      toast({
        title: "Assignment Removed",
        description: `${assignment.title} has been deleted.`,
      });
    }
  };

  const updateProgress = (id: string, newProgress: number) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id 
        ? { ...assignment, progress: newProgress, status: newProgress === 100 ? "completed" : "in-progress" }
        : assignment
    ));
  };

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
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Assignment</DialogTitle>
                <DialogDescription>
                  Create a new assignment with due date and priority.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter assignment title..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Enter subject name..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueTime">Due Time *</Label>
                    <Input
                      id="dueTime"
                      type="time"
                      value={formData.dueTime}
                      onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value: "high" | "medium" | "low") => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description..."
                  />
                </div>

                <Button onClick={addAssignment} className="w-full">
                  Add Assignment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.map((assignment) => {
          const daysLeft = getDaysLeft(assignment.dueDate);
          return (
            <div
              key={assignment.id}
              className="group p-4 rounded-xl bg-card border border-border hover:shadow-card transition-smooth"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate mb-1">{assignment.title}</h4>
                  <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                  {assignment.description && (
                    <p className="text-xs text-muted-foreground mt-1 opacity-75">{assignment.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(assignment.status)}
                  <Badge className={`text-xs ${getPriorityStyle(assignment.priority)}`}>
                    {assignment.priority}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAssignment(assignment.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Due {daysLeft === 0 ? 'today' : daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`} at {assignment.dueTime}
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
                  <div className="flex gap-1 mt-2">
                    {[25, 50, 75, 100].map(progress => (
                      <Button
                        key={progress}
                        variant="outline"
                        size="sm"
                        onClick={() => updateProgress(assignment.id, progress)}
                        className="text-xs h-6 px-2"
                      >
                        {progress}%
                      </Button>
                    ))}
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