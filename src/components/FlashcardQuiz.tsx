import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, RotateCcw, CheckCircle, X, Plus, Shuffle } from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed: string;
}

const FlashcardQuiz = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: "1",
      question: "What is the time complexity of binary search?",
      answer: "O(log n)",
      subject: "DSA",
      difficulty: "medium",
      lastReviewed: "2024-01-20"
    },
    {
      id: "2",
      question: "What does ACID stand for in databases?",
      answer: "Atomicity, Consistency, Isolation, Durability",
      subject: "DBMS",
      difficulty: "easy",
      lastReviewed: "2024-01-19"
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyStats, setStudyStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0
  });

  const currentCard = flashcards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const markCorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      correct: prev.correct + 1
    }));
    nextCard();
  };

  const markIncorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      incorrect: prev.incorrect + 1
    }));
    nextCard();
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success text-success-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "hard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const accuracy = studyStats.reviewed > 0 ? Math.round((studyStats.correct / studyStats.reviewed) * 100) : 0;

  return (
    <Card className="h-full shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Flashcards & Quiz
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={shuffleCards}>
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Study Stats */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="text-center p-2 rounded-lg bg-muted">
            <div className="text-lg font-bold text-foreground">{studyStats.reviewed}</div>
            <div className="text-xs text-muted-foreground">Reviewed</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-success/10">
            <div className="text-lg font-bold text-success">{studyStats.correct}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-primary/10">
            <div className="text-lg font-bold text-primary">{accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {flashcards.length > 0 && currentCard ? (
          <>
            {/* Card Counter */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentCard.subject}
                </Badge>
                <Badge className={`text-xs ${getDifficultyColor(currentCard.difficulty)}`}>
                  {currentCard.difficulty}
                </Badge>
              </div>
            </div>

            {/* Flashcard */}
            <div 
              className="relative bg-gradient-primary text-white p-6 rounded-xl min-h-[200px] flex items-center justify-center cursor-pointer transition-smooth hover:shadow-glow"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">
                  {showAnswer ? "Answer" : "Question"}
                </div>
                <div className="text-lg font-medium">
                  {showAnswer ? currentCard.answer : currentCard.question}
                </div>
              </div>
              
              <div className="absolute top-3 right-3">
                <RotateCcw className="w-4 h-4 opacity-75" />
              </div>
            </div>

            {/* Action Buttons */}
            {showAnswer ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={markIncorrect}
                  className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4" />
                  Incorrect
                </Button>
                <Button
                  onClick={markCorrect}
                  className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle className="w-4 h-4" />
                  Correct
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowAnswer(true)}
                className="w-full"
              >
                Reveal Answer
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No flashcards yet</p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create your first flashcard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardQuiz;