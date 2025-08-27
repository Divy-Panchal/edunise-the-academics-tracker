import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: string;
  priority: string;
  subject: string;
  completed: boolean;
}

interface AddReminderDialogProps {
  onAddTask: (reminder: {
    title: string;
    description?: string;
    reminder_time: string;
    reminder_date: string;
    enabled: boolean;
    type: string;
    recurring: boolean;
  }) => void;
  children?: React.ReactNode;
}

const AddReminderDialog = ({ onAddTask, children }: AddReminderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = () => {
    if (title && date && time && type) {
      onAddTask({
        title,
        description,
        reminder_time: time,
        reminder_date: format(date, 'yyyy-MM-dd'),
        enabled: true,
        type,
        recurring,
      });
      
      // Reset form
      setTitle("");
      setDate(undefined);
      setTime("");
      setType("");
      setDescription("");
      setRecurring(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-primary text-white border-0 shadow-soft">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Reminder</DialogTitle>
          <DialogDescription>
            Create a new reminder with date and time settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Reminder Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reminder title..."
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
            />
          </div>

          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Assignment">Assignment</SelectItem>
                <SelectItem value="Exam">Exam</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="recurring" className="text-sm">Recurring reminder</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReminderDialog;