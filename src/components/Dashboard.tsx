import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddReminderDialog from "./AddReminderDialog";
import { useToast } from "@/hooks/use-toast";
import DailyPlanner from "./DailyPlanner";
import AssignmentTracker from "./AssignmentTracker";
import ResourceLocker from "./ResourceLocker";
import MotivationalTodo from "./MotivationalTodo";
import QuickStats from "./QuickStats";
import FlashcardQuiz from "./FlashcardQuiz";
import CommunityChat from "./CommunityChat";
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
    <div className="min-h-screen bg-gradient-bg p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Good morning, {profile?.display_name || 'Student'}! 👋</h1>
          <p className="text-muted-foreground">Ready to make today productive?</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            className="rounded-full shadow-soft"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Add Reminder Button */}
          <AddReminderDialog onReminderAdded={loadReminders} />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-full shadow-soft">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile?.avatar_url || ""} alt="Profile" />
                  <AvatarFallback className="bg-gradient-primary text-white text-lg">
                    {profile?.display_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 shadow-card" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-3">
                <p className="text-sm font-medium leading-none">
                  {profile?.display_name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentDate}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Daily Planner */}
        <div className="xl:col-span-1">
          <DailyPlanner />
        </div>

        {/* Assignment Tracker */}
        <div className="xl:col-span-1">
          <AssignmentTracker />
        </div>

        {/* Motivational Todo */}
        <div className="xl:col-span-1">
          <MotivationalTodo />
        </div>

        {/* Resource Locker */}
        <div className="xl:col-span-1">
          <ResourceLocker />
        </div>

        {/* Flashcard Quiz */}
        <div className="xl:col-span-1">
          <FlashcardQuiz />
        </div>

        {/* Community Chat */}
        <div className="xl:col-span-1">
          <CommunityChat />
        </div>
      </div>

      {/* Recent Reminders */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Recent Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No reminders yet</p>
              <p className="text-sm text-muted-foreground">Add your first reminder to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.slice(0, 3).map((reminder: any) => (
                <div key={reminder.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:shadow-card transition-smooth">
                  <div>
                    <h4 className="font-medium">{reminder.title}</h4>
                    <p className="text-sm text-muted-foreground">{reminder.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{reminder.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {reminder.reminder_date} at {reminder.reminder_time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;