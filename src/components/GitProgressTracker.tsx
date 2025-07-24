import React, { createContext, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Star, Zap, BookOpen, Terminal, Loader2 } from 'lucide-react';
import { useProgressTracker } from '@/hooks/useProgressTracker';

// Context para compartilhar funções de progresso com outros componentes
interface ProgressContextType {
  incrementCommands: () => Promise<void>;
  completeQuiz: (score: number) => Promise<void>;
  incrementArticlesRead: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress deve ser usado dentro de um ProgressProvider');
  }
  return context;
};

const achievements = [
  { id: 'first-command', name: 'Primeiro Comando', description: 'Execute seu primeiro comando Git', icon: Terminal, threshold: 1 },
  { id: 'quiz-master', name: 'Mestre dos Quizzes', description: 'Complete 5 quizzes', icon: Target, threshold: 5 },
  { id: 'knowledge-seeker', name: 'Buscador de Conhecimento', description: 'Leia 10 artigos', icon: BookOpen, threshold: 10 },
  { id: 'git-expert', name: 'Expert em Git', description: 'Alcance 80% de precisão nos quizzes', icon: Star, threshold: 80 },
  { id: 'streak-warrior', name: 'Guerreiro da Sequência', description: 'Mantenha uma sequência de 7 dias', icon: Zap, threshold: 7 },
  { id: 'completionist', name: 'Completista', description: 'Complete todas as seções', icon: Trophy, threshold: 100 }
];

// Componente Provider para disponibilizar funções de progresso
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { incrementCommands, completeQuiz, incrementArticlesRead } = useProgressTracker();

  const contextValue: ProgressContextType = {
    incrementCommands,
    completeQuiz,
    incrementArticlesRead
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
}

export function GitProgressTracker() {
  // Usar o hook personalizado para gerenciar o progresso
  const {
    progress,
    isLoading,
    getOverallProgress,
    getQuizAccuracy,
    getUnlockedAchievements
  } = useProgressTracker();

  // Mostrar loading enquanto carrega dados do IndexedDB
  if (isLoading) {
    return (
      <Card className="glass border-cyber-blue/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-cyber-blue">
            <Trophy className="w-6 h-6" />
            Progresso de Aprendizado
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyber-blue" />
          <span className="ml-2 text-muted-foreground">Carregando progresso...</span>
        </CardContent>
      </Card>
    );
  }

  const overallProgress = getOverallProgress();
  const unlockedAchievements = getUnlockedAchievements();

  return (
    <Card className="glass border-cyber-blue/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-cyber-blue">
          <Trophy className="w-6 h-6" />
          Progresso de Aprendizado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progresso Geral */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso Geral</span>
            <span className="text-cyber-blue font-semibold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-cyber-green">{progress.commandsUsed}</div>
            <div className="text-xs text-muted-foreground">Comandos Usados</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-cyber-purple">{progress.quizzesCompleted}</div>
            <div className="text-xs text-muted-foreground">Quizzes Completos</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-cyber-orange">{progress.knowledgeArticlesRead}</div>
            <div className="text-xs text-muted-foreground">Artigos Lidos</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-cyber-blue">{progress.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Dias Seguidos</div>
          </div>
        </div>

        {/* Conquistas */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-cyber-purple">Conquistas</h4>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
              const Icon = achievement.icon;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    isUnlocked
                      ? 'border-cyber-green/50 bg-cyber-green/10 shadow-lg shadow-cyber-green/20'
                      : 'border-muted/30 bg-muted/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isUnlocked ? 'text-cyber-green' : 'text-muted-foreground'}`} />
                    <Badge
                      variant={isUnlocked ? 'default' : 'secondary'}
                      className={`text-xs ${isUnlocked ? 'bg-cyber-green/20 text-cyber-green' : ''}`}
                    >
                      {isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                    </Badge>
                  </div>
                  <div className="text-xs font-medium">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}