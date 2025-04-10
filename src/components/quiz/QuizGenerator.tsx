
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuizGeneratorProps {
  courseId: string;
  courseTitle: string;
  onQuizCreated?: () => void;
}

const QuizGenerator = ({ courseId, courseTitle, onQuizCreated }: QuizGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleGenerateQuiz = async () => {
    if (!courseId) {
      toast({
        title: "Error",
        description: "Course ID is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call the Gemini function to generate a quiz
      const { data, error } = await supabase.functions.invoke("gemini", {
        body: {
          action: "generateQuiz",
          courseId,
          courseTitle,
        },
      });

      if (error) throw error;
      if (!data || !data.quiz) throw new Error("Failed to generate quiz");

      const { quiz } = data;
      setTitle(quiz.title || `${courseTitle} Quiz`);
      setDescription(quiz.description || `Test your knowledge of ${courseTitle}`);

      // Create the quiz in the database using generic approach
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          course_id: courseId,
          title: quiz.title || `${courseTitle} Quiz`,
          description: quiz.description || `Test your knowledge of ${courseTitle}`,
        })
        .select();

      if (quizError) throw quizError;
      if (!quizData || quizData.length === 0) throw new Error("Failed to create quiz");

      const quizId = quizData[0].id;

      // Create the questions
      const questions = quiz.questions.map((q: any) => ({
        quiz_id: quizId,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
      }));

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questions);

      if (questionsError) throw questionsError;

      toast({
        title: "Success",
        description: "Quiz generated successfully",
      });

      if (onQuizCreated) {
        onQuizCreated();
      }
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Generate a quiz for this course using AI. The quiz will contain multiple-choice
          questions relevant to the course content.
        </p>
        <div className="space-y-4">
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quiz Title (optional)"
              disabled={loading}
            />
          </div>
          <div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quiz Description (optional)"
              rows={3}
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateQuiz} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            "Generate Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizGenerator;
