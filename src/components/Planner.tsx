import { useState } from "react";
import { Calendar, Plus, Filter, Clock, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const tasks = [
    {
      id: 1,
      title: "Math Assignment - Chapter 12",
      time: "2:00 PM",
      type: "Assignment",
      priority: "High",
      subject: "Mathematics",
      completed: false
    },
    {
      id: 2,
      title: "Physics Lab Report",
      time: "4:30 PM",
      type: "Lab",
      priority: "Medium",
      subject: "Physics",
      completed: false
    },
    {
      id: 3,
      title: "Study Group - History",
      time: "6:00 PM",
      type: "Study",
      priority: "Low",
      subject: "History",
      completed: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
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
      const isToday = day === today.getDate();
      const hasTask = [15, 18, 22, 25].includes(day); // Mock task indicators
      
      days.push(
        <div
          key={day}
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
        <Button className="bg-gradient-primary text-white border-0 shadow-soft">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm">
          <TabsTrigger value="daily" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Daily View
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Monthly View
          </TabsTrigger>
        </TabsList>

        {/* Daily View */}
        <TabsContent value="daily" className="space-y-4">
          <Card className="shadow-card bg-white/70 backdrop-blur-sm border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Tasks
                <Badge variant="secondary" className="ml-auto">
                  {tasks.filter(t => !t.completed).length} pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-smooth ${
                    task.completed 
                      ? 'bg-muted/30 opacity-60 border-muted' 
                      : 'bg-white border-border/50 hover:shadow-soft'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                      <Badge className={getTypeColor(task.type)}>
                        {task.type}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        <Flag className="w-3 h-3 mr-1" />
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.length === 0 && (
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
          <Card className="shadow-card bg-white/70 backdrop-blur-sm border-0">
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
    </div>
  );
};

export default Planner;