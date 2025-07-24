import { useState } from "react";
import { GitCommitBuilder } from "@/components/GitCommitBuilder";
import { GitStepsBuilder } from "@/components/GitStepsBuilder";
import { AdvancedGitCommands } from "@/components/AdvancedGitCommands";
import { GitCommandExplainer } from "@/components/GitCommandExplainer";
import { GitQuizzes } from "@/components/GitQuizzes";
import { GitProgressTracker } from "@/components/GitProgressTracker";
import { GitTipsOfTheDay } from "@/components/GitTipsOfTheDay";
import { SplineBackground } from "@/components/SplineBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Github, Command, Sparkles, Copy, ExternalLink, Zap, Star, Rocket, BookOpen, Target, FileText, Edit, HelpCircle, Mail, GitBranch, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function GitCommandBuilder() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const { toast } = useToast();

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Comandos copiados para a área de transferência",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao copiar para a área de transferência",
        variant: "destructive",
      });
    }
  };


  const features = [
    {
      icon: Command,
      title: "Comandos Gerados",
      description: "Configure os campos acima para gerar os comandos...",
      color: "cyber-purple"
    },
    {
      icon: Copy,
      title: "Copiar Comandos",
      description: "Use o padrão Conventional Commits para manter seus commits organizados",
      color: "cyber-green"
    },
    {
      icon: Github,
      title: "GitHub Integration",
      description: "Construa seus comandos Git passo a passo sem commits padronizados",
      color: "cyber-blue"
    }
  ];

  return (
    <>
      {/* Fundo Spline Interativo */}
      <SplineBackground />
      
      {/* Conteúdo Principal */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8 space-y-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-8 py-16">
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="animate-float">
                  <Terminal className="w-12 h-12 text-cyber-purple" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black bg-gradient-primary bg-clip-text text-transparent">
                  Git Command Builder
                </h1>
                <div className="animate-float" style={{ animationDelay: '1s' }}>
                  <Rocket className="w-12 h-12 text-cyber-blue" />
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Construa seus comandos Git passo a passo com commits padronizados
                <br />
                <span className="text-cyber-green font-semibold">Interface cyberpunk interativa</span>
              </p>
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group glass glass-hover px-6 py-3 rounded-full border-cyber-purple/30 
                             hover:border-cyber-purple/60 transition-all duration-300 cursor-pointer
                             hover:scale-105 hover:shadow-glow"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyber-purple group-hover:text-cyber-blue transition-colors" />
                      <span className="text-sm font-medium text-foreground group-hover:text-cyber-blue transition-colors">
                        {feature.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button 
                variant="cyber" 
                size="lg" 
                className="text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
                onClick={() => {
                  const stepsSection = document.getElementById('git-steps');
                  stepsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Star className="w-5 h-5" />
                Começar Agora
                <Sparkles className="w-5 h-5" />
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 glass border-cyber-blue/30 hover:border-cyber-blue knowledge-btn"
              >
                <Link to="/knowledge-base">
                  <BookOpen className="w-5 h-5" />
                  Base de Conhecimento
                </Link>
              </Button>
              <Button 
                variant="glass" 
                size="lg"
                className="text-lg px-8 py-4 interactive-element transition-all duration-300 ease-out hover:scale-105"
              >
                <Github className="w-5 h-5" />
                Ver no GitHub
              </Button>
            </div>
          </div>


          {/* Main Content Grid */}
          <div id="git-steps" className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <GitStepsBuilder
                  repositoryUrl={repositoryUrl}
                  onRepositoryUrlChange={setRepositoryUrl}
                  commitMessage={commitMessage}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <GitCommitBuilder onCommitChange={setCommitMessage} />
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <GitTipsOfTheDay />
              </div>
            </div>
          </div>

          {/* Git Quizzes Section */}
          <div className="space-y-8">
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent to-cyber-orange"></div>
                <Target className="w-8 h-8 text-cyber-orange animate-pulse" />
                <h2 className="text-3xl font-bold text-cyber-orange neon-text">
                  Desafios & Quizzes
                </h2>
                <Target className="w-8 h-8 text-cyber-orange animate-pulse" />
                <div className="w-12 h-1 bg-gradient-to-l from-transparent to-cyber-orange"></div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Teste seus conhecimentos sobre Git com nossos desafios interativos
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
              <GitQuizzes />
            </div>
          </div>

          {/* Progress Overview Section */}
          <div className="space-y-8">
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent to-cyber-blue"></div>
                <TrendingUp className="w-8 h-8 text-cyber-blue animate-float" />
                <h2 className="text-3xl font-bold text-cyber-blue neon-text">
                  Progresso & Aprendizado
                </h2>
                <TrendingUp className="w-8 h-8 text-cyber-blue animate-float" />
                <div className="w-12 h-1 bg-gradient-to-l from-transparent to-cyber-blue"></div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Acompanhe seu desenvolvimento e descubra dicas valiosas
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
              <GitProgressTracker />
            </div>
          </div>

          {/* Advanced Commands Section */}
          <div className="space-y-8">
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent to-cyber-green"></div>
                <Zap className="w-8 h-8 text-cyber-green animate-glow-pulse" />
                <h2 className="text-3xl font-bold text-cyber-green neon-text">
                  Comandos Avançados
                </h2>
                <Zap className="w-8 h-8 text-cyber-green animate-glow-pulse" />
                <div className="w-12 h-1 bg-gradient-to-l from-transparent to-cyber-green"></div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore comandos Git avançados, gerencie histórico e exporte scripts
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
              <AdvancedGitCommands />
            </div>
          </div>

          {/* Modern Footer */}
          <div className="animate-fade-in-up" style={{ animationDelay: '1.7s' }}>
            <Card className="glass border-cyber-green/30 hover:border-cyber-green/60 overflow-hidden footer-enhanced transition-all duration-500 hover:shadow-2xl hover:shadow-cyber-green/20">
              <CardContent className="p-8 lg:p-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="relative">
                      <GitBranch className="w-12 h-12 text-cyber-green drop-shadow-lg" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-purple rounded-full animate-pulse shadow-lg shadow-cyber-purple/50"></div>
                    </div>
                    <h3 className="text-4xl font-bold text-cyber-green neon-text tracking-wide">Git Command Builder</h3>
                  </div>
                  <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
                    A maneira mais moderna e interativa de aprender Git. Construa comandos, pratique com quizzes e domine o controle de versão com nossa interface cyberpunk inovadora.
                  </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Funcionalidades */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyber-blue flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Funcionalidades
                    </h4>
                    <div className="space-y-2">
                      {/* Navegação para Etapas Básicas */}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-cyber-purple hover:bg-cyber-purple/10 transition-all duration-300 w-full justify-start group"
                        onClick={() => {
                          const stepsSection = document.querySelector('#git-steps');
                          stepsSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <Zap className="w-4 h-4 mr-2 group-hover:text-cyber-purple transition-colors" />
                        Etapas Básicas
                      </Button>
                      
                      {/* Navegação para Desafios Git */}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-cyber-green hover:bg-cyber-green/10 transition-all duration-300 w-full justify-start group"
                        onClick={() => {
                          const quizSection = document.querySelector('h2:has-text("Desafios & Quizzes")');
                          quizSection?.parentElement?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <Target className="w-4 h-4 mr-2 group-hover:text-cyber-green transition-colors" />
                        Desafios Git
                      </Button>
                      
                      {/* Navegação para Comandos Avançados */}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-cyber-orange hover:bg-cyber-orange/10 transition-all duration-300 w-full justify-start group"
                        onClick={() => {
                          const commandsSection = document.querySelector('h2:contains("Comandos Avançados")');
                          commandsSection?.parentElement?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <Terminal className="w-4 h-4 mr-2 group-hover:text-cyber-orange transition-colors" />
                        Comandos Avançados
                      </Button>
                    </div>
                  </div>

                  {/* Recursos */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyber-purple flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Recursos
                    </h4>
                    <div className="space-y-2">
                      {/* Link para Base de Conhecimento */}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-cyber-blue hover:bg-cyber-blue/10 transition-all duration-300 w-full justify-start group"
                        asChild
                      >
                        <Link to="/knowledge-base">
                          <FileText className="w-4 h-4 mr-2 group-hover:text-cyber-blue transition-colors" />
                          Base de Conhecimento
                        </Link>
                      </Button>
                      
                      {/* Navegação para Construtor de Commits */}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-cyber-green hover:bg-cyber-green/10 transition-all duration-300 w-full justify-start group"
                        onClick={() => {
                          const commitsSection = document.querySelector('.xl\\:col-span-2');
                          commitsSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2 group-hover:text-cyber-green transition-colors" />
                        Construtor de Commits
                      </Button>
                      
                      {/* Voltar ao topo */}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-cyber-purple hover:bg-cyber-purple/10 transition-all duration-300 w-full justify-start group"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <HelpCircle className="w-4 h-4 mr-2 group-hover:text-cyber-purple transition-colors" />
                        Voltar ao Topo
                      </Button>
                    </div>
                  </div>

                  {/* Conecte-se */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyber-green flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Conecte-se
                    </h4>
                    <div className="space-y-2">
                      <Button 
                        variant="glass" 
                        size="sm"
                        className="footer-link w-full justify-start"
                        asChild
                      >
                        <a href="https://github.com/devAndreotti" target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      <Button 
                        variant="glass" 
                        size="sm"
                        className="footer-link w-full justify-start"
                        asChild
                      >
                        <a href="https://www.linkedin.com/in/ricardo-andreotti-gon%C3%A7alves-0b5785283/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                      <Button 
                        variant="glass" 
                        size="sm"
                        className="footer-link w-full justify-start"
                        asChild
                      >
                        <a href="mailto:OrlaEK@proton.me">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Tecnologias */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyber-orange flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Tecnologias
                    </h4>
                    <div className="space-y-2">
                      {/* Badge React & TypeScript com animação */}
                      <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50 hover:bg-cyber-blue/30 hover:scale-105 hover:shadow-[0_0_12px_hsl(var(--cyber-blue)/0.4)] transition-all duration-500 w-full justify-start tech-badge cursor-pointer group">
                        <Sparkles className="w-3 h-3 mr-2 group-hover:animate-spin" />
                        React & TypeScript
                      </Badge>
                      
                      {/* Badge Tailwind CSS com animação */}
                      <Badge className="bg-cyber-purple/20 text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple/30 hover:scale-105 hover:shadow-[0_0_12px_hsl(var(--cyber-purple)/0.4)] transition-all duration-500 w-full justify-start tech-badge cursor-pointer group">
                        <Zap className="w-3 h-3 mr-2 group-hover:animate-pulse" />
                        Tailwind CSS
                      </Badge>
                      
                      {/* Badge Spline 3D com animação */}
                      <Badge className="bg-cyber-green/20 text-cyber-green border-cyber-green/50 hover:bg-cyber-green/30 hover:scale-105 hover:shadow-[0_0_12px_hsl(var(--cyber-green)/0.4)] transition-all duration-500 w-full justify-start tech-badge cursor-pointer group">
                        <Star className="w-3 h-3 mr-2 group-hover:animate-bounce" />
                        Spline 3D
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-cyber-purple/50 to-transparent mb-6"></div>
                
                {/* Bottom section */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                  <div className="text-center lg:text-left">
                    <p className="text-sm text-muted-foreground">
                      © 2024 Git Command Builder - Desenvolvido com ❤️ para a comunidade
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      Todas as funcionalidades são gratuitas e open-source
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="border-cyber-green/50 text-cyber-green">
                      <Zap className="w-3 h-3 mr-1" />
                      100% Gratuito
                    </Badge>
                    <Badge variant="outline" className="border-cyber-purple/50 text-cyber-purple">
                      <Github className="w-3 h-3 mr-1" />
                      Open Source
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}