import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/components/GitProgressTracker';
import { useToast } from '@/hooks/use-toast';

interface CommandCopyButtonProps {
  command: string;
  className?: string;
}

// Componente para copiar comandos Git e incrementar o progresso
export function CommandCopyButton({ command, className }: CommandCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { incrementCommands } = useProgress();
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      
      // Incrementa o contador de comandos usados
      await incrementCommands();
      
      toast({
        title: "Comando copiado!",
        description: "O comando foi copiado para a área de transferência.",
      });

      // Reset do ícone após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o comando.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className={`transition-all duration-200 ${className}`}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      <span className="ml-2">{copied ? 'Copiado!' : 'Copiar'}</span>
    </Button>
  );
}