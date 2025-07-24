import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, RefreshCw, ExternalLink, Copy, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GitTip {
  id: number;
  title: string;
  description: string;
  command?: string;
  example?: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  category: 'produtividade' | 'segurança' | 'colaboração' | 'debug' | 'workflow';
  useful_when: string;
}

const gitTips: GitTip[] = [
  {
    id: 1,
    title: "Use git log --oneline para histórico limpo",
    description: "Visualize o histórico de commits de forma compacta e organizada",
    command: "git log --oneline --graph --decorate",
    example: "Mostra uma linha por commit com hash reduzido e mensagem",
    level: "iniciante",
    category: "produtividade",
    useful_when: "Quando você quer uma visão rápida do histórico do projeto"
  },
  {
    id: 2,
    title: "Configure aliases para comandos frequentes",
    description: "Crie atalhos para comandos Git que você usa constantemente",
    command: "git config --global alias.st status\ngit config --global alias.co checkout\ngit config --global alias.br branch",
    example: "Agora você pode usar 'git st' ao invés de 'git status'",
    level: "iniciante",
    category: "produtividade",
    useful_when: "Para acelerar seu workflow diário e digitar menos"
  },
  {
    id: 3,
    title: "Use git stash para mudanças temporárias",
    description: "Salve alterações rapidamente sem fazer commit",
    command: "git stash push -m \"WIP: nova feature\"\ngit stash pop",
    example: "Útil quando você precisa trocar de branch urgentemente",
    level: "iniciante",
    category: "workflow",
    useful_when: "Quando você está no meio de uma tarefa e precisa parar para fazer outra coisa"
  },
  {
    id: 4,
    title: "git add -p para commits mais precisos",
    description: "Adicione apenas partes específicas de um arquivo modificado",
    command: "git add -p arquivo.js",
    example: "Permite escolher quais mudanças incluir no próximo commit",
    level: "intermediário",
    category: "workflow",
    useful_when: "Quando você fez várias mudanças em um arquivo mas quer commitá-las separadamente"
  },
  {
    id: 5,
    title: "Use .gitignore_global para arquivos pessoais",
    description: "Configure um gitignore global para arquivos do seu sistema",
    command: "git config --global core.excludesfile ~/.gitignore_global",
    example: "Adicione .DS_Store, *.swp, .vscode/ no arquivo global",
    level: "intermediário",
    category: "produtividade",
    useful_when: "Para evitar commitar arquivos específicos do seu ambiente em todos os projetos"
  },
  {
    id: 6,
    title: "git reflog para recuperar commits 'perdidos'",
    description: "Veja o histórico completo de todas as ações do Git",
    command: "git reflog",
    example: "Encontre e recupere commits mesmo após reset --hard",
    level: "avançado",
    category: "debug",
    useful_when: "Quando você 'perdeu' commits após um reset ou rebase mal feito"
  },
  {
    id: 7,
    title: "git bisect para encontrar bugs",
    description: "Use busca binária para encontrar qual commit introduziu um bug",
    command: "git bisect start\ngit bisect bad HEAD\ngit bisect good v1.0",
    example: "Git automaticamente testa commits até encontrar o problema",
    level: "avançado",
    category: "debug",
    useful_when: "Quando você sabe que um bug foi introduzido mas não sabe em qual commit"
  },
  {
    id: 8,
    title: "Assine seus commits com GPG",
    description: "Adicione uma camada extra de segurança aos seus commits",
    command: "git config --global user.signingkey YOUR_KEY_ID\ngit config --global commit.gpgsign true",
    example: "Commits aparecerão como 'Verified' no GitHub",
    level: "avançado",
    category: "segurança",
    useful_when: "Em projetos que exigem verificação de autenticidade ou em repositórios empresariais"
  },
  {
    id: 9,
    title: "git worktree para múltiplas branches",
    description: "Trabalhe em várias branches simultaneamente em diretórios separados",
    command: "git worktree add ../feature-branch feature-branch",
    example: "Permite ter a main e feature em pastas diferentes",
    level: "avançado",
    category: "workflow",
    useful_when: "Quando você precisa alternar frequentemente entre branches ou testar rapidamente"
  },
  {
    id: 10,
    title: "use git blame -w para ignorar espaços",
    description: "Veja quem modificou cada linha ignorando mudanças de formatação",
    command: "git blame -w -M arquivo.js",
    example: "Ignora whitespace e detecta movimentação de código",
    level: "intermediário",
    category: "debug",
    useful_when: "Para encontrar o autor real de uma mudança, ignorando reformatações"
  },
  {
    id: 11,
    title: "git cherry-pick para commits específicos",
    description: "Aplique commits específicos de uma branch para outra",
    command: "git cherry-pick <commit-hash>\ngit cherry-pick <hash1>..<hash2>",
    example: "Útil para aplicar apenas algumas mudanças sem merge completo",
    level: "intermediário",
    category: "workflow",
    useful_when: "Quando você quer aplicar apenas alguns commits específicos de uma feature branch"
  },
  {
    id: 12,
    title: "git revert para desfazer commits",
    description: "Desfaça commits criando um novo commit reverso",
    command: "git revert HEAD\ngit revert <commit-hash>",
    example: "Cria um novo commit que desfaz as mudanças do commit especificado",
    level: "iniciante",
    category: "segurança",
    useful_when: "Quando você precisa desfazer mudanças que já foram publicadas"
  },
  {
    id: 13,
    title: "git clean para remover arquivos não rastreados",
    description: "Remova arquivos não versionados do seu diretório de trabalho",
    command: "git clean -n\ngit clean -fd",
    example: "Use -n para preview e -fd para forçar remoção de diretórios",
    level: "intermediário",
    category: "produtividade",
    useful_when: "Para limpar arquivos temporários ou de build que não estão no .gitignore"
  },
  {
    id: 14,
    title: "git submodule para dependências externas",
    description: "Gerencie repositórios Git como submódulos de outros projetos",
    command: "git submodule add <url> <path>\ngit submodule update --init",
    example: "Útil para incluir bibliotecas externas mantendo histórico separado",
    level: "avançado",
    category: "colaboração",
    useful_when: "Quando você precisa incluir outro repositório como dependência"
  },
  {
    id: 15,
    title: "git hooks para automação",
    description: "Automatize tarefas com scripts executados em eventos Git",
    command: "echo '#!/bin/sh\\nnpm test' > .git/hooks/pre-commit\nchmod +x .git/hooks/pre-commit",
    example: "Execute testes automaticamente antes de cada commit",
    level: "avançado",
    category: "workflow",
    useful_when: "Para automatizar validações, testes ou formatação de código"
  },
  {
    id: 16,
    title: "git archive para exportar código",
    description: "Exporte uma versão específica do código sem histórico Git",
    command: "git archive --format=zip HEAD > projeto.zip\ngit archive --format=tar.gz HEAD > projeto.tar.gz",
    example: "Cria um arquivo compactado do estado atual ou de um commit específico",
    level: "intermediário",
    category: "produtividade",
    useful_when: "Para distribuir código sem incluir o histórico Git completo"
  },
  {
    id: 17,
    title: "git shortlog para estatísticas de contribuição",
    description: "Veja um resumo das contribuições por autor",
    command: "git shortlog -sn\ngit shortlog --since='1 month ago'",
    example: "Mostra número de commits por desenvolvedor",
    level: "iniciante",
    category: "colaboração",
    useful_when: "Para revisar contribuições da equipe ou gerar relatórios"
  },
  {
    id: 18,
    title: "git sparse-checkout para projetos grandes",
    description: "Trabalhe apenas com partes específicas de um repositório grande",
    command: "git config core.sparseCheckout true\necho 'src/frontend/*' > .git/info/sparse-checkout\ngit read-tree -m -u HEAD",
    example: "Baixe apenas os diretórios que você precisa",
    level: "avançado",
    category: "produtividade",
    useful_when: "Em monorepos grandes onde você só trabalha com uma parte específica"
  },
  {
    id: 19,
    title: "git switch para alternar branches moderno",
    description: "Use o comando moderno para trocar entre branches",
    command: "git switch main\ngit switch -c nova-feature\ngit switch -",
    example: "Substituto moderno para git checkout com sintaxe mais clara",
    level: "iniciante",
    category: "workflow",
    useful_when: "Para ter uma sintaxe mais clara ao trabalhar com branches"
  },
  {
    id: 20,
    title: "git restore para restaurar arquivos",
    description: "Restaure arquivos modificados ou staged de forma moderna",
    command: "git restore arquivo.js\ngit restore --staged arquivo.js\ngit restore --source=HEAD~1 arquivo.js",
    example: "Comando moderno que substitui algumas funcionalidades do git checkout",
    level: "iniciante",
    category: "workflow",
    useful_when: "Para desfazer mudanças em arquivos de forma mais intuitiva"
  }
];

export function GitTipsOfTheDay() {
  const [currentTip, setCurrentTip] = useState<GitTip>(gitTips[0]);
  const { toast } = useToast();

  useEffect(() => {
    // Seleciona uma dica aleatória baseada na hora e minuto atual para garantir mudança
    const now = new Date();
    const seed = now.getHours() * 60 + now.getMinutes() + now.getDate() * 1440;
    const tipIndex = seed % gitTips.length;
    setCurrentTip(gitTips[tipIndex]);
  }, []);

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * gitTips.length);
    setCurrentTip(gitTips[randomIndex]);
  };

  const copyCommand = async () => {
    if (currentTip.command) {
      try {
        await navigator.clipboard.writeText(currentTip.command);
        toast({
          title: "Comando copiado!",
          description: "O comando foi copiado para sua área de transferência",
        });
      } catch (err) {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o comando",
          variant: "destructive",
        });
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return 'bg-cyber-green/20 text-cyber-green border-cyber-green/50';
      case 'intermediário': return 'bg-cyber-orange/20 text-cyber-orange border-cyber-orange/50';
      case 'avançado': return 'bg-destructive/20 text-destructive border-destructive/50';
      default: return 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'produtividade': return '⚡';
      case 'segurança': return '🛡️';
      case 'colaboração': return '👥';
      case 'debug': return '🐛';
      case 'workflow': return '🔄';
      default: return '💡';
    }
  };

  return (
    <Card className="glass glass-hover border-cyber-orange/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-cyber-orange animate-pulse" />
            <h3 className="text-lg font-semibold text-cyber-orange">Dica do Dia</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={getRandomTip}
            className="hover:bg-cyber-orange/10 hover:text-cyber-orange"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={getLevelColor(currentTip.level)}>
              {currentTip.level}
            </Badge>
            <Badge variant="outline" className="border-cyber-orange/30">
              {getCategoryIcon(currentTip.category)} {currentTip.category}
            </Badge>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">{currentTip.title}</h4>
            <p className="text-muted-foreground text-sm mb-3">{currentTip.description}</p>
            
            {currentTip.useful_when && (
              <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 mb-3">
                <p className="text-xs text-cyber-blue">
                  <strong>Útil quando:</strong> {currentTip.useful_when}
                </p>
              </div>
            )}

            {currentTip.command && (
              <div className="terminal rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyber-green" />
                    <span className="text-cyber-green text-xs font-mono">Terminal</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCommand}
                    className="h-6 px-2 text-cyber-green hover:bg-cyber-green/10"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <pre className="text-cyber-green text-xs font-mono whitespace-pre-wrap">
                  {currentTip.command}
                </pre>
              </div>
            )}

            {currentTip.example && (
              <p className="text-xs text-muted-foreground italic">
                💡 {currentTip.example}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}