import { useState } from "react";
import { Calendar, Plus, Filter, Clock, Flag, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddReminderDialog from "./AddReminderDialog";
import { format, isSameDay } from "date-fns";

interface Task {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: string;
  priority: string;
  subject: string;
  completed: boolean;
}

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Math Assignment - Chapter 12",
      date: new Date(),
      time: "14:00",
      type: "Assignment",
      priority: "High",
      subject: "Mathematics",
      completed: false
    },
    {
      id: "2",
      title: "Physics Lab Report",
      date: new Date(),
      time: "16:30",
      type: "Lab",
      priority: "Medium",
      subject: "Physics",
      completed: false
    },
    {
      id: "3",
      title: "Study Group - History",
      date: new Date(),
      time: "18:00",
      type: "Study",
      priority: "Low",
      subject: "History",
      completed: true
    }
  ]);

  const addTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks([...tasks, task]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDateClick = (date: Date) => {
    const tasksForDate = tasks.filter(task => isSameDay(task.date, date));
    setSelectedDateTasks(tasksForDate);
    setSelectedDate(date);
    setShowDateDialog(true);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.date, date));
  };

  const getTodayTasks = () => {
    return tasks.filter(task => isSameDay(task.date, new Date()));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700";
      case "Medium": return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700";
      case "Low": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700";
      default: return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Assignment": return "bg-primary/10 text-primary";
      case "Exam": return "bg-red-100 text-red-600";
      case "Lab": return "bg-secondary/10 text-secondary";
      case "Study": return "bg-accent/10 text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Simple calendar grid for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const dayTasks = getTasksForDate(currentDate);
      const hasTask = dayTasks.length > 0;
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(currentDate)}
          className={`h-10 flex items-center justify-center rounded-lg cursor-pointer transition-smooth relative ${
            isToday 
              ? 'bg-gradient-primary text-white shadow-soft' 
              : 'hover:bg-muted/50'
          }`}
        >
          <span className="text-sm font-medium">{day}</span>
          {hasTask && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planner</h1>
          <p className="text-muted-foreground">Organize your academic life</p>
        </div>
        <AddReminderDialog onAddTask={addTask} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <TabsList className="grid w-full grid-cols-2 bg-white/90 dark:bg-card/50 backdrop-blur-md border border-border/50">
          <TabsTrigger value="daily" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Daily View
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Monthly View
          </TabsTrigger>
        </TabsList>

        {/* Daily View */}
        <TabsContent value="daily" className="space-y-4">
          <Card className="shadow-card bg-white/90 dark:bg-card/50 backdrop-blur-md border border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Tasks
                <Badge variant="secondary" className="ml-auto">
                  {getTodayTasks().filter(t => !t.completed).length} pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTodayTasks().map((task) => (
                <div
                  key={task.id}
                  className={`group p-4 rounded-xl border transition-smooth ${
                    task.completed 
                      ? 'bg-muted/30 opacity-60 border-muted' 
                      : 'bg-white/80 dark:bg-card/30 border-border/50 hover:shadow-soft'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskComplete(task.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {task.time}
                        <span>•</span>
                        <span>{task.subject}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(task.type)}>
                          {task.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-smooth"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        <Flag className="w-3 h-3 mr-1" />
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {getTodayTasks().length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No tasks for today</p>
                  <p className="text-sm text-muted-foreground">Add a task to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="monthly" className="space-y-4">
          <Card className="shadow-card bg-white/90 dark:bg-card/50 backdrop-blur-md border border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays()}
              </div>
              
              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span>Has tasks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Date Tasks Dialog */}
      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Tasks for {format(selectedDate, "MMMM d, yyyy")}
            </DialogTitle>
            <DialogDescription>
              {selectedDateTasks.length === 0 
                ? "No tasks scheduled for this date." 
                : `${selectedDateTasks.length} task(s) scheduled`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedDateTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border ${
                  task.completed 
                    ? 'bg-muted/30 opacity-60 border-muted' 
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {task.time}
                      <span>•</span>
                      <span>{task.subject}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                     <Badge className={getTypeColor(task.type)}>
                       {task.type}
                     </Badge>
                     <Badge variant="outline" className={getPriorityColor(task.priority)}>
                       {task.priority}
                     </Badge>
                  </div>
                </div>
              </div>
            ))}
            {selectedDateTasks.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No tasks for this date</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planner;