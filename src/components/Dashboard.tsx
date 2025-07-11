import { Calendar, Clock, BookOpen, TrendingUp, Plus, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-up">
        <h1 className="text-2xl font-bold text-foreground">Good morning, Alex! 👋</h1>
        <p className="text-muted-foreground">{currentDate}</p>
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
        <Card className="shadow-card bg-white/70 backdrop-blur-sm border-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border-l-4 border-red-400">
              <div>
                <div className="font-medium text-sm">Math Assignment</div>
                <div className="text-xs text-muted-foreground">Due in 2 hours</div>
              </div>
              <div className="text-xs text-red-600 font-medium">URGENT</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
              <div>
                <div className="font-medium text-sm">Physics Lab Report</div>
                <div className="text-xs text-muted-foreground">Due tomorrow</div>
              </div>
              <div className="text-xs text-yellow-600 font-medium">SOON</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-light/20 rounded-xl border-l-4 border-primary">
              <div>
                <div className="font-medium text-sm">History Essay</div>
                <div className="text-xs text-muted-foreground">Due in 3 days</div>
              </div>
              <div className="text-xs text-primary font-medium">PENDING</div>
            </div>
          </CardContent>
        </Card>

        {/* Next Class */}
        <Card className="shadow-card bg-white/70 backdrop-blur-sm border-0 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-secondary" />
              Next Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-secondary p-4 rounded-xl text-white">
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
        <Card className="shadow-card bg-white/70 backdrop-blur-sm border-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
              Current GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-accent p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-accent-foreground">3.75</div>
                  <div className="text-sm text-accent-foreground/70">This Semester</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-medium text-sm">↗ +0.12</div>
                  <div className="text-xs text-accent-foreground/70">vs last semester</div>
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
        <Button variant="outline" className="h-12 bg-white/80 border-border/50 transition-smooth hover:bg-white">
          <Bell className="w-4 h-4 mr-2" />
          Reminders
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;