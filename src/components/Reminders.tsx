import { useState } from "react";
import { Bell, Plus, Clock, Calendar, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Reminders = () => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Math Assignment Due",
      description: "Complete Chapter 12 exercises",
      time: "2:00 PM",
      date: "Today",
      enabled: true,
      type: "Assignment",
      recurring: false
    },
    {
      id: 2,
      title: "Study for Physics Exam",
      description: "Review thermodynamics and waves",
      time: "7:00 PM",
      date: "Tomorrow",
      enabled: true,
      type: "Study",
      recurring: false
    },
    {
      id: 3,
      title: "Weekly Review",
      description: "Review notes and plan next week",
      time: "6:00 PM",
      date: "Every Sunday",
      enabled: false,
      type: "Personal",
      recurring: true
    }
  ]);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    ));
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder deleted",
      description: "The reminder has been successfully removed.",
    });
  };

  const editReminder = (id: number) => {
    toast({
      title: "Edit reminder",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const addQuickReminder = (type: string) => {
    const newReminder = {
      id: Date.now(),
      title: type === "study" ? "Study Session" : "Assignment Due",
      description: type === "study" ? "Scheduled study time" : "Important assignment deadline",
      time: "9:00 AM",
      date: "Tomorrow",
      enabled: true,
      type: type === "study" ? "Study" : "Assignment",
      recurring: false
    };
    
    setReminders([...reminders, newReminder]);
    toast({
      title: "Reminder added",
      description: `${newReminder.title} has been added to your reminders.`,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Assignment": return "bg-primary/10 text-primary";
      case "Exam": return "bg-red-100 text-red-600";
      case "Study": return "bg-secondary/10 text-secondary";
      case "Personal": return "bg-accent/10 text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground">Never miss important deadlines</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 shadow-soft">
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <Card className="bg-gradient-primary text-white border-0 shadow-soft hover:shadow-glow transition-smooth">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">{reminders.filter(r => r.enabled).length}</div>
            <div className="text-xs opacity-90">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary text-white border-0 shadow-soft hover:shadow-glow transition-smooth">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">{reminders.filter(r => r.date === "Today").length}</div>
            <div className="text-xs opacity-90">Today</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-accent text-white border-0 shadow-soft hover:shadow-glow transition-smooth">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">{reminders.filter(r => r.recurring).length}</div>
            <div className="text-xs opacity-90">Recurring</div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground animate-fade-up" style={{ animationDelay: '0.2s' }}>
          All Reminders
        </h2>
        
        {reminders.map((reminder, index) => (
          <Card 
            key={reminder.id} 
            className={`shadow-card bg-card/80 backdrop-blur-sm border border-border/50 transition-smooth animate-fade-up hover:shadow-soft ${
              reminder.enabled ? 'opacity-100' : 'opacity-60'
            }`}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${reminder.enabled ? 'bg-primary/10' : 'bg-muted/30'}`}>
                      <Bell className={`w-4 h-4 ${reminder.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${reminder.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{reminder.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-11">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {reminder.time}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {reminder.date}
                    </div>
                    <Badge className={getTypeColor(reminder.type)}>
                      {reminder.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editReminder(reminder.id)}
                    className="h-8 w-8 p-0 hover:bg-muted transition-smooth"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReminder(reminder.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-smooth"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reminders.length === 0 && (
          <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">No reminders yet</h3>
              <p className="text-muted-foreground mb-4">Create your first reminder to get started</p>
              <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Create Reminder
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Add Section */}
      <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-up hover:shadow-soft transition-smooth" style={{ animationDelay: '0.5s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Quick Add</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => addQuickReminder("study")}
              className="h-12 bg-card/50 border-border/50 text-left justify-start hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-smooth"
            >
              <Clock className="w-4 h-4 mr-2 text-primary" />
              Study Session
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addQuickReminder("assignment")}
              className="h-12 bg-card/50 border-border/50 text-left justify-start hover:bg-secondary/10 hover:border-secondary/30 hover:text-secondary transition-smooth"
            >
              <Calendar className="w-4 h-4 mr-2 text-secondary" />
              Assignment Due
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reminders;