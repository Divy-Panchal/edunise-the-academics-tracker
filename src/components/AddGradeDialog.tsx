import { useState } from "react";
import { Plus, GraduationCap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Grade {
  id: string;
  type: string;
  score: number;
  maxScore: number;
  weight: number;
  date: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: string;
  grades: Grade[];
}

interface AddGradeDialogProps {
  subjects: Subject[];
  onAddGrade: (subjectId: string, grade: Omit<Grade, 'id'>) => void;
  onAddSubject: (subject: Omit<Subject, 'id' | 'grades'>) => void;
}

export const AddGradeDialog = ({ subjects, onAddGrade, onAddSubject }: AddGradeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'grade' | 'subject'>('grade');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // Grade form state
  const [gradeForm, setGradeForm] = useState({
    type: '',
    score: '',
    maxScore: '100',
    weight: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Subject form state
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    credits: '',
    semester: ''
  });

  const { toast } = useToast();

  const resetForms = () => {
    setGradeForm({
      type: '',
      score: '',
      maxScore: '100',
      weight: '',
      date: new Date().toISOString().split('T')[0]
    });
    setSubjectForm({
      name: '',
      code: '',
      credits: '',
      semester: ''
    });
    setSelectedSubject('');
    setMode('grade');
  };

  const handleAddGrade = () => {
    if (!selectedSubject || !gradeForm.type || !gradeForm.score || !gradeForm.weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const grade = {
      type: gradeForm.type,
      score: parseFloat(gradeForm.score),
      maxScore: parseFloat(gradeForm.maxScore),
      weight: parseFloat(gradeForm.weight),
      date: gradeForm.date
    };

    onAddGrade(selectedSubject, grade);
    
    toast({
      title: "Grade Added",
      description: `Added ${grade.type} grade successfully.`,
    });

    resetForms();
    setOpen(false);
  };

  const handleAddSubject = () => {
    if (!subjectForm.name || !subjectForm.code || !subjectForm.credits || !subjectForm.semester) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const subject = {
      name: subjectForm.name,
      code: subjectForm.code,
      credits: parseFloat(subjectForm.credits),
      semester: subjectForm.semester
    };

    onAddSubject(subject);
    
    toast({
      title: "Subject Added",
      description: `Added ${subject.name} successfully.`,
    });

    resetForms();
    setOpen(false);
  };

  const semesters = [
    "Fall 2024", "Spring 2024", "Summer 2024",
    "Fall 2023", "Spring 2023", "Summer 2023",
    "Fall 2022", "Spring 2022", "Summer 2022"
  ];

  const gradeTypes = [
    "Midterm Exam", "Final Exam", "Quiz", "Assignment", 
    "Lab Report", "Project", "Presentation", "Homework",
    "Participation", "Attendance"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:opacity-90 text-white border-0 shadow-elegant transition-all duration-300 hover:shadow-glow text-sm px-3 py-2 h-9">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg">Add Grade/Subject</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a grade or create a new subject.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant={mode === 'grade' ? 'default' : 'outline'}
              onClick={() => setMode('grade')}
              className="w-full text-sm h-8"
            >
              <GraduationCap className="w-3 h-3 mr-1" />
              Add Grade
            </Button>
            <Button
              variant={mode === 'subject' ? 'default' : 'outline'}
              onClick={() => setMode('subject')}
              className="w-full text-sm h-8"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Add Subject
            </Button>
          </div>

          {mode === 'grade' ? (
            <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground text-sm">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="bg-background border-border h-9">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id} className="text-foreground">
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-foreground text-sm">Grade Type</Label>
                  <Select value={gradeForm.type} onValueChange={(value) => setGradeForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-background border-border h-9">
                      <SelectValue placeholder="Select grade type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {gradeTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-foreground">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="score" className="text-foreground text-sm">Score</Label>
                    <Input
                      id="score"
                      type="number"
                      value={gradeForm.score}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, score: e.target.value }))}
                      placeholder="85"
                      className="bg-background border-border text-foreground h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxScore" className="text-foreground text-sm">Max</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      value={gradeForm.maxScore}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, maxScore: e.target.value }))}
                      placeholder="100"
                      className="bg-background border-border text-foreground h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-foreground text-sm">Weight (%)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={gradeForm.weight}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="20"
                      className="bg-background border-border text-foreground h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-foreground text-sm">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={gradeForm.date}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-background border-border text-foreground h-9"
                    />
                  </div>
                </div>

                <Button onClick={handleAddGrade} className="w-full bg-gradient-primary text-white h-9">
                  Add Grade
                </Button>
            </div>
          ) : (
            <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="subjectName" className="text-foreground text-sm">Subject Name</Label>
                  <Input
                    id="subjectName"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Calculus II"
                    className="bg-background border-border text-foreground h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectCode" className="text-foreground text-sm">Subject Code</Label>
                  <Input
                    id="subjectCode"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="MATH 251"
                    className="bg-background border-border text-foreground h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="credits" className="text-foreground text-sm">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={subjectForm.credits}
                      onChange={(e) => setSubjectForm(prev => ({ ...prev, credits: e.target.value }))}
                      placeholder="3"
                      className="bg-background border-border text-foreground h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-foreground text-sm">Semester</Label>
                    <Select value={subjectForm.semester} onValueChange={(value) => setSubjectForm(prev => ({ ...prev, semester: value }))}>
                      <SelectTrigger className="bg-background border-border h-9">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester} className="text-foreground">
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleAddSubject} className="w-full bg-gradient-primary text-white h-9">
                  Add Subject
                </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};