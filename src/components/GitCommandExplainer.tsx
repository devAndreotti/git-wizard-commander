import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Copy, ChevronDown, Check, GitBranch, Terminal, Zap, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Interface que define a estrutura de um comando Git
 * Cada comando possui informações completas para ajudar o usuário
 */
interface GitCommand {
  command: string;      // O comando Git em si
  title: string;        // Título descritivo do comando
  description: string;  // Breve descrição do que faz
  explanation: string;  // Explicação detalhada
  icon: React.ComponentType<any>; // Ícone para representar o comando
  color: string;        // Cor temática do comando
}

/**
 * Componente que exibe comandos Git essenciais com explicações interativas
 * Permite ao usuário expandir cada comando para ver detalhes e copiar facilmente
 */
export function GitCommandExplainer() {
  // Estado para controlar qual comando está expandido
  const [openCommand, setOpenCommand] = useState<string | null>(null);
  // Estado para controlar qual comando foi copiado (para feedback visual)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Função para copiar texto para a área de transferência
   * Mostra feedback visual e notificação de sucesso/erro
   */
  const handleCopyToClipboard = async (text: string, commandName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(commandName);
      toast({
        title: "✅ Comando Copiado!",
        description: `"${text}" foi copiado para sua área de transferência`,
      });
      // Remove o feedback visual após 2 segundos
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      toast({
        title: "❌ Erro ao Copiar",
        description: "Não foi possível copiar o comando. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Array com comandos Git fundamentais para iniciantes
  const gitCommands: GitCommand[] = [
    {
      command: "git init",
      title: "Inicializar Repositório Git",
      description: "Cria um novo repositório Git no diretório atual",
      explanation: "Este é o primeiro comando que você executa em qualquer projeto novo. Ele cria um repositório Git vazio, permitindo que você comece a rastrear mudanças nos seus arquivos. Após executar este comando, você pode começar a fazer commits.",
      icon: Terminal,
      color: "cyber-blue"
    },
    {
      command: "git add .",
      title: "Adicionar Arquivos ao Staging",
      description: "Prepara todos os arquivos modificados para o próximo commit",
      explanation: "O comando 'git add' move arquivos para a 'staging area' (área de preparação). O ponto (.) significa 'todos os arquivos'. Você também pode adicionar arquivos específicos com 'git add arquivo.txt'. Esta é uma etapa obrigatória antes de fazer commit.",
      icon: Zap,
      color: "cyber-green"
    },
    {
      command: "git commit -m 'mensagem'",
      title: "Salvar Mudanças (Commit)",
      description: "Cria um snapshot permanente das mudanças preparadas",
      explanation: "O commit salva definitivamente suas mudanças no histórico do Git. A mensagem deve descrever claramente o que você fez. Exemplo: 'git commit -m \"Adicionar função de login\"'. Cada commit é como uma 'foto' do seu projeto em um momento específico.",
      icon: BookOpen,
      color: "cyber-purple"
    },
    {
      command: "git status",
      title: "Ver Status dos Arquivos",
      description: "Mostra quais arquivos foram modificados, adicionados ou removidos",
      explanation: "Este comando é seu melhor amigo! Ele mostra o estado atual do seu repositório: quais arquivos estão modificados, quais estão prontos para commit (staging), e quais são novos. Use frequentemente para saber o que está acontecendo.",
      icon: Terminal,
      color: "cyber-orange"
    },
    {
      command: "git log --oneline",
      title: "Ver Histórico de Commits",
      description: "Exibe uma lista compacta dos commits anteriores",
      explanation: "Mostra o histórico de todos os commits feitos no projeto. A opção '--oneline' exibe cada commit em uma linha, tornando mais fácil de ler. Você pode ver quem fez o quê e quando, além das mensagens de commit.",
      icon: GitBranch,
      color: "cyber-pink"
    }
  ];

  return (
    <Card className="glass glass-hover border-cyber-purple/50 hover:border-cyber-purple/70 transition-all duration-300 hover:shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-cyber-purple">
          <div className="p-2 rounded-lg bg-cyber-purple/20">
            <Terminal className="w-5 h-5" />
          </div>
          Comandos Git para Iniciantes
          <Badge variant="outline" className="ml-auto">
            {gitCommands.length} comandos essenciais
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Lista de comandos Git básicos com explicações detalhadas */}
        {gitCommands.map((cmd, index) => {
          const Icon = cmd.icon;
          const isOpen = openCommand === cmd.command;
          
          return (
            <Collapsible
              key={cmd.command}
              open={isOpen}
              onOpenChange={(open) => setOpenCommand(open ? cmd.command : null)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-cyber-purple/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${cmd.color}/20 group-hover:bg-${cmd.color}/30 transition-colors duration-200`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium font-mono text-cyber-blue">{cmd.command}</div>
                      <div className="text-sm text-muted-foreground">{cmd.description}</div>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`} 
                  />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2">
                <div className="border-l-2 border-cyber-purple/30 ml-6 pl-4 space-y-3">
                  <h4 className="font-semibold text-cyber-purple flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {cmd.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg">
                    {cmd.explanation}
                  </p>
                  
                  {/* Área para copiar o comando */}
                  <div className="terminal rounded-lg p-3 flex items-center justify-between hover:bg-background/60 transition-colors duration-200">
                    <code className="text-cyber-blue font-mono text-sm">
                      {cmd.command}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyToClipboard(cmd.command, cmd.command)}
                      className="nav-btn hover:bg-cyber-purple/20"
                    >
                      {copiedCommand === cmd.command ? (
                        <Check className="w-3 h-3 text-cyber-green" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {/* Botão para copiar todos os comandos de uma vez */}
        <div className="pt-4 border-t border-cyber-purple/20">
          <Button
            variant="outline"
            onClick={() => 
              handleCopyToClipboard(
                gitCommands.map(cmd => cmd.command).join('\n'), 
                "todos os comandos"
              )
            }
            className="w-full glass border-cyber-purple/30 hover:border-cyber-purple hover-glow btn-primary-hover"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Todos os Comandos Essenciais
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}