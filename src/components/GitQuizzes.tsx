import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Trophy, Target, Sparkles, RefreshCw, Star, Zap, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const quizQuestions: Question[] = [
  // Easy Questions
  {
    id: 1,
    question: "Qual comando é usado para criar uma nova branch?",
    options: [
      "git branch nova-branch",
      "git checkout -b nova-branch",
      "git create nova-branch",
      "git new-branch nova-branch"
    ],
    correctAnswer: 1,
    explanation: "git checkout -b nova-branch cria uma nova branch e já faz o checkout para ela em um único comando.",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "O que faz o comando 'git stash'?",
    options: [
      "Remove todas as alterações não commitadas",
      "Salva temporariamente as alterações não commitadas",
      "Cria um novo commit",
      "Faz merge das alterações"
    ],
    correctAnswer: 1,
    explanation: "git stash salva temporariamente as alterações não commitadas, permitindo trocar de branch sem fazer commit.",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "Qual comando mostra o status dos arquivos no repositório?",
    options: [
      "git show",
      "git status",
      "git info",
      "git state"
    ],
    correctAnswer: 1,
    explanation: "git status é o comando fundamental para ver quais arquivos foram modificados, adicionados ou estão prontos para commit.",
    difficulty: "easy"
  },
  {
    id: 4,
    question: "Como adicionar todos os arquivos modificados ao staging area?",
    options: [
      "git add .",
      "git stage all",
      "git commit -a",
      "git push all"
    ],
    correctAnswer: 0,
    explanation: "git add . adiciona todos os arquivos modificados e novos no diretório atual ao staging area.",
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Qual é o comando para clonar um repositório?",
    options: [
      "git download",
      "git copy",
      "git clone",
      "git pull"
    ],
    correctAnswer: 2,
    explanation: "git clone cria uma cópia local de um repositório remoto, baixando todo o histórico e arquivos.",
    difficulty: "easy"
  },
  {
    id: 6,
    question: "Como ver o histórico de commits?",
    options: [
      "git history",
      "git log",
      "git commits",
      "git show-history"
    ],
    correctAnswer: 1,
    explanation: "git log exibe o histórico de commits do repositório, mostrando autor, data e mensagem de cada commit.",
    difficulty: "easy"
  },
  {
    id: 7,
    question: "Qual comando sincroniza mudanças do repositório remoto?",
    options: [
      "git sync",
      "git update",
      "git pull",
      "git fetch"
    ],
    correctAnswer: 2,
    explanation: "git pull baixa e aplica automaticamente as mudanças do repositório remoto para a branch local.",
    difficulty: "easy"
  },
  {
    id: 8,
    question: "Como enviar commits para o repositório remoto?",
    options: [
      "git send",
      "git upload",
      "git push",
      "git commit-remote"
    ],
    correctAnswer: 2,
    explanation: "git push envia os commits locais para o repositório remoto, sincronizando as mudanças.",
    difficulty: "easy"
  },

  // Medium Questions
  {
    id: 9,
    question: "Qual a diferença entre 'git reset --soft' e 'git reset --hard'?",
    options: [
      "Não há diferença",
      "--soft mantém as alterações no stage, --hard remove tudo",
      "--soft remove tudo, --hard mantém as alterações",
      "--soft é mais rápido que --hard"
    ],
    correctAnswer: 1,
    explanation: "git reset --soft mantém as alterações no stage area, enquanto --hard remove completamente as alterações.",
    difficulty: "medium"
  },
  {
    id: 10,
    question: "O que faz 'git cherry-pick'?",
    options: [
      "Seleciona os melhores commits",
      "Aplica um commit específico de outra branch",
      "Remove commits ruins",
      "Escolhe arquivos para commit"
    ],
    correctAnswer: 1,
    explanation: "git cherry-pick aplica um commit específico de outra branch para a branch atual.",
    difficulty: "medium"
  },
  {
    id: 11,
    question: "Qual a diferença entre 'git fetch' e 'git pull'?",
    options: [
      "São idênticos",
      "fetch baixa mudanças sem aplicar, pull baixa e aplica",
      "fetch é mais rápido que pull",
      "pull só funciona na branch main"
    ],
    correctAnswer: 1,
    explanation: "git fetch apenas baixa as mudanças do remoto sem aplicar localmente, enquanto git pull faz fetch + merge automaticamente.",
    difficulty: "medium"
  },
  {
    id: 12,
    question: "O que significa um 'merge conflict'?",
    options: [
      "Erro na conexão com o servidor",
      "Mudanças conflitantes na mesma linha de código",
      "Branch que não pode ser deletada",
      "Commit corrompido"
    ],
    correctAnswer: 1,
    explanation: "Merge conflict ocorre quando duas branches modificam a mesma linha de código de formas diferentes, exigindo resolução manual.",
    difficulty: "medium"
  },
  {
    id: 13,
    question: "Para que serve 'git stash pop'?",
    options: [
      "Remove o último commit",
      "Aplica e remove o último stash",
      "Cria um novo stash",
      "Lista todos os stashes"
    ],
    correctAnswer: 1,
    explanation: "git stash pop aplica as mudanças do último stash e o remove da pilha de stashes.",
    difficulty: "medium"
  },
  {
    id: 14,
    question: "Qual comando mostra diferenças entre commits?",
    options: [
      "git compare",
      "git diff",
      "git changes",
      "git delta"
    ],
    correctAnswer: 1,
    explanation: "git diff mostra as diferenças entre arquivos, commits, branches ou entre o working directory e staging area.",
    difficulty: "medium"
  },
  {
    id: 15,
    question: "O que faz 'git blame'?",
    options: [
      "Encontra bugs no código",
      "Mostra quem modificou cada linha de um arquivo",
      "Lista commits com problemas",
      "Valida a sintaxe do código"
    ],
    correctAnswer: 1,
    explanation: "git blame mostra linha por linha quem foi o último a modificar cada parte de um arquivo, incluindo commit e data.",
    difficulty: "medium"
  },
  {
    id: 16,
    question: "Como desfazer mudanças não commitadas em um arquivo específico?",
    options: [
      "git reset arquivo.txt",
      "git restore arquivo.txt",
      "git undo arquivo.txt",
      "git revert arquivo.txt"
    ],
    correctAnswer: 1,
    explanation: "git restore arquivo.txt descarta as mudanças não commitadas no arquivo, voltando ao estado do último commit.",
    difficulty: "medium"
  },

  // Hard Questions
  {
    id: 17,
    question: "Em que situação você usaria 'git rebase' ao invés de 'git merge'?",
    options: [
      "Sempre, rebase é melhor",
      "Para manter um histórico linear e limpo",
      "Quando há conflitos",
      "Nunca, merge é sempre melhor"
    ],
    correctAnswer: 1,
    explanation: "git rebase é usado para manter um histórico linear e limpo, reaplicando commits em cima de outra branch.",
    difficulty: "hard"
  },
  {
    id: 18,
    question: "O que faz 'git rebase -i HEAD~3'?",
    options: [
      "Remove os últimos 3 commits",
      "Permite editar interativamente os últimos 3 commits",
      "Faz merge dos últimos 3 commits",
      "Cria uma branch com os últimos 3 commits"
    ],
    correctAnswer: 1,
    explanation: "git rebase -i (interativo) permite editar, reordenar, combinar ou remover commits no histórico, dando controle total sobre os últimos 3 commits.",
    difficulty: "hard"
  },
  {
    id: 19,
    question: "Qual a diferença entre 'git revert' e 'git reset'?",
    options: [
      "São comandos idênticos",
      "revert cria novo commit desfazendo mudanças, reset altera histórico",
      "revert é mais rápido que reset",
      "revert só funciona em branches remotas"
    ],
    correctAnswer: 1,
    explanation: "git revert cria um novo commit que desfaz as mudanças (preserva histórico), enquanto git reset altera/remove commits do histórico.",
    difficulty: "hard"
  },
  {
    id: 20,
    question: "O que significa 'HEAD~2' no Git?",
    options: [
      "O segundo arquivo no repositório",
      "Dois commits antes do commit atual",
      "A segunda branch criada",
      "Dois dias antes no histórico"
    ],
    correctAnswer: 1,
    explanation: "HEAD~2 se refere ao commit que está 2 posições antes do commit atual no histórico da branch.",
    difficulty: "hard"
  },
  {
    id: 21,
    question: "Para que serve 'git reflog'?",
    options: [
      "Ver logs de erro do Git",
      "Recuperar commits 'perdidos' após reset/rebase",
      "Gerar relatório de performance",
      "Fazer backup do repositório"
    ],
    correctAnswer: 1,
    explanation: "git reflog mostra o histórico de todas as operações que moveram o HEAD, permitindo recuperar commits mesmo após reset --hard.",
    difficulty: "hard"
  },
  {
    id: 22,
    question: "O que faz 'git bisect'?",
    options: [
      "Divide o repositório em dois",
      "Encontra o commit que introduziu um bug usando busca binária",
      "Faz backup incremental",
      "Otimiza o banco de dados do Git"
    ],
    correctAnswer: 1,
    explanation: "git bisect usa busca binária para encontrar automaticamente o commit específico que introduziu um bug, testando commits no meio do intervalo.",
    difficulty: "hard"
  },
  {
    id: 23,
    question: "Quando usar 'git merge --squash'?",
    options: [
      "Sempre que fazer merge",
      "Para combinar todos os commits de uma branch em um único commit",
      "Para acelerar o processo de merge",
      "Apenas em branches principais"
    ],
    correctAnswer: 1,
    explanation: "git merge --squash pega todas as mudanças da branch mas as aplica como um único commit, útil para manter o histórico limpo.",
    difficulty: "hard"
  },
  {
    id: 24,
    question: "O que significa o modo 'detached HEAD'?",
    options: [
      "Erro grave no repositório",
      "HEAD aponta para um commit específico, não uma branch",
      "Repositório corrompido",
      "Branch principal deletada"
    ],
    correctAnswer: 1,
    explanation: "Detached HEAD significa que você está em um commit específico, não na ponta de uma branch. Commits feitos neste estado podem ser 'perdidos'.",
    difficulty: "hard"
  }
];

