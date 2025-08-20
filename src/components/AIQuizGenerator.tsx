import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Sparkles, CheckCircle, X, RotateCcw, Play } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const AIQuizGenerator = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Sample questions for demo
  const sampleQuestions: Question[] = [
    {
      id: "1",
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      difficulty: "medium"
    },
    {
      id: "2",
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "Stack follows Last In First Out (LIFO) principle where the last element added is the first one to be removed.",
      difficulty: "easy"
    }
  ];

  const generateQuiz = async () => {
    if (!topic || !difficulty) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      setCurrentQuiz(sampleQuestions);
      setIsGenerating(false);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuiz[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz([]);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setTopic("");
    setDifficulty("");
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "bg-success text-success-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (showResult) {
    return (
      <Card className="shadow-card bg-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl font-bold text-primary">{score}/{currentQuiz.length}</div>
            <div className="text-lg text-muted-foreground">
              You scored {Math.round((score / currentQuiz.length) * 100)}%
            </div>
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
              score / currentQuiz.length >= 0.8 ? 'bg-success/10 text-success' :
              score / currentQuiz.length >= 0.6 ? 'bg-warning/10 text-warning' :
              'bg-destructive/10 text-destructive'
            }`}>
              {score / currentQuiz.length >= 0.8 ? 'Excellent!' :
               score / currentQuiz.length >= 0.6 ? 'Good Job!' :
               'Keep Practicing!'}
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={resetQuiz} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizStarted && currentQuiz.length > 0) {
    const currentQuestion = currentQuiz[currentQuestionIndex];
    
    return (
      <Card className="shadow-card bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Generated Quiz
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {currentQuestionIndex + 1} of {currentQuiz.length}
              </Badge>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-primary bg-primary text-white'
                        : 'border-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={resetQuiz}>
              <X className="w-4 h-4 mr-2" />
              Exit Quiz
            </Button>
            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="gap-2"
            >
              {currentQuestionIndex < currentQuiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <CheckCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Quiz Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isGenerating ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Generating Quiz...</h3>
            <p className="text-muted-foreground">AI is creating personalized questions for you</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Data Structures, Algorithms, DBMS"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Questions</Label>
                  <Select value={questionCount} onValueChange={setQuestionCount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={generateQuiz}
              disabled={!topic || !difficulty}
              className="w-full gap-2 bg-gradient-primary text-white"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Quiz
            </Button>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">How it works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI generates questions based on your topic</li>
                <li>• Multiple choice format with explanations</li>
                <li>• Adaptive difficulty based on your selection</li>
                <li>• Instant feedback and scoring</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIQuizGenerator;