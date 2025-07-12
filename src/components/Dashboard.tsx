import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import AddReminderDialog from "./AddReminderDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  User, 
  Settings, 
  HelpCircle, 
  Moon, 
  Sun,
  ChevronDown,
  Bell,
  Plus,
  Target,
  LogOut
} from "lucide-react";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [profile, setProfile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Load user data and reminders
    loadUserData();
    loadReminders();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id)
          .eq('enabled', true)
          .order('created_at', { ascending: false })
          .limit(5);
        setReminders(data || []);
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good morning, {profile?.display_name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>
        
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-sm border border-border/50 shadow-card" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-foreground">{profile?.display_name || 'User'}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  Profile Settings
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 hover:bg-muted/50 transition-smooth">
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={toggleDarkMode}
              className="flex items-center gap-2 hover:bg-muted/50 transition-smooth"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 hover:bg-muted/50 transition-smooth">
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-smooth"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <Card className="bg-gradient-primary text-white border-0 shadow-soft hover:shadow-glow transition-smooth">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{reminders.length}</div>
            <div className="text-sm opacity-90">Active Reminders</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary text-white border-0 shadow-soft hover:shadow-glow transition-smooth">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">3.7</div>
            <div className="text-sm opacity-90">Current GPA</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Cards */}
      <div className="space-y-4">
        {/* Recent Reminders */}
        <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-up hover:shadow-soft transition-smooth" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Recent Reminders
            </CardTitle>
            <AddReminderDialog onReminderAdded={loadReminders} />
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.length > 0 ? (
              reminders.slice(0, 3).map((reminder: any) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{reminder.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {reminder.reminder_time} • {reminder.reminder_date}
                    </p>
                  </div>
                  <Badge className={
                    reminder.type === 'Assignment' ? 'bg-primary/10 text-primary border-primary/20' :
                    reminder.type === 'Exam' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                    reminder.type === 'Study' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                    'bg-accent/10 text-accent-foreground border-accent/20'
                  }>
                    {reminder.type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No reminders yet</p>
                <p className="text-xs">Add your first reminder above</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Class */}
        <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-up hover:shadow-soft transition-smooth" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
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
        <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-up hover:shadow-soft transition-smooth" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
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
        <Button variant="outline" className="h-12 bg-card/50 border-border/50 transition-smooth hover:bg-card/70 backdrop-blur-md">
          <Target className="w-4 h-4 mr-2" />
          Focus Timer
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;