import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings, Coffee, Target, Clock, BookOpen, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  date: string;
  completed: boolean;
}

const Focus = () => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState("work"); // work, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [currentSubject, setCurrentSubject] = useState("");
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const [studyHistory, setStudyHistory] = useState<StudySession[]>([
    {
      id: "1",
      subject: "Mathematics",
      duration: 25,
      date: "2024-01-20",
      completed: true
    },
    {
      id: "2",
      subject: "Physics",
      duration: 25,
      date: "2024-01-20",
      completed: true
    },
    {
      id: "3",
      subject: "Chemistry",
      duration: 25,
      date: "2024-01-19",
      completed: true
    },
    {
      id: "4",
      subject: "Computer Science",
      duration: 50,
      date: "2024-01-19",
      completed: true
    }
  ]);

  const sessionTypes = {
    work: { duration: 25 * 60, label: "Focus Time", color: "bg-primary", icon: Target },
    shortBreak: { duration: 5 * 60, label: "Short Break", color: "bg-secondary", icon: Coffee },
    longBreak: { duration: 15 * 60, label: "Long Break", color: "bg-accent", icon: Coffee }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = sessionTypes[currentSession as keyof typeof sessionTypes].duration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const startStudySession = () => {
    if (!currentSubject.trim()) {
      setShowSubjectDialog(true);
      return;
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const completeSession = () => {
    if (currentSession === "work" && currentSubject) {
      const newSession: StudySession = {
        id: Date.now().toString(),
        subject: currentSubject,
        duration: 25,
        date: new Date().toISOString().split('T')[0],
        completed: true
      };
      
      setStudyHistory([newSession, ...studyHistory]);
      setSessionsCompleted(prev => prev + 1);
      setTotalFocusTime(prev => prev + 25);
      
      toast({
        title: "Great work! 🎉",
        description: `Completed 25 minutes of ${currentSubject} study!`,
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      const tick = () => {
        setTimeLeft(timeLeft => {
          if (timeLeft === 0) {
            // Session completed
            setIsActive(false);
            completeSession();
            
            if (currentSession === "work") {
              // Auto-start break
              const nextSession = (sessionsCompleted + 1) % 4 === 0 ? "longBreak" : "shortBreak";
              setCurrentSession(nextSession);
              return sessionTypes[nextSession].duration;
            } else {
              toast({
                title: "Break's over! 💪",
                description: "Ready to focus again?",
              });
              setCurrentSession("work");
              return sessionTypes.work.duration;
            }
          }
          return timeLeft - 1;
        });
      };
      interval = setInterval(tick, 1000);
    } else if (!isActive) {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [isActive, isPaused, timeLeft, currentSession, sessionsCompleted, currentSubject]);

  const handleStartPause = () => {
    if (isActive) {
      setIsPaused(!isPaused);
    } else {
      startStudySession();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(sessionTypes[currentSession as keyof typeof sessionTypes].duration);
  };

  const handleSessionChange = (session: string) => {
    setCurrentSession(session);
    setTimeLeft(sessionTypes[session as keyof typeof sessionTypes].duration);
    setIsActive(false);
    setIsPaused(false);
  };

  const handleSubjectSubmit = () => {
    if (currentSubject.trim()) {
      setShowSubjectDialog(false);
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const getTotalStudyTime = () => {
    return studyHistory.reduce((total, session) => total + session.duration, 0);
  };

  const getSubjectStats = () => {
    const subjectMap = new Map();
    studyHistory.forEach(session => {
      const current = subjectMap.get(session.subject) || 0;
      subjectMap.set(session.subject, current + session.duration);
    });
    return Array.from(subjectMap.entries()).sort((a, b) => b[1] - a[1]);
  };

  const currentSessionData = sessionTypes[currentSession as keyof typeof sessionTypes];
  const CurrentIcon = currentSessionData.icon;

  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Focus</h1>
          <p className="text-muted-foreground">Stay productive with the Pomodoro Technique</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHistory(!showHistory)}
            className="bg-card/50 border-border/50"
          >
            <History className="w-4 h-4 mr-2" />
            {showHistory ? "Timer" : "History"}
          </Button>
          <Button variant="outline" size="sm" className="bg-card/50 border-border/50">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {!showHistory ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <Card className="bg-gradient-primary text-white border-0 shadow-soft hover:shadow-glow transition-smooth">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold">{sessionsCompleted}</div>
                <div className="text-xs opacity-90">Sessions</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-secondary text-white border-0 shadow-soft hover:shadow-glow transition-smooth">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold">{getTotalStudyTime()}</div>
                <div className="text-xs opacity-90">Minutes</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-accent text-white border-0 shadow-soft hover:shadow-glow transition-smooth">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold">{Math.floor(getTotalStudyTime() / 60)}</div>
                <div className="text-xs opacity-90">Hours</div>
              </CardContent>
            </Card>
          </div>

          {/* Current Subject Display */}
          {currentSubject && (
            <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-medium">Currently studying: {currentSubject}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSubjectDialog(true)}
                  >
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Timer */}
          <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${currentSessionData.color}/10`}>
                  <CurrentIcon className={`w-5 h-5 text-primary`} />
                </div>
                <Badge className={`${currentSessionData.color}/10 text-primary border-primary/20`}>
                  {currentSessionData.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer Display */}
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-foreground mb-2">
                  {formatTime(timeLeft)}
                </div>
                <Progress value={getProgress()} className="w-full h-2" />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleStartPause}
                  size="lg"
                  className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 rounded-full w-16 h-16"
                >
                  {isActive && !isPaused ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="bg-card/50 border-border/50 rounded-full w-12 h-12"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>

              {/* Session Type Selector */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleSessionChange("work")}
                  variant={currentSession === "work" ? "default" : "outline"}
                  size="sm"
                  className={currentSession === "work" 
                    ? "bg-gradient-primary text-white border-0" 
                    : "bg-card/50 border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
                  }
                >
                  <Target className="w-3 h-3 mr-1" />
                  Focus
                </Button>
                <Button
                  onClick={() => handleSessionChange("shortBreak")}
                  variant={currentSession === "shortBreak" ? "default" : "outline"}
                  size="sm"
                  className={currentSession === "shortBreak" 
                    ? "bg-gradient-secondary text-white border-0" 
                    : "bg-card/50 border-border/50 hover:bg-secondary/10 hover:border-secondary/30 hover:text-secondary"
                  }
                >
                  <Coffee className="w-3 h-3 mr-1" />
                  Short
                </Button>
                <Button
                  onClick={() => handleSessionChange("longBreak")}
                  variant={currentSession === "longBreak" ? "default" : "outline"}
                  size="sm"
                  className={currentSession === "longBreak" 
                    ? "bg-gradient-accent text-white border-0" 
                    : "bg-card/50 border-border/50 hover:bg-accent/10 hover:border-accent/30 hover:text-accent-foreground"
                  }
                >
                  <Coffee className="w-3 h-3 mr-1" />
                  Long
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Pomodoro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Work for 25 minutes, then take a 5-minute break</p>
                <p>• After 4 sessions, take a longer 15-minute break</p>
                <p>• Stay focused during work sessions - avoid distractions</p>
                <p>• Use breaks to rest, stretch, or grab a drink</p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Study History */
        <div className="space-y-6">
          {/* Subject Statistics */}
          <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Subject Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getSubjectStats().map(([subject, minutes], index) => (
                  <div key={subject} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{subject}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{minutes} min</div>
                      <div className="text-xs text-muted-foreground">{Math.floor(minutes / 60)}h {minutes % 60}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card className="shadow-card bg-card/80 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {studyHistory.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${session.completed ? 'bg-success' : 'bg-muted'}`} />
                      <div>
                        <div className="font-medium">{session.subject}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{session.duration} min</div>
                      <div className="text-xs text-muted-foreground">
                        {session.completed ? "Completed" : "Incomplete"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subject Selection Dialog */}
      <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>What are you studying?</DialogTitle>
            <DialogDescription>
              Enter the subject you want to focus on during this session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                placeholder="e.g., Mathematics, Physics, Computer Science..."
                onKeyPress={(e) => e.key === "Enter" && handleSubjectSubmit()}
              />
            </div>
            <Button onClick={handleSubjectSubmit} className="w-full" disabled={!currentSubject.trim()}>
              Start Focus Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Focus;