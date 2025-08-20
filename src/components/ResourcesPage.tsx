import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Brain, Upload, BookOpen } from "lucide-react";
import ResourceLocker from "./ResourceLocker";
import FlashcardQuiz from "./FlashcardQuiz";
import AIQuizGenerator from "./AIQuizGenerator";

const ResourcesPage = () => {
  return (
    <div className="p-4 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resources & Learning</h1>
          <p className="text-muted-foreground">Manage your study materials and practice</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resources" className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <TabsList className="grid w-full grid-cols-3 bg-white/90 dark:bg-card/50 backdrop-blur-md border border-border/50">
          <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="quiz" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" />
            AI Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <ResourceLocker />
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-4">
          <FlashcardQuiz />
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <AIQuizGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourcesPage;