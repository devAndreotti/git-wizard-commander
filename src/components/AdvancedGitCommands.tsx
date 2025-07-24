import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ChevronDown, ChevronRight, GitBranch, GitMerge, RotateCcw, History, FileText, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GitCommand {
  command: string;
  title: string;
  description: string;
  explanation: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface CommandCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  commands: GitCommand[];
}

export function AdvancedGitCommands() {
  const [openCommand, setOpenCommand] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Comando copiado para a área de transferência",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao copiar para a área de transferência",
        variant: "destructive",
      });
    }
  };

  const commandCategories: CommandCategory[] = [
    {
      id: "branch",
      name: "Branch Management",
      icon: GitBranch,
      commands: [
        {
          command: "git status",
          title: "Verificar Status dos Arquivos",
          description: "Mostra o status atual dos arquivos no repositório",
          explanation: "Exibe arquivos modificados, adicionados ao stage, não rastreados e a branch atual. É o comando mais usado para verificar o estado do repositório.",
          icon: FileText,
          color: "cyber-green"
        },
        {
          command: "git log --oneline",
          title: "Ver Histórico de Commits",
          description: "Mostra o histórico de commits de forma simplificada",
          explanation: "Exibe uma linha por commit com hash resumido e mensagem. Útil para visualizar rapidamente o histórico do projeto.",
          icon: History,
          color: "cyber-blue"
        },
        {
          command: "git diff",
          title: "Ver Diferenças nos Arquivos",
          description: "Mostra as diferenças entre arquivos modificados",
          explanation: "Compara o working directory com o stage area, mostrando exatamente quais linhas foram alteradas em cada arquivo.",
          icon: Terminal,
          color: "cyber-purple"
        },
        {
          command: "git branch -a",
          title: "Listar Todas as Branches",
          description: "Lista todas as branches locais e remotas",
          explanation: "Mostra todas as branches disponíveis no repositório, incluindo branches remotas. A branch atual aparece marcada com asterisco.",
          icon: GitBranch,
          color: "cyber-yellow"
        },
        {
          command: "git checkout -b feature/nova-funcionalidade",
          title: "Criar e Trocar para Nova Branch",
          description: "Cria uma nova branch e faz checkout para ela",
          explanation: "Comando conveniente que combina git branch e git checkout. Cria uma nova branch baseada na atual e já troca para ela.",
          icon: GitBranch,
          color: "cyber-green"
        },
        {
          command: "git branch -d feature-branch",
          title: "Deletar Branch Local",
          description: "Remove uma branch local que já foi mergeada",
          explanation: "Remove uma branch local de forma segura. Use -D (maiúsculo) para forçar a remoção mesmo sem merge.",
          icon: GitBranch,
          color: "destructive"
        }
      ]
    },
    {
      id: "merge",
      name: "Merge & Rebase",
      icon: GitMerge,
      commands: [
        {
          command: "git merge --no-ff feature",
          title: "Merge com Commit Explícito",
          description: "Força a criação de um commit de merge",
          explanation: "O --no-ff garante que sempre seja criado um commit de merge, mantendo o histórico da branch feature visível no log.",
          icon: GitMerge,
          color: "cyber-blue"
        },
        {
          command: "git rebase main",
          title: "Rebase na Branch Principal",
          description: "Reaplica commits em cima da branch main",
          explanation: "Move os commits da branch atual para o topo da main, criando um histórico linear. Reescreve o histórico, use com cuidado em branches compartilhadas.",
          icon: RotateCcw,
          color: "cyber-purple"
        },
        {
          command: "git merge --squash feature",
          title: "Merge com Squash",
          description: "Combina todos os commits da branch em um único commit",
          explanation: "Aplica todas as mudanças da branch feature como um único commit, sem preservar o histórico individual dos commits.",
          icon: GitMerge,
          color: "cyber-green"
        },
        {
          command: "git rebase -i HEAD~3",
          title: "Rebase Interativo",
          description: "Permite editar, reordenar ou combinar commits",
          explanation: "Abre um editor onde você pode escolher o que fazer com cada commit: edit, squash, reorder, drop, etc. Muito poderoso para limpar o histórico.",
          icon: Terminal,
          color: "cyber-pink"
        }
      ]
    },
    {
      id: "reset",
      name: "Reset & Restore",
      icon: RotateCcw,
      commands: [
        {
          command: "git reset --soft HEAD~1",
          title: "Reset Soft (Manter Stage)",
          description: "Desfaz commit mantendo mudanças no stage",
          explanation: "Remove o último commit do histórico mas mantém as mudanças no index (stage area). Útil para corrigir a mensagem do commit.",
          icon: RotateCcw,
          color: "cyber-green"
        },
        {
          command: "git reset --mixed HEAD~1",
          title: "Reset Mixed (Tirar do Stage)",
          description: "Desfaz commit e tira mudanças do stage",
          explanation: "Remove o commit e tira as mudanças do stage, mas mantém no working directory. É o comportamento padrão do git reset.",
          icon: RotateCcw,
          color: "cyber-yellow"
        },
        {
          command: "git reset --hard HEAD~1",
          title: "Reset Hard (Perder Mudanças)",
          description: "Desfaz commit e remove todas as mudanças",
          explanation: "⚠️ CUIDADO: Remove completamente o commit e todas as mudanças. Use apenas quando tem certeza que não precisa das alterações.",
          icon: RotateCcw,
          color: "destructive"
        },
        {
          command: "git restore .",
          title: "Restaurar Arquivos",
          description: "Desfaz mudanças no working directory",
          explanation: "Descarta todas as mudanças não commitadas, voltando os arquivos para o estado do último commit. Comando mais moderno que git checkout.",
          icon: FileText,
          color: "cyber-blue"
        }
      ]
    }
  ];

  const historyCommands = [
    {
      command: "git log --graph --oneline --all",
      title: "Histórico Visual Completo",
      description: "Mostra histórico de todas as branches com gráfico"
    },
    {
      command: "git log --stat",
      title: "Histórico com Estatísticas",
      description: "Inclui estatísticas de arquivos modificados"
    },
    {
      command: "git blame arquivo.txt",
      title: "Histórico por Linha",
      description: "Mostra quem modificou cada linha de um arquivo"
    },
    {
      command: "git log --author='nome'",
      title: "Histórico por Autor",
      description: "Filtra commits por autor específico"
    },
    {
      command: "git log --since='2 weeks ago'",
      title: "Histórico por Data",
      description: "Mostra commits a partir de uma data específica"
    },
    {
      command: "git reflog",
      title: "Histórico de Referências",
      description: "Mostra histórico de mudanças do HEAD, útil para recuperar commits perdidos"
    },
    {
      command: "git log --grep='fix'",
      title: "Buscar por Mensagem",
      description: "Filtra commits que contêm uma palavra na mensagem"
    },
    {
      command: "git shortlog -sn",
      title: "Resumo por Contribuidor",
      description: "Mostra número de commits por autor, ordenado"
    }
  ];

  return (
    <Card className="glass border-cyber-green/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-cyber-green/10 via-cyber-blue/10 to-cyber-purple/10 p-6">
          <Tabs defaultValue="advanced" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 glass">
              <TabsTrigger 
                value="advanced" 
                className="data-[state=active]:bg-cyber-green/20 data-[state=active]:text-cyber-green"
              >
                Comandos Avançados
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue"
              >
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advanced" className="space-y-4">
              {commandCategories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <Card key={category.id} className="glass border-cyber-purple/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <CategoryIcon className="w-6 h-6 text-cyber-purple" />
                        <h3 className="text-xl font-bold text-cyber-purple neon-text">
                          {category.name}
                        </h3>
                      </div>
                      
                      <div className="space-y-2">
                        {category.commands.map((cmd, index) => {
                          const Icon = cmd.icon;
                          const isOpen = openCommand === cmd.command;
                          
                          return (
                            <Collapsible
                              key={cmd.command}
                              open={isOpen}
                              onOpenChange={(open) => setOpenCommand(open ? cmd.command : null)}
                            >
                              <CollapsibleTrigger asChild>
                                <div 
                                  className="w-full flex items-center justify-between p-3 rounded-lg
                                           glass glass-hover border-cyber-blue/30 hover:border-cyber-blue/60
                                           cursor-pointer transition-all duration-300 interactive-element group"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Icon className={`w-4 h-4 text-${cmd.color} flex-shrink-0`} />
                                    <div className="flex-1 min-w-0">
                                      <span className="font-mono text-cyber-blue text-sm bg-background/50 px-2 py-1 rounded block">
                                        {cmd.command}
                                      </span>
                                      <p className="text-xs text-muted-foreground mt-1">{cmd.description}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="glass"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyToClipboard(cmd.command);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 interactive-element transition-all duration-300 ease-out hover:scale-105 flex-shrink-0"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <div className="flex-shrink-0 ml-2">
                                    {isOpen ? (
                                      <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                                    )}
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <div className="ml-7 mr-4 mb-2 p-3 rounded-lg bg-background/30 border border-cyber-purple/20">
                                  <h4 className={`text-${cmd.color} font-semibold mb-2 flex items-center gap-2`}>
                                    <Icon className="w-4 h-4" />
                                    {cmd.title}
                                  </h4>
                                  <p className="text-sm text-foreground/90 leading-relaxed">
                                    {cmd.explanation}
                                  </p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="glass border-cyber-blue/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <History className="w-6 h-6 text-cyber-blue" />
                    <h3 className="text-xl font-bold text-cyber-blue neon-text">
                      Comandos de Histórico
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {historyCommands.map((cmd, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg glass glass-hover border-cyber-blue/30 hover:border-cyber-blue/60 transition-all duration-300 group"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="font-mono text-cyber-blue text-sm bg-background/50 px-2 py-1 rounded block">
                            {cmd.command}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">{cmd.description}</p>
                        </div>
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => handleCopyToClipboard(cmd.command)}
                          className="opacity-0 group-hover:opacity-100 interactive-element transition-all duration-300 ease-out hover:scale-105 flex-shrink-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}