import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, Plus, Trash2, Bell } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  hasReminder: boolean;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  description: string;
}

interface DailyPlannerProps {
  assignments?: Assignment[];
}

export default function DailyPlanner({ assignments = [] }: DailyPlannerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    time: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    hasReminder: false
  });
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('dailyTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Combine tasks and assignments for display
  const allItems = [
    ...tasks.map(task => ({ ...task, type: 'task' as const })),
    ...assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      time: assignment.dueTime,
      priority: assignment.priority,
      completed: assignment.progress === 100,
      hasReminder: false,
      type: 'assignment' as const,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      progress: assignment.progress
    }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      time: newTask.time,
      priority: newTask.priority,
      completed: false,
      hasReminder: newTask.hasReminder
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      time: '',
      priority: 'medium',
      hasReminder: false
    });
    setIsOpen(false);

    toast({
      title: "Task Added",
      description: `"${task.title}" has been added to your schedule`,
    });

    // Set reminder notification if enabled
    if (newTask.hasReminder) {
      scheduleNotification(task);
    }
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    
    if (taskToDelete) {
      toast({
        title: "Task Deleted",
        description: `"${taskToDelete.title}" has been removed from your schedule`,
      });
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const scheduleNotification = (task: Task) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        // For demo purposes, show notification after 3 seconds
        setTimeout(() => {
          new Notification(`Reminder: ${task.title}`, {
            body: `Scheduled for ${task.time}`,
            icon: '/favicon.ico'
          });
        }, 3000);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            scheduleNotification(task);
          }
        });
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <Card className="w-full animate-fade-in bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Schedule
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 text-white border-0 shadow-soft">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-foreground">Task Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  className="bg-white dark:bg-gray-800 border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-foreground">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className="bg-white dark:bg-gray-800 border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="priority" className="text-foreground">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-border">
                    <SelectItem value="high" className="text-foreground">High</SelectItem>
                    <SelectItem value="medium" className="text-foreground">Medium</SelectItem>
                    <SelectItem value="low" className="text-foreground">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                  className="bg-white dark:bg-gray-800 border-border text-foreground"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={newTask.hasReminder}
                  onChange={(e) => setNewTask({ ...newTask, hasReminder: e.target.checked })}
                  className="rounded border-border bg-white dark:bg-gray-800"
                />
                <Label htmlFor="reminder" className="text-sm text-foreground">Set reminder notification</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={addTask} className="flex-1 bg-gradient-primary hover:opacity-90 text-white">
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 border-border text-foreground">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {allItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p>No tasks scheduled for today</p>
            <p className="text-sm">Add a task to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md animate-slide-in ${
                  item.completed ? 'bg-muted/50 opacity-75' : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => item.type === 'task' && toggleTaskCompletion(item.id)}
                      className="mt-1 rounded border-border bg-white dark:bg-gray-800"
                      disabled={item.type === 'assignment'}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {item.title}
                        </h4>
                        <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                        {item.type === 'assignment' && (
                          <Badge variant="outline" className="text-xs">
                            Assignment
                          </Badge>
                        )}
                        {item.hasReminder && (
                          <Bell className="h-3 w-3 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </div>
                        {item.type === 'assignment' && 'subject' in item && (
                          <span className="text-primary font-medium">{item.subject}</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                      {item.type === 'assignment' && 'progress' in item && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {item.type === 'task' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}