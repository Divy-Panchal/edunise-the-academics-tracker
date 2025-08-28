import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthScreen from "./AuthScreen";
import Dashboard from "./Dashboard";
import Planner from "./Planner";
import Focus from "./Focus";
import { GradeTracker } from "./GradeTracker";
import BottomNavigation from "./BottomNavigation";
import ReminderNotificationSystem from "./ReminderNotificationSystem";
import { User, Session } from '@supabase/supabase-js';
import { Tables } from "@/integrations/supabase/types";

type Reminder = Tables<'reminders'>;

const EduNiseApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // Auth state will be updated by the listener
  };

  const handleActiveReminders = (reminders: Reminder[]) => {
    setActiveReminders(reminders);
  };
  const renderActiveScreen = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "planner":
        return <Planner />;
      case "resources":
        return <ResourcesPage />;
      case "grades":
        return <GradeTracker />;
      case "focus":
        return <Focus />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-soft animate-pulse-glow">
            <GraduationCap className="w-8 h-8 text-white animate-bounce-gentle" />
          </div>
          <div className="space-y-2">
            <div className="w-32 h-2 bg-primary/20 rounded-full mx-auto animate-pulse"></div>
            <div className="w-24 h-2 bg-primary/10 rounded-full mx-auto animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-muted-foreground animate-fade-up">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <ReminderNotificationSystem onActiveReminders={handleActiveReminders} />
      {renderActiveScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

import { GraduationCap } from "lucide-react";
import ResourcesPage from "./ResourcesPage";

export default EduNiseApp;