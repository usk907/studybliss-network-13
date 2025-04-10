
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  course_id: string;
}

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  
  // Load quiz data and attempts count
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!id || !user) return;
      
      try {
        // Fetch quiz data
        const { data: quizData, error: quizError } = await supabase
          .from("quizzes")
          .select(`
            id, 
            title, 
            description, 
            course_id,
            quiz_questions (
              id, 
              question, 
              options, 
              correct_answer,
              explanation
            )
          `)
          .eq("id", id)
          .single();
        
        if (quizError) throw quizError;
        
        if (!quizData || !quizData.quiz_questions) {
          toast({
            title: "Error",
            description: "Quiz not found or has no questions",
            variant: "destructive",
          });
          navigate("/courses");
          return;
        }
        
        // Format the data
        const formattedQuiz: QuizData = {
          id: quizData.id,
          title: quizData.title,
          description: quizData.description,
          course_id: quizData.course_id,
          questions: quizData.quiz_questions.map((q: any) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correct_answer,
            explanation: q.explanation,
          })),
        };
        
        setQuiz(formattedQuiz);
        
        // Fetch attempts count
        const { data: attemptsData, error: attemptsError } = await supabase
          .from("quiz_attempts")
          .select("attempt_number")
          .eq("quiz_id", id)
          .eq("user_id", user.id)
          .order("attempt_number", { ascending: false })
          .limit(1);
        
        if (attemptsError) throw attemptsError;
        
        const attempts = attemptsData.length > 0 ? attemptsData[0].attempt_number : 0;
        setAttemptsCount(attempts);
        setRemainingAttempts(3 - attempts);
        
        if (attempts >= 3) {
          toast({
            title: "Maximum attempts reached",
            description: "You've already completed this quiz 3 times",
          });
        }
      } catch (error: any) {
        console.error("Error fetching quiz:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load quiz",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [id, user, navigate]);
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const calculateScore = () => {
    if (!quiz) return 0;
    
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / quiz.questions.length) * 100);
  };
  
  const handleSubmitQuiz = async () => {
    if (!quiz || !user) return;
    
    if (remainingAttempts <= 0) {
      toast({
        title: "Maximum attempts reached",
        description: "You've already completed this quiz 3 times",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const finalScore = calculateScore();
      setScore(finalScore);
      
      // Save attempt to database
      const { error } = await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        quiz_id: quiz.id,
        score: finalScore,
        max_score: 100,
        attempt_number: attemptsCount + 1,
        answers: selectedAnswers,
      });
      
      if (error) throw error;
      
      // Update the attempts count and remaining attempts
      setAttemptsCount(attemptsCount + 1);
      setRemainingAttempts(remainingAttempts - 1);
      
      setIsSubmitted(true);
      
      toast({
        title: "Quiz submitted",
        description: `Your score: ${finalScore}%`,
      });
      
      // Update course progress if needed
      if (finalScore >= 70) {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from("enrollments")
          .select("completion_percentage")
          .eq("course_id", quiz.course_id)
          .eq("user_id", user.id)
          .single();
          
        if (!enrollmentError && enrollmentData) {
          const newProgress = Math.min(enrollmentData.completion_percentage + 20, 100);
          
          await supabase
            .from("enrollments")
            .update({ completion_percentage: newProgress })
            .eq("course_id", quiz.course_id)
            .eq("user_id", user.id);
            
          if (newProgress === 100) {
            // Generate certificate if course is completed
            await supabase.from("certificates").upsert({
              user_id: user.id,
              course_id: quiz.course_id,
              certificate_url: `/certificates/${user.id}-${quiz.course_id}.pdf`,
            }, { onConflict: 'user_id,course_id' });
            
            toast({
              title: "Congratulations!",
              description: "You've completed the course. Your certificate is now available.",
            });
          }
        }
      }
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit quiz",
        variant: "destructive",
      });
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Quiz...</h2>
          <p className="text-muted-foreground">Please wait while we load your quiz.</p>
        </div>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Quiz Not Found</h2>
          <p className="text-muted-foreground">The quiz you're looking for does not exist.</p>
          <Button onClick={() => navigate("/courses")} className="mt-4">
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }
  
  if (remainingAttempts <= 0 && !isSubmitted) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Maximum Attempts Reached</h2>
          <p className="text-muted-foreground">You've already taken this quiz 3 times.</p>
          <Button onClick={() => navigate(`/courses/${quiz.course_id}`)} className="mt-4">
            Back to Course
          </Button>
        </div>
      </div>
    );
  }
  
  const currentQ = quiz.questions[currentQuestion];
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-muted-foreground mb-4">{quiz.description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm">
            Attempts: {attemptsCount} / 3
          </span>
        </div>
        
        <Progress 
          value={((currentQuestion + 1) / quiz.questions.length) * 100} 
          className="h-2" 
        />
      </div>
      
      {isSubmitted ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2">Your Score: {score}%</h3>
              <p className="text-muted-foreground">
                {score >= 70 ? "Great job!" : "You can try again to improve your score."}
              </p>
            </div>
            
            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {selectedAnswers[index] === question.correctAnswer ? (
                      <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    ) : (
                      <XCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                    )}
                    <div>
                      <h4 className="font-medium">{question.question}</h4>
                      <div className="mt-2 text-sm">
                        <div>Your answer: <span className={selectedAnswers[index] === question.correctAnswer ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{selectedAnswers[index] || "Not answered"}</span></div>
                        <div>Correct answer: <span className="text-green-600 font-medium">{question.correctAnswer}</span></div>
                      </div>
                      {question.explanation && (
                        <div className="mt-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(`/courses/${quiz.course_id}`)}>
              Back to Course
            </Button>
            {remainingAttempts > 0 && (
              <Button onClick={resetQuiz}>
                Try Again ({remainingAttempts} attempts left)
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedAnswers[currentQuestion] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 border p-3 rounded hover:bg-muted">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <div>
              {currentQuestion === quiz.questions.length - 1 ? (
                <Button 
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  Next
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Quiz;
