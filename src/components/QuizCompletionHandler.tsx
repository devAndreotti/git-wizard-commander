import { useProgress } from '@/components/GitProgressTracker';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Trophy } from 'lucide-react';

interface QuizCompletionHandlerProps {
  score: number;
  totalQuestions: number;
  onComplete?: () => void;
}

// Componente para lidar com a conclusão de quizzes
export function QuizCompletionHandler({ score, totalQuestions, onComplete }: QuizCompletionHandlerProps) {
  const { completeQuiz } = useProgress();
  const { toast } = useToast();

  const handleQuizCompletion = async () => {
    try {
      // Calcula a pontuação em porcentagem
      const percentage = Math.round((score / totalQuestions) * 100);
      
      // Registra a conclusão do quiz
      await completeQuiz(percentage);
      
      toast({
        title: "Quiz Completado! 🎉",
        description: `Você acertou ${score} de ${totalQuestions} questões (${percentage}%)`,
      });

      // Callback opcional para o componente pai
      onComplete?.();
    } catch (error) {
      toast({
        title: "Erro ao salvar progresso",
        description: "Não foi possível registrar a conclusão do quiz.",
        variant: "destructive"
      });
    }
  };

  const percentage = Math.round((score / totalQuestions) * 100);
  const isGoodScore = percentage >= 70;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          {isGoodScore ? (
            <Trophy className="w-6 h-6 text-yellow-500" />
          ) : (
            <CheckCircle className="w-6 h-6 text-blue-500" />
          )}
          Quiz Finalizado!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-cyber-blue">
            {score}/{totalQuestions}
          </div>
          <div className="text-lg text-muted-foreground">
            {percentage}% de acertos
          </div>
          {isGoodScore && (
            <div className="text-green-500 font-medium">
              Excelente desempenho! 🌟
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleQuizCompletion}
          className="w-full"
          size="lg"
        >
          Registrar Progresso
        </Button>
      </CardContent>
    </Card>
  );
}