export function GitQuizzes() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const { toast } = useToast();

  const filteredQuestions = quizQuestions.filter(q => q.difficulty === selectedDifficulty);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "Selecione uma resposta",
        description: "Por favor, selecione uma opção antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = parseInt(selectedAnswer) === filteredQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    setShowResult(true);

    if (currentQuestion === filteredQuestions.length - 1) {
      setQuizCompleted(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);
  };

  const changeDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    setSelectedDifficulty(difficulty);
    resetQuiz();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-cyber-green/20 text-cyber-green border-cyber-green/50";
      case "medium": return "bg-cyber-orange/20 text-cyber-orange border-cyber-orange/50";
      case "hard": return "bg-destructive/20 text-destructive border-destructive/50";
      default: return "bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50";
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / filteredQuestions.length) * 100;
    if (percentage >= 80) return "Excelente! Você domina o Git! 🚀";
    if (percentage >= 60) return "Bom trabalho! Continue praticando! 💪";
    if (percentage >= 40) return "Você está no caminho certo! 📚";
    return "Continue estudando, você consegue! 💡";
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / filteredQuestions.length) * 100;

  if (quizCompleted) {
    return (
      <Card className="glass border-cyber-purple/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-cyber-orange animate-bounce" />
          </div>
          <CardTitle className="text-3xl text-cyber-purple neon-text">Quiz Concluído!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl font-bold text-cyber-green neon-text">
              {score}/{filteredQuestions.length}
            </div>
            <p className="text-xl text-muted-foreground">{getScoreMessage()}</p>
            <div className="flex justify-center gap-2">
              <Badge className={getDifficultyColor(selectedDifficulty)}>
                {selectedDifficulty === "easy" ? "Fácil" : 
                 selectedDifficulty === "medium" ? "Médio" : "Difícil"}: {filteredQuestions.length} perguntas
              </Badge>
            </div>
          </div>
          
          <Button 
            onClick={resetQuiz}
            variant="cyber"
            size="lg"
            className="text-lg px-8"
          >
            <RefreshCw className="w-5 h-5" />
            Refazer Quiz
            <Sparkles className="w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = filteredQuestions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-cyber-purple" />
          <h2 className="text-2xl font-bold text-cyber-purple neon-text">
            Desafios Git
          </h2>
        </div>
        
        {/* Difficulty Selector */}
        <div className="flex gap-2">
          <Button
            variant={selectedDifficulty === "easy" ? "cyber" : "glass"}
            size="sm"
            onClick={() => changeDifficulty("easy")}
            className="transition-all duration-300"
          >
            <Star className="w-4 h-4 mr-1" />
            Fácil
          </Button>
          <Button
            variant={selectedDifficulty === "medium" ? "cyber" : "glass"}
            size="sm"
            onClick={() => changeDifficulty("medium")}
            className="transition-all duration-300"
          >
            <Zap className="w-4 h-4 mr-1" />
            Médio
          </Button>
          <Button
            variant={selectedDifficulty === "hard" ? "cyber" : "glass"}
            size="sm"
            onClick={() => changeDifficulty("hard")}
            className="transition-all duration-300"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Difícil
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pergunta {currentQuestion + 1} de {filteredQuestions.length}</span>
          <span>Pontuação: {score}/{answeredQuestions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="glass border-cyber-blue/50">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showResult ? (
            <>
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`}
                        className="border-cyber-purple data-[state=checked]:bg-cyber-purple data-[state=checked]:border-cyber-purple"
                      />
                      <Label 
                        htmlFor={`option-${index}`}
                        className="text-foreground cursor-pointer quiz-answer flex-1 p-3 rounded-lg border border-muted hover:border-cyber-purple/50 hover:bg-cyber-purple/5 transition-all"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              
              <Button 
                onClick={handleAnswerSubmit}
                variant="cyber"
                size="lg"
                className="w-full quiz-confirm-btn"
                disabled={!selectedAnswer}
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirmar Resposta
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {parseInt(selectedAnswer) === question.correctAnswer ? (
                  <CheckCircle2 className="w-8 h-8 text-cyber-green" />
                ) : (
                  <XCircle className="w-8 h-8 text-destructive" />
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {parseInt(selectedAnswer) === question.correctAnswer ? 
                      "Correto!" : "Incorreto!"}
                  </h3>
                  <p className="text-muted-foreground">
                    Resposta correta: {question.options[question.correctAnswer]}
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30">
                <h4 className="font-semibold text-cyber-blue mb-2">Explicação:</h4>
                <p className="text-foreground">{question.explanation}</p>
              </div>
              
                <Button 
                onClick={handleNextQuestion}
                variant="glass"
                size="lg"
                className="w-full"
              >
                {currentQuestion === filteredQuestions.length - 1 ? 
                  "Ver Resultado Final" : "Próxima Pergunta"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}