import { useEffect, useRef } from 'react';
import { useProgress } from '@/components/GitProgressTracker';
import { useToast } from '@/hooks/use-toast';
import { BookOpen } from 'lucide-react';

interface ArticleReadTrackerProps {
  articleId: string;
  children: React.ReactNode;
  minReadTime?: number; // Tempo mínimo em segundos para considerar "lido"
}

// Componente que rastreia quando um artigo foi lido
export function ArticleReadTracker({ 
  articleId, 
  children, 
  minReadTime = 30 
}: ArticleReadTrackerProps) {
  const { incrementArticlesRead } = useProgress();
  const { toast } = useToast();
  const readTimeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasBeenReadRef = useRef(false);

  useEffect(() => {
    // Verifica se o artigo já foi lido anteriormente
    const readArticles = JSON.parse(localStorage.getItem('readArticles') || '[]');
    if (readArticles.includes(articleId)) {
      hasBeenReadRef.current = true;
      return;
    }

    // Inicia o contador quando o componente é montado
    intervalRef.current = setInterval(() => {
      readTimeRef.current += 1;

      // Se atingiu o tempo mínimo e ainda não foi marcado como lido
      if (readTimeRef.current >= minReadTime && !hasBeenReadRef.current) {
        hasBeenReadRef.current = true;
        handleArticleRead();
      }
    }, 1000);

    // Cleanup ao desmontar o componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [articleId, minReadTime]);

  const handleArticleRead = async () => {
    try {
      // Marca o artigo como lido no localStorage
      const readArticles = JSON.parse(localStorage.getItem('readArticles') || '[]');
      if (!readArticles.includes(articleId)) {
        readArticles.push(articleId);
        localStorage.setItem('readArticles', JSON.stringify(readArticles));

        // Incrementa o contador no progresso
        await incrementArticlesRead();

        toast({
          title: "Artigo lido! 📚",
          description: "Seu progresso foi atualizado.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Erro ao registrar leitura do artigo:', error);
    }
  };

  return (
    <div className="relative">
      {children}
      
      {/* Indicador visual de progresso de leitura (opcional) */}
      {!hasBeenReadRef.current && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 text-white text-sm">
            <BookOpen className="w-4 h-4" />
            <span>
              Lendo... {Math.max(0, minReadTime - readTimeRef.current)}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
}