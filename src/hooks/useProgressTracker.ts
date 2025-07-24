import { useState, useEffect, useCallback } from 'react';

// Interface para os dados de progresso
export interface ProgressData {
  commandsUsed: number;
  quizzesCompleted: number;
  knowledgeArticlesRead: number;
  totalScore: number;
  currentStreak: number;
  achievements: string[];
  lastAccessDate: string;
  quizScores: number[]; // Para calcular precisão
}

// Configuração do IndexedDB
const DB_NAME = 'GitLearningProgressDB';
const DB_VERSION = 1;
const STORE_NAME = 'progress';

class ProgressDB {
  private db: IDBDatabase | null = null;

  // Inicializa o banco de dados IndexedDB
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  // Carrega os dados de progresso do IndexedDB
  async getProgress(): Promise<ProgressData> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('userProgress');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const defaultProgress: ProgressData = {
          commandsUsed: 0,
          quizzesCompleted: 0,
          knowledgeArticlesRead: 0,
          totalScore: 0,
          currentStreak: 0,
          achievements: [],
          lastAccessDate: new Date().toDateString(),
          quizScores: []
        };

        resolve(request.result?.data || defaultProgress);
      };
    });
  }

  // Salva os dados de progresso no IndexedDB
  async saveProgress(progress: ProgressData): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id: 'userProgress', data: progress });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Hook personalizado para gerenciar o progresso do usuário
export function useProgressTracker() {
  const [progress, setProgress] = useState<ProgressData>({
    commandsUsed: 0,
    quizzesCompleted: 0,
    knowledgeArticlesRead: 0,
    totalScore: 0,
    currentStreak: 0,
    achievements: [],
    lastAccessDate: new Date().toDateString(),
    quizScores: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const progressDB = new ProgressDB();

  // Carrega dados iniciais e calcula streak
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await progressDB.getProgress();
        const currentDate = new Date().toDateString();
        
        // Calcula streak de dias consecutivos
        if (savedProgress.lastAccessDate !== currentDate) {
          const lastDate = new Date(savedProgress.lastAccessDate);
          const today = new Date(currentDate);
          const timeDiff = today.getTime() - lastDate.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

          if (daysDiff === 1) {
            // Dia consecutivo
            savedProgress.currentStreak += 1;
          } else if (daysDiff > 1) {
            // Quebrou o streak
            savedProgress.currentStreak = 1;
          }
          // Se daysDiff === 0, é o mesmo dia, mantém o streak

          savedProgress.lastAccessDate = currentDate;
          await progressDB.saveProgress(savedProgress);
        }

        setProgress(savedProgress);
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  // Função para salvar progresso
  const saveProgress = useCallback(async (newProgress: ProgressData) => {
    try {
      await progressDB.saveProgress(newProgress);
      setProgress(newProgress);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }, []);

  // Incrementa comandos usados
  const incrementCommands = useCallback(async () => {
    const newProgress = {
      ...progress,
      commandsUsed: progress.commandsUsed + 1
    };
    await saveProgress(newProgress);
  }, [progress, saveProgress]);

  // Completa um quiz
  const completeQuiz = useCallback(async (score: number) => {
    const newProgress = {
      ...progress,
      quizzesCompleted: progress.quizzesCompleted + 1,
      totalScore: progress.totalScore + score,
      quizScores: [...progress.quizScores, score]
    };
    await saveProgress(newProgress);
  }, [progress, saveProgress]);

  // Incrementa artigos lidos
  const incrementArticlesRead = useCallback(async () => {
    const newProgress = {
      ...progress,
      knowledgeArticlesRead: progress.knowledgeArticlesRead + 1
    };
    await saveProgress(newProgress);
  }, [progress, saveProgress]);

  // Calcula progresso geral
  const getOverallProgress = useCallback(() => {
    return Math.min(
      Math.round(
        (progress.commandsUsed * 10 + 
         progress.quizzesCompleted * 15 + 
         progress.knowledgeArticlesRead * 5 + 
         progress.achievements.length * 20) / 10
      ),
      100
    );
  }, [progress]);

  // Calcula precisão dos quizzes
  const getQuizAccuracy = useCallback(() => {
    if (progress.quizScores.length === 0) return 0;
    const average = progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length;
    return Math.round(average);
  }, [progress.quizScores]);

  // Verifica conquistas desbloqueadas
  const getUnlockedAchievements = useCallback(() => {
    const achievements = [
      { id: 'first-command', threshold: 1, check: () => progress.commandsUsed >= 1 },
      { id: 'quiz-master', threshold: 5, check: () => progress.quizzesCompleted >= 5 },
      { id: 'knowledge-seeker', threshold: 10, check: () => progress.knowledgeArticlesRead >= 10 },
      { id: 'git-expert', threshold: 80, check: () => getQuizAccuracy() >= 80 },
      { id: 'streak-warrior', threshold: 7, check: () => progress.currentStreak >= 7 },
      { id: 'completionist', threshold: 100, check: () => getOverallProgress() >= 100 }
    ];

    return achievements.filter(achievement => achievement.check());
  }, [progress, getQuizAccuracy, getOverallProgress]);

  return {
    progress,
    isLoading,
    incrementCommands,
    completeQuiz,
    incrementArticlesRead,
    getOverallProgress,
    getQuizAccuracy,
    getUnlockedAchievements
  };
}