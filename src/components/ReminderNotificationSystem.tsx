import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Reminder = Tables<'reminders'>;

interface ReminderNotificationSystemProps {
  onActiveReminders: (reminders: Reminder[]) => void;
}

const ReminderNotificationSystem = ({ onActiveReminders }: ReminderNotificationSystemProps) => {
  const { toast } = useToast();
  const [lastChecked, setLastChecked] = useState<string>("");

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check for active reminders immediately
    checkActiveReminders();

    // Set up interval to check every minute
    const interval = setInterval(checkActiveReminders, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkActiveReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDateTime = `${currentDate} ${currentTime}`;

      // Only check if we haven't checked this minute already
      if (lastChecked === currentDateTime) return;
      setLastChecked(currentDateTime);

      const { data: reminders } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('enabled', true)
        .eq('reminder_date', currentDate)
        .lte('reminder_time', currentTime);

      if (reminders && reminders.length > 0) {
        // Filter out reminders we've already shown today
        const newReminders = reminders.filter(reminder => {
          const reminderKey = `${reminder.id}-${currentDate}`;
          const shown = localStorage.getItem(`reminder-shown-${reminderKey}`);
          return !shown;
        });

        if (newReminders.length > 0) {
          // Mark reminders as shown
          newReminders.forEach(reminder => {
            const reminderKey = `${reminder.id}-${currentDate}`;
            localStorage.setItem(`reminder-shown-${reminderKey}`, 'true');
          });

          // Show browser notifications
          if ('Notification' in window && Notification.permission === 'granted') {
            newReminders.forEach(reminder => {
              new Notification(`🔔 ${reminder.title}`, {
                body: reminder.description || `${reminder.type} reminder`,
                icon: '/favicon.ico',
                tag: reminder.id // Prevents duplicate notifications
              });
            });
          }

          // Show toast notifications
          newReminders.forEach(reminder => {
            toast({
              title: `🔔 ${reminder.title}`,
              description: reminder.description || `Time for your ${reminder.type.toLowerCase()} reminder!`,
              duration: 10000,
            });
          });

          // Notify parent component
          onActiveReminders(newReminders);
        }
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  // Clean up old reminder flags (older than 24 hours)
  useEffect(() => {
    const cleanupOldFlags = () => {
      const keys = Object.keys(localStorage);
      const reminderKeys = keys.filter(key => key.startsWith('reminder-shown-'));
      
      reminderKeys.forEach(key => {
        const timestamp = localStorage.getItem(key + '-timestamp');
        if (timestamp) {
          const flagTime = new Date(timestamp);
          const now = new Date();
          const hoursDiff = (now.getTime() - flagTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff > 24) {
            localStorage.removeItem(key);
            localStorage.removeItem(key + '-timestamp');
          }
        }
      });
    };

    // Clean up on mount and then every hour
    cleanupOldFlags();
    const cleanupInterval = setInterval(cleanupOldFlags, 3600000); // 1 hour

    return () => clearInterval(cleanupInterval);
  }, []);

  return null; // This component doesn't render anything
};

export default ReminderNotificationSystem;