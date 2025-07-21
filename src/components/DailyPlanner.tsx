import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, GripVertical } from "lucide-react";

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  duration: string;
  category: "class" | "study" | "break" | "assignment";
  color: string;
}

const DailyPlanner = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: "1",
      title: "Data Structures Lecture",
      time: "09:00",
      duration: "1h 30m",
      category: "class",
      color: "bg-gradient-primary"
    },
    {
      id: "2",
      title: "Study Time - Algorithms",
      time: "11:00",
      duration: "2h",
      category: "study",
      color: "bg-gradient-secondary"
    },
    {
      id: "3",
      title: "Lunch Break",
      time: "13:00",
      duration: "1h",
      category: "break",
      color: "bg-gradient-accent"
    }
  ]);

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "class":
        return "bg-gradient-primary text-white";
      case "study":
        return "bg-gradient-secondary text-white";
      case "break":
        return "bg-gradient-accent text-white";
      case "assignment":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="h-full shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduleItems.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-3 p-3 rounded-xl bg-card hover:bg-muted/50 transition-smooth cursor-pointer"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{item.time}</span>
                <Badge variant="secondary" className="text-xs">
                  {item.duration}
                </Badge>
              </div>
              <h4 className="font-medium text-sm truncate">{item.title}</h4>
            </div>
            <div className={`w-3 h-3 rounded-full ${getCategoryStyle(item.category)}`} />
          </div>
        ))}
        <div className="pt-2">
          <Button variant="outline" className="w-full gap-2 border-dashed">
            <Plus className="w-4 h-4" />
            Add new schedule item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPlanner;