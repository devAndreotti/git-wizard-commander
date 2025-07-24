import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookOpen, GitBranch, Copy, Check, ArrowLeft, Terminal, Users, Lightbulb, Star, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { SplineBackground } from "@/components/SplineBackground";
import { useToast } from "@/hooks/use-toast";

const GitKnowledgeBase = () => {
  // Estado para controle dos comandos copiados
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Função para copiar texto para a área de transferência
   * @param text - Texto a ser copiado
   * @param commandName - Nome do comando para exibir na notificação
   */
  const copyToClipboard = async (text: string, commandName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(commandName);
      toast({
        title: "✅ Comando Copiado!",
        description: `"${commandName}" foi copiado para sua área de transferência`,
      });
      // Remove o estado após 2 segundos
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível copiar o comando. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Comandos Git organizados por categoria com informações completas
  const gitCommands = [
    // Comandos Básicos
    {
      command: "git init",
      description: "Inicializa um novo repositório Git",
      usage: "git init [nome-do-projeto]",
      example: "git init meu-projeto",
      category: "básico",
      scenario: "Quando você está começando um novo projeto e quer controle de versão",
      tips: "Use 'git init .' para inicializar no diretório atual"
    },
    {
      command: "git clone",
      description: "Clona um repositório remoto para sua máquina",
      usage: "git clone <url-do-repositorio> [pasta-destino]",
      example: "git clone https://github.com/usuario/projeto.git minha-pasta",
      category: "básico",
      scenario: "Quando você quer trabalhar em um projeto existente no GitHub/GitLab",
      tips: "Use '--depth 1' para clonar apenas o último commit e economizar espaço"
    },
    {
      command: "git add",
      description: "Adiciona arquivos ao staging area (área de preparação)",
      usage: "git add <arquivo> | git add . | git add -A",
      example: "git add src/components/Header.tsx",
      category: "básico",
      scenario: "Antes de fazer um commit, você precisa adicionar os arquivos modificados",
      tips: "Use 'git add .' para adicionar todos os arquivos modificados"
    },
    {
      command: "git commit",
      description: "Salva as mudanças do staging area no histórico do Git",
      usage: "git commit -m 'mensagem do commit'",
      example: "git commit -m 'feat: adicionar componente de navegação'",
      category: "básico",
      scenario: "Depois de adicionar arquivos, você faz commit para salvar as mudanças",
      tips: "Use mensagens descritivas seguindo convenções como Conventional Commits"
    },
    {
      command: "git push",
      description: "Envia commits locais para o repositório remoto",
      usage: "git push [remote] [branch]",
      example: "git push origin main",
      category: "básico",
      scenario: "Para compartilhar suas mudanças com outros desenvolvedores",
      tips: "Use 'git push -u origin branch-name' na primeira vez para vincular a branch"
    },
    {
      command: "git pull",
      description: "Baixa e integra mudanças do repositório remoto",
      usage: "git pull [remote] [branch]",
      example: "git pull origin main",
      category: "básico",
      scenario: "Para atualizar seu código local com as mudanças dos outros",
      tips: "Sempre faça pull antes de começar a trabalhar para evitar conflitos"
    },
    {
      command: "git status",
      description: "Mostra o estado atual dos arquivos no repositório",
      usage: "git status",
      example: "git status",
      category: "básico",
      scenario: "Para ver quais arquivos foram modificados, adicionados ou removidos",
      tips: "Use frequentemente para acompanhar o que está acontecendo"
    },
    {
      command: "git log",
      description: "Exibe o histórico de commits",
      usage: "git log [opções]",
      example: "git log --oneline --graph",
      category: "básico",
      scenario: "Para ver o histórico de mudanças e quem fez o quê",
      tips: "Use '--oneline' para uma visualização mais compacta"
    },

    // Comandos de Branch
    {
      command: "git branch",
      description: "Gerencia branches (ramificações) do projeto",
      usage: "git branch [nome-da-branch] | git branch -d <branch>",
      example: "git branch feature/nova-funcionalidade",
      category: "branch",
      scenario: "Para criar uma nova funcionalidade sem afetar o código principal",
      tips: "Use 'git branch -a' para ver todas as branches, incluindo remotas"
    },
    {
      command: "git checkout",
      description: "Muda entre branches ou restaura arquivos",
      usage: "git checkout <nome-da-branch> | git checkout -b <nova-branch>",
      example: "git checkout -b feature/login-system",
      category: "branch",
      scenario: "Para trabalhar em uma branch específica ou criar uma nova",
      tips: "Use 'git switch' (Git 2.23+) como alternativa moderna ao checkout"
    },
    {
      command: "git merge",
      description: "Combina mudanças de uma branch com outra",
      usage: "git merge <nome-da-branch>",
      example: "git merge feature/nova-funcionalidade",
      category: "branch",
      scenario: "Quando sua funcionalidade está pronta e você quer juntar com a main",
      tips: "Sempre teste antes de fazer merge e considere usar '--no-ff' para preservar histórico"
    },
    {
      command: "git switch",
      description: "Comando moderno para trocar de branch (Git 2.23+)",
      usage: "git switch <branch> | git switch -c <nova-branch>",
      example: "git switch -c feature/user-profile",
      category: "branch",
      scenario: "Alternativa mais intuitiva ao git checkout para trocar de branch",
      tips: "Mais seguro que checkout pois é específico para branches"
    },

    // Comandos Avançados
    {
      command: "git stash",
      description: "Salva mudanças temporariamente sem fazer commit",
      usage: "git stash [push -m 'mensagem'] | git stash pop",
      example: "git stash push -m 'WIP: implementando autenticação'",
      category: "avançado",
      scenario: "Quando você precisa mudar de branch rapidamente mas não quer fazer commit",
      tips: "Use 'git stash list' para ver todos os stashes salvos"
    },
    {
      command: "git reset",
      description: "Desfaz commits ou mudanças no staging",
      usage: "git reset [--soft|--mixed|--hard] <commit>",
      example: "git reset --soft HEAD~1",
      category: "avançado",
      scenario: "Quando você fez um commit errado e quer desfazer mantendo as mudanças",
      tips: "--soft mantém as mudanças, --hard remove tudo (cuidado!)"
    },
    {
      command: "git rebase",
      description: "Reorganiza o histórico de commits",
      usage: "git rebase <branch-base> | git rebase -i <commit>",
      example: "git rebase -i HEAD~3",
      category: "avançado",
      scenario: "Para manter um histórico linear e limpo antes de fazer merge",
      tips: "Use rebase interativo (-i) para combinar, editar ou reordenar commits"
    },
    {
      command: "git cherry-pick",
      description: "Aplica um commit específico de outra branch",
      usage: "git cherry-pick <commit-hash>",
      example: "git cherry-pick abc123def",
      category: "avançado",
      scenario: "Quando você quer apenas um commit específico de outra branch",
      tips: "Útil para hotfixes que precisam ser aplicados em várias branches"
    },
    {
      command: "git reflog",
      description: "Mostra histórico de todas as ações do Git",
      usage: "git reflog",
      example: "git reflog",
      category: "avançado", 
      scenario: "Para recuperar commits 'perdidos' ou ver histórico completo",
      tips: "Seu salva-vidas para recuperar trabalho que parecia perdido"
    }
  ];

  // Melhores práticas para uso eficiente do Git
  const bestPractices = [
    {
      title: "📝 Mensagens de Commit Claras e Padronizadas",
      description: "Use convenções como Conventional Commits para manter histórico organizado",
      example: "✅ 'feat(auth): implementar login com OAuth2'\n✅ 'fix(ui): corrigir alinhamento do header em mobile'\n✅ 'docs: atualizar README com instruções de deploy'\n\n❌ 'mudanças'\n❌ 'fix'\n❌ 'atualização'",
      icon: "📝",
      category: "comunicação"
    },
    {
      title: "🔄 Commits Atômicos e Frequentes",
      description: "Cada commit deve representar uma mudança lógica completa e independente",
      example: "✅ Um commit por funcionalidade\n✅ Commits que passam nos testes\n✅ Mudanças que fazem sentido sozinhas\n\n❌ Vários bugs em um commit\n❌ Commits com código quebrado\n❌ Mudanças não relacionadas juntas",
      icon: "🔄",
      category: "organização"
    },
    {
      title: "🌿 Estratégia de Branching Consistente",
      description: "Use uma estratégia clara para organizar o trabalho em equipe",
      example: "✅ main/master: código de produção\n✅ develop: integração de features\n✅ feature/: novas funcionalidades\n✅ hotfix/: correções urgentes\n✅ release/: preparação de versões",
      icon: "🌿",
      category: "workflow"
    },
    {
      title: "🧪 Teste Antes de Publicar",
      description: "Garanta que seu código funciona antes de compartilhar",
      example: "✅ npm test && git push\n✅ npm run lint && npm run build\n✅ Testar funcionalidade manualmente\n✅ Verificar que não quebrou outras features\n\n❌ git push sem testar\n❌ Assumir que 'vai funcionar'",
      icon: "🧪",
      category: "qualidade"
    },
    {
      title: "🔍 Code Review Efetivo",
      description: "Use Pull/Merge Requests para manter qualidade do código",
      example: "✅ Descrição clara do que foi mudado\n✅ Screenshots/GIFs para mudanças visuais\n✅ Checklist de validação\n✅ Reviewer dedicado\n✅ Discussão construtiva",
      icon: "🔍",
      category: "colaboração"
    },
    {
      title: "📚 Documentação Atualizada",
      description: "Mantenha README, changelogs e documentação sempre atualizados",
      example: "✅ README com instruções claras\n✅ CHANGELOG.md com mudanças\n✅ Comentários no código quando necessário\n✅ Wiki ou docs para processos\n\n❌ Documentação desatualizada\n❌ Código sem contexto",
      icon: "📚",
      category: "documentação"
    },
    {
      title: "🛡️ Segurança e Backup",
      description: "Proteja seu trabalho e informações sensíveis",
      example: "✅ .gitignore configurado corretamente\n✅ Variáveis de ambiente separadas\n✅ Backup regular do repositório\n✅ SSH keys configuradas\n\n❌ Senhas no código\n❌ Arquivos sensíveis commitados",
      icon: "🛡️",
      category: "segurança"
    },
    {
      title: "⚡ Performance e Otimização",
      description: "Mantenha seu repositório rápido e eficiente",
      example: "✅ .gitignore bem configurado\n✅ Git LFS para arquivos grandes\n✅ Limpeza periódica com git gc\n✅ Shallow clones quando apropriado\n\n❌ Arquivos binários grandes no repo\n❌ Histórico desnecessário",
      icon: "⚡",
      category: "performance"
    }
  ];

  // Cenários reais de uso do Git no dia a dia
  const realWorldScenarios = [
    {
      title: "🚀 Desenvolvendo uma Nova Feature",
      steps: [
        "# 1. Atualizar branch principal",
        "git checkout main",
        "git pull origin main",
        "",
        "# 2. Criar nova branch para a feature",
        "git checkout -b feature/sistema-carrinho-compras",
        "",
        "# 3. Desenvolver e fazer commits incrementais", 
        "git add src/components/Cart.tsx",
        "git commit -m 'feat(cart): criar componente básico do carrinho'",
        "",
        "git add src/hooks/useCart.ts",
        "git commit -m 'feat(cart): adicionar hook para gerenciar estado'",
        "",
        "git add src/pages/CartPage.tsx",
        "git commit -m 'feat(cart): implementar página do carrinho'",
        "",
        "# 4. Testar e publicar",
        "npm test",
        "git push origin feature/sistema-carrinho-compras",
        "",
        "# 5. Criar Pull Request no GitHub/GitLab"
      ],
      scenario: "Fluxo completo para desenvolver uma nova funcionalidade de forma organizada",
      difficulty: "Iniciante",
      timeEstimate: "30-60 min"
    },
    {
      title: "🚨 Hotfix para Bug Crítico em Produção",
      steps: [
        "# 1. Partir da versão de produção",
        "git checkout main",
        "git pull origin main",
        "",
        "# 2. Criar branch de hotfix",
        "git checkout -b hotfix/fix-login-error",
        "",
        "# 3. Corrigir o problema rapidamente",
        "git add src/auth/loginService.ts",
        "git commit -m 'fix(auth): corrigir erro de validação no login'",
        "",
        "# 4. Testar a correção",
        "npm run test:unit",
        "npm run test:e2e",
        "",
        "# 5. Deploy imediato",
        "git push origin hotfix/fix-login-error",
        "# Fazer merge direto na main após aprovação",
        "git checkout main",
        "git merge hotfix/fix-login-error",
        "git push origin main",
        "",
        "# 6. Aplicar fix também na develop",
        "git checkout develop", 
        "git merge hotfix/fix-login-error",
        "git push origin develop"
      ],
      scenario: "Como lidar com bugs críticos que precisam de correção imediata",
      difficulty: "Intermediário",
      timeEstimate: "15-30 min"
    },
    {
      title: "💾 Salvando Trabalho em Progresso",
      steps: [
        "# Situação: você está codificando mas precisa mudar de branch urgentemente",
        "",
        "# 1. Salvar trabalho atual",
        "git add .",
        "git stash push -m 'WIP: implementando filtros da página de produtos'",
        "",
        "# 2. Trocar para outra branch e trabalhar",
        "git checkout feature/bug-urgente",
        "# ... fazer o trabalho urgente ...",
        "git add .",
        "git commit -m 'fix: corrigir bug no header mobile'",
        "git push origin feature/bug-urgente",
        "",
        "# 3. Voltar ao trabalho anterior",
        "git checkout feature/filtros-produtos",
        "git stash pop",
        "",
        "# 4. Continuar de onde parou",
        "# ... continuar implementando os filtros ..."
      ],
      scenario: "Como pausar trabalho sem perder progresso quando surge algo urgente",
      difficulty: "Iniciante",
      timeEstimate: "5-10 min"
    },
    {
      title: "🔄 Resolvendo Conflitos de Merge",
      steps: [
        "# Situação: conflitos ao fazer merge ou pull",
        "",
        "# 1. Tentar fazer merge",
        "git checkout main",
        "git pull origin main",
        "git checkout feature/minha-branch",
        "git merge main",
        "# CONFLICT aparece!",
        "",
        "# 2. Ver arquivos com conflito",
        "git status",
        "",
        "# 3. Abrir arquivos e resolver conflitos",
        "# Editar arquivos, remover <<<<<<< ======= >>>>>>>",
        "# Escolher qual código manter",
        "",
        "# 4. Marcar conflitos como resolvidos",
        "git add arquivo-conflitante.ts",
        "",
        "# 5. Finalizar merge",
        "git commit -m 'merge: resolver conflitos com main'",
        "",
        "# 6. Testar e publicar",
        "npm test",
        "git push origin feature/minha-branch"
      ],
      scenario: "Como resolver conflitos que aparecem ao integrar mudanças",
      difficulty: "Intermediário",
      timeEstimate: "10-30 min"
    },
    {
      title: "🔙 Desfazendo Mudanças Indesejadas",
      steps: [
        "# Cenário 1: Desfazer mudanças não commitadas",
        "git status  # ver o que foi mudado",
        "git checkout -- arquivo.ts  # restaurar arquivo específico",
        "git reset --hard HEAD  # descartar TODAS as mudanças",
        "",
        "# Cenário 2: Desfazer último commit (mantendo mudanças)",
        "git reset --soft HEAD~1",
        "# Agora você pode editar e commitar novamente",
        "",
        "# Cenário 3: Desfazer commits públicos (safe)",
        "git revert HEAD  # cria novo commit desfazendo o anterior",
        "git revert HEAD~2  # desfaz commit de 2 posições atrás",
        "",
        "# Cenário 4: Recuperar arquivo deletado",
        "git checkout HEAD~1 -- arquivo-deletado.ts",
        "",
        "# Cenário 5: Voltar arquivo para versão específica",
        "git log --oneline arquivo.ts  # ver histórico",
        "git checkout abc1234 -- arquivo.ts  # restaurar versão específica"
      ],
      scenario: "Técnicas seguras para desfazer diferentes tipos de mudanças",
      difficulty: "Intermediário",
      timeEstimate: "5-15 min"
    },
    {
      title: "👥 Colaboração em Equipe",
      steps: [
        "# Início do dia - sincronizar com a equipe",
        "git checkout main",
        "git pull origin main",
        "",
        "# Atualizar sua branch de feature",
        "git checkout feature/minha-feature",
        "git rebase main  # aplicar mudanças da main na sua branch",
        "",
        "# Se houver conflitos, resolver e continuar",
        "# git add . && git rebase --continue",
        "",
        "# Trabalhar normalmente",
        "# ... fazer commits ...",
        "",
        "# Antes de fazer Push Request",
        "git rebase -i HEAD~3  # limpar histórico de commits",
        "# Combinar commits relacionados",
        "",
        "# Push final",
        "git push origin feature/minha-feature --force-with-lease",
        "",
        "# Criar Pull Request com:",
        "# - Descrição clara",
        "# - Screenshots se for UI",
        "# - Checklist de teste"
      ],
      scenario: "Fluxo de trabalho eficiente para equipes de desenvolvimento",
      difficulty: "Avançado",
      timeEstimate: "Workflow diário"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SplineBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            asChild
            variant="ghost"
            className="glass border-cyber-purple/30 hover:border-cyber-purple nav-btn hover-glow"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
          
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyber-purple to-cyber-pink bg-clip-text text-transparent flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-cyber-purple" />
              Base de Conhecimento Git
            </h1>
            <p className="text-muted-foreground mt-2">
              Documentação completa, melhores práticas e exemplos reais
            </p>
          </div>
        </div>

        <Tabs defaultValue="commands" className="space-y-6">
          <TabsList className="glass border-cyber-purple/30 hover-glow transition-all duration-300">
            <TabsTrigger 
              value="commands" 
              className="data-[state=active]:bg-cyber-purple/20 hover:bg-cyber-purple/10 transition-all duration-200 flex items-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              Comandos Git
            </TabsTrigger>
            <TabsTrigger 
              value="practices" 
              className="data-[state=active]:bg-cyber-purple/20 hover:bg-cyber-purple/10 transition-all duration-200 flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Melhores Práticas
            </TabsTrigger>
            <TabsTrigger 
              value="scenarios" 
              className="data-[state=active]:bg-cyber-purple/20 hover:bg-cyber-purple/10 transition-all duration-200 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Casos Reais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commands" className="space-y-6">
            <div className="grid gap-6">
              {["básico", "branch", "avançado"].map((category) => (
                <Card key={category} className="glass glass-hover border-cyber-purple/50 hover:border-cyber-purple/70 transition-all duration-300 hover:shadow-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-cyber-purple">
                      <div className="p-2 rounded-lg bg-cyber-purple/20">
                        {category === "básico" ? <Target className="w-5 h-5" /> : 
                         category === "branch" ? <GitBranch className="w-5 h-5" /> : 
                         <Zap className="w-5 h-5" />}
                      </div>
                      Comandos {category === "básico" ? "Básicos" : category === "branch" ? "de Branch" : "Avançados"}
                      <Badge variant="outline" className="ml-auto text-xs">
                        {gitCommands.filter(cmd => cmd.category === category).length} comandos
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-2">
                      {gitCommands
                        .filter(cmd => cmd.category === category)
                        .map((cmd, index) => (
                          <AccordionItem key={index} value={`${category}-${index}`} className="border-cyber-purple/20 hover:border-cyber-purple/40 transition-colors duration-200">
                            <AccordionTrigger className="hover:text-cyber-purple hover:no-underline transition-colors duration-200 group command-card-trigger">
                              <div className="flex items-center gap-3 w-full">
                                {/* Badge com comando Git - sem efeito de link */}
                                <Badge className="bg-cyber-purple/20 text-cyber-purple group-hover:bg-cyber-purple/30 group-hover:shadow-[0_0_8px_hsl(var(--cyber-purple)/0.3)] transition-all duration-300 font-mono px-3 py-1.5">
                                  {cmd.command}
                                </Badge>
                                {/* Descrição sem efeito de underline */}
                                <span className="text-left flex-1 font-medium">{cmd.description}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                              <div className="grid gap-4">
                                <div>
                                  <h4 className="font-medium text-cyber-green mb-2 flex items-center gap-2">
                                    📖 Sintaxe:
                                  </h4>
                                  <div className="terminal rounded-lg p-3 flex items-center justify-between hover:bg-background/60 transition-colors duration-200">
                                    <code className="text-cyber-blue font-mono">{cmd.usage}</code>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(cmd.usage, cmd.command)}
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
                                
                                <div>
                                  <h4 className="font-medium text-cyber-orange mb-2 flex items-center gap-2">
                                    💡 Exemplo Prático:
                                  </h4>
                                  <div className="terminal rounded-lg p-3 flex items-center justify-between hover:bg-background/60 transition-colors duration-200">
                                    <code className="text-cyber-blue font-mono">{cmd.example}</code>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(cmd.example, `${cmd.command}-example`)}
                                      className="nav-btn hover:bg-cyber-purple/20"
                                    >
                                      {copiedCommand === `${cmd.command}-example` ? (
                                        <Check className="w-3 h-3 text-cyber-green" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-cyber-pink mb-2 flex items-center gap-2">
                                    🎯 Quando Usar:
                                  </h4>
                                  <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded-lg">{cmd.scenario}</p>
                                </div>

                                {cmd.tips && (
                                  <div>
                                    <h4 className="font-medium text-cyber-green mb-2 flex items-center gap-2">
                                      ⚡ Dica Pro:
                                    </h4>
                                    <p className="text-cyber-green text-sm bg-cyber-green/10 p-3 rounded-lg border border-cyber-green/20">{cmd.tips}</p>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practices" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {bestPractices.map((practice, index) => (
                <Card key={index} className="glass glass-hover border-cyber-purple/50 hover:border-cyber-purple/70 transition-all duration-300 hover:shadow-glow group">
                  <CardHeader>
                    <CardTitle className="text-cyber-green flex items-center gap-3 group-hover:text-cyber-green/90 transition-colors duration-200">
                      <div className="p-2 rounded-lg bg-cyber-green/20">
                        <Star className="w-5 h-5" />
                      </div>
                      {practice.title}
                    </CardTitle>
                    <Badge variant="outline" className="self-start text-xs">
                      {practice.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{practice.description}</p>
                    <div className="terminal rounded-lg p-4 hover:bg-background/60 transition-colors duration-200">
                      <pre className="text-sm text-cyber-blue whitespace-pre-wrap font-mono leading-relaxed">{practice.example}</pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid gap-6">
              {realWorldScenarios.map((scenario, index) => (
                <Card key={index} className="glass glass-hover border-cyber-purple/50 hover:border-cyber-purple/70 transition-all duration-300 hover:shadow-glow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <CardTitle className="text-cyber-orange flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyber-orange/20">
                          <Users className="w-5 h-5" />
                        </div>
                        {scenario.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {scenario.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-cyber-blue">
                          {scenario.timeEstimate}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded-lg">{scenario.scenario}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="terminal rounded-lg p-4 space-y-1 hover:bg-background/60 transition-colors duration-200">
                      {scenario.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-2 min-h-[1.5rem]">
                          {step.startsWith('#') ? (
                            // Comentário
                            <div className="text-cyber-green text-sm font-mono w-full py-1">
                              {step}
                            </div>
                          ) : step.trim() === '' ? (
                            // Linha vazia
                            <div className="w-full h-2"></div>
                          ) : (
                            // Comando
                            <>
                              <span className="text-cyber-green text-sm font-mono flex-shrink-0 mt-0.5">$</span>
                              <code className="text-cyber-blue text-sm font-mono flex-1">{step}</code>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GitKnowledgeBase;