import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Flame, Target, TrendingUp, Star } from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  category: string;
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
      category: "Study"
    },
    {
      id: "3",
      text: "Submit Project Report",
      completed: false,
      priority: "high",
      category: "Assignment"
    }
  ]);

  const [newTodo, setNewTodo] = useState("");
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalCompleted, setTotalCompleted] = useState(45);

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
        if (newCompleted) {
          setTotalCompleted(prev => prev + 1);
        }
        return { ...todo, completed: newCompleted };
      }
      return todo;
    }));
  };

  const completedToday = todos.filter(todo => todo.completed).length;
  const totalToday = todos.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

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

  return (
    <Card className="h-full shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Motivational Todo
        </CardTitle>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="text-center p-2 rounded-lg bg-gradient-primary text-white">
            <Flame className="w-4 h-4 mx-auto mb-1" />
            <div className="text-lg font-bold">{currentStreak}</div>
            <div className="text-xs opacity-90">Day Streak</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-gradient-secondary text-white">
            <Star className="w-4 h-4 mx-auto mb-1" />
            <div className="text-lg font-bold">{totalCompleted}</div>
            <div className="text-xs opacity-90">Completed</div>
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
      </CardHeader>

      <CardContent className="space-y-3">
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
              className={`flex items-center gap-3 p-3 rounded-lg border transition-smooth ${
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
                </div>
              </div>
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
      </CardContent>
    </Card>
  );
};

export default MotivationalTodo;