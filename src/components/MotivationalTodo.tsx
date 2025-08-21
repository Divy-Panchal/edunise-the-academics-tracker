import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Flame, Target, TrendingUp, Star, Trash2, Calendar, Clock } from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  category: string;
  completedDate?: string;
}

interface StudyStreak {
  date: string;
  subject: string;
  duration: number; // in minutes
  completed: boolean;
}

const MotivationalTodo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: "1",
      text: "Complete Algorithm Practice",
      completed: false,
      priority: "high",
      category: "Study"
    },
    {
      id: "2",
      text: "Review DBMS Notes",
      completed: true,
      priority: "medium",
      category: "Study",
      completedDate: "2024-01-20"
    },
    {
      id: "3",
      text: "Submit Project Report",
      completed: false,
      priority: "high",
      category: "Assignment"
    }
  ]);

  const [studyStreaks, setStudyStreaks] = useState<StudyStreak[]>([
    { date: "2024-01-20", subject: "Mathematics", duration: 120, completed: true },
    { date: "2024-01-19", subject: "Physics", duration: 90, completed: true },
    { date: "2024-01-18", subject: "Chemistry", duration: 150, completed: true },
    { date: "2024-01-17", subject: "Mathematics", duration: 105, completed: true },
    { date: "2024-01-16", subject: "Computer Science", duration: 180, completed: true },
    { date: "2024-01-15", subject: "Physics", duration: 75, completed: true },
    { date: "2024-01-14", subject: "Mathematics", duration: 135, completed: true }
  ]);

  const [newTodo, setNewTodo] = useState("");
  const [showStreaks, setShowStreaks] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        priority: "medium",
        category: "Personal"
      }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const newCompleted = !todo.completed;
        return { 
          ...todo, 
          completed: newCompleted,
          completedDate: newCompleted ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getCurrentStreak = () => {
    const sortedStreaks = [...studyStreaks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedStreaks.length; i++) {
      const streakDate = new Date(sortedStreaks[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (streakDate.toDateString() === expectedDate.toDateString() && sortedStreaks[i].completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getTotalStudyTime = () => {
    return studyStreaks.reduce((total, streak) => total + streak.duration, 0);
  };

  const completedToday = todos.filter(todo => todo.completed).length;
  const totalToday = todos.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;
  const currentStreak = getCurrentStreak();
  const totalStudyHours = Math.floor(getTotalStudyTime() / 60);

  const getPriorityColor = (priority: string) => {
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card className="h-full shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Motivational Todo
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStreaks(!showStreaks)}
            className="text-xs"
          >
            {showStreaks ? "Tasks" : "Streaks"}
          </Button>
        </div>
        
        {!showStreaks && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center p-2 rounded-lg bg-gradient-primary text-white">
                <Flame className="w-4 h-4 mx-auto mb-1" />
                <div className="text-lg font-bold">{currentStreak}</div>
                <div className="text-xs opacity-90">Day Streak</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-gradient-secondary text-white">
                <Star className="w-4 h-4 mx-auto mb-1" />
                <div className="text-lg font-bold">{totalStudyHours}</div>
                <div className="text-xs opacity-90">Study Hours</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-gradient-accent text-white">
                <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                <div className="text-lg font-bold">{Math.round(progressPercentage)}%</div>
                <div className="text-xs opacity-90">Today</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Daily Progress</span>
                <span className="text-xs font-medium">{completedToday}/{totalToday}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {!showStreaks ? (
          <>
            {/* Add New Todo */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a new goal..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                className="flex-1"
              />
              <Button onClick={addTodo} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Todo List */}
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group flex items-center gap-3 p-3 rounded-lg border transition-smooth ${
                    todo.completed
                      ? "bg-muted/50 opacity-75"
                      : "bg-card hover:shadow-card"
                  }`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="data-[state=checked]:bg-gradient-primary"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {todo.category}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </Badge>
                      {todo.completedDate && (
                        <span className="text-xs text-muted-foreground">
                          ✓ {new Date(todo.completedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {todos.length === 0 && (
              <div className="text-center py-6">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No goals yet</p>
                <p className="text-xs text-muted-foreground">Add your first goal to get started!</p>
              </div>
            )}
          </>
        ) : (
          /* Study Streaks View */
          <div className="space-y-3">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-primary mb-1">{currentStreak} Days</div>
              <div className="text-sm text-muted-foreground">Current Study Streak</div>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {studyStreaks.map((streak, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${streak.completed ? 'bg-success' : 'bg-muted'}`} />
                    <div>
                      <div className="text-sm font-medium">{streak.subject}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(streak.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(streak.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MotivationalTodo;