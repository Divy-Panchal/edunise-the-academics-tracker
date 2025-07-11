import { Calendar, Clock, BookOpen, TrendingUp, Plus, Bell, User, Settings, HelpCircle, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    // Check system/localStorage preference for dark mode
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && systemDark));
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="relative animate-fade-up">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Good morning, Alex! 👋</h1>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>
        
        {/* Profile Dropdown */}
        <div className="absolute top-0 right-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full bg-gradient-primary text-white hover:shadow-glow transition-smooth"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white/95 dark:bg-card/95 backdrop-blur-md border border-border shadow-xl z-50 rounded-xl"
            >
              <div className="px-3 py-2 text-sm font-medium text-foreground border-b border-border/50">
                <div className="font-semibold">Alex Johnson</div>
                <div className="text-xs text-muted-foreground">alex@university.edu</div>
              </div>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <Card className="bg-gradient-primary text-white border-0 shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm opacity-90">Tasks Today</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary text-white border-0 shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">3.7</div>
            <div className="text-sm opacity-90">Current GPA</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Cards */}
      <div className="space-y-4">
        {/* Upcoming Deadlines */}
        <Card className="shadow-card bg-white/90 dark:bg-card/50 backdrop-blur-md border border-border/20 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-xl border-l-4 border-red-400 dark:border-red-500">
              <div>
                <div className="font-medium text-sm text-foreground">Math Assignment</div>
                <div className="text-xs text-muted-foreground">Due in 2 hours</div>
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">URGENT</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border-l-4 border-yellow-400 dark:border-yellow-500">
              <div>
                <div className="font-medium text-sm text-foreground">Physics Lab Report</div>
                <div className="text-xs text-muted-foreground">Due tomorrow</div>
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">SOON</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-light/20 dark:bg-primary/20 rounded-xl border-l-4 border-primary">
              <div>
                <div className="font-medium text-sm text-foreground">History Essay</div>
                <div className="text-xs text-muted-foreground">Due in 3 days</div>
              </div>
              <div className="text-xs text-primary font-medium">PENDING</div>
            </div>
          </CardContent>
        </Card>

        {/* Next Class */}
        <Card className="shadow-card bg-white/90 dark:bg-card/50 backdrop-blur-md border border-border/20 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-secondary" />
              Next Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-secondary p-4 rounded-xl text-white shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">Calculus II</div>
                  <div className="text-sm opacity-90">Room: Math Building 201</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">2:30 PM</div>
                  <div className="text-xs opacity-90">in 45 mins</div>
                </div>
              </div>
              <div className="text-xs opacity-80">Prof. Johnson • 90 minutes</div>
            </div>
          </CardContent>
        </Card>

        {/* GPA Preview */}
        <Card className="shadow-card bg-white/90 dark:bg-card/50 backdrop-blur-md border border-border/20 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
              Current GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-accent p-4 rounded-xl shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">3.75</div>
                  <div className="text-sm text-white/80">This Semester</div>
                </div>
                <div className="text-right">
                  <div className="text-green-300 font-medium text-sm">↗ +0.12</div>
                  <div className="text-xs text-white/80">vs last semester</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <Button className="h-12 bg-gradient-primary text-white border-0 shadow-soft transition-smooth hover:shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
        <Button variant="outline" className="h-12 bg-white/90 dark:bg-card/50 border-border/50 transition-smooth hover:bg-white dark:hover:bg-card/70 backdrop-blur-md">
          <Bell className="w-4 h-4 mr-2" />
          Reminders
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;