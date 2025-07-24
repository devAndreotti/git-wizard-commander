import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GitCommit, Link, FolderOpen, Upload, GitBranch, GitMerge } from "lucide-react";

interface GitStepsBuilderProps {
  repositoryUrl: string;
  onRepositoryUrlChange: (url: string) => void;
  commitMessage: string;
}

const gitSteps = [
  {
    id: "init",
    command: "git init",
    description: "Inicializar repositório",
    icon: FolderOpen,
    color: "bg-cyber-green"
  },
  {
    id: "remote",
    command: "git remote add origin",
    description: "Adicionar repositório remoto",
    icon: Link,
    color: "bg-cyber-blue"
  },
  {
    id: "add",
    command: "git add .",
    description: "Adicionar arquivos ao stage",
    icon: Upload,
    color: "bg-cyber-orange"
  },
  {
    id: "commit",
    command: "git commit -m",
    description: "Fazer commit com mensagem",
    icon: GitCommit,
    color: "bg-cyber-purple"
  },
  {
    id: "branch",
    command: "git branch -M main",
    description: "Renomear branch principal",
    icon: GitBranch,
    color: "bg-cyber-pink"
  },
  {
    id: "push",
    command: "git push -u origin main",
    description: "Enviar para repositório remoto",
    icon: GitMerge,
    color: "bg-cyan-500"
  }
];

export function GitStepsBuilder({ repositoryUrl, onRepositoryUrlChange, commitMessage }: GitStepsBuilderProps) {
  const [selectedSteps, setSelectedSteps] = useState<string[]>(["init", "remote", "add", "commit", "branch", "push"]);

  const handleStepToggle = (stepId: string) => {
    setSelectedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const generateCommands = () => {
    const commands: string[] = [];
    
    selectedSteps.forEach(stepId => {
      const step = gitSteps.find(s => s.id === stepId);
      if (!step) return;

      switch (stepId) {
        case "init":
          commands.push("git init");
          break;
        case "remote":
          if (repositoryUrl) {
            commands.push(`git remote add origin ${repositoryUrl}`);
          }
          break;
        case "add":
          commands.push("git add .");
          break;
        case "commit":
          if (commitMessage) {
            commands.push(`git commit -m "${commitMessage}"`);
          } else {
            commands.push(`git commit -m "Initial commit"`);
          }
          break;
        case "branch":
          commands.push("git branch -M main");
          break;
        case "push":
          commands.push("git push -u origin main");
          break;
      }
    });

    return commands;
  };

  const commands = generateCommands();

  const copyCommands = () => {
    navigator.clipboard.writeText(commands.join('\n'));
  };

  return (
    <Card className="glass glass-hover border-cyber-blue/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyber-blue neon-text">
          <GitCommit className="w-5 h-5" />
          Etapas Básicas do Git
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure os campos acima para gerar os comandos...
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL do Repositório */}
        <div className="space-y-2">
          <Label htmlFor="repository-url" className="text-foreground font-medium">
            URL do Repositório
          </Label>
          <Input
            id="repository-url"
            value={repositoryUrl}
            onChange={(e) => onRepositoryUrlChange(e.target.value)}
            placeholder="https://github.com/usuario/repositorio.git"
            className="glass border-cyber-blue/30 focus:border-cyber-blue"
          />
        </div>

        {/* Seleção de Etapas */}
        <div className="space-y-3">
          <Label className="text-foreground font-medium">Etapas a incluir:</Label>
          <div className="grid gap-3">
            {gitSteps.map((step) => {
              const isSelected = selectedSteps.includes(step.id);
              const Icon = step.icon;
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg glass-hover cursor-pointer transition-all ${
                    isSelected ? 'border-cyber-purple/50 bg-cyber-purple/10' : 'border-muted/30'
                  }`}
                  onClick={() => handleStepToggle(step.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleStepToggle(step.id)}
                    className="data-[state=checked]:bg-cyber-purple data-[state=checked]:border-cyber-purple"
                  />
                  <Icon className="w-4 h-4 text-cyber-purple" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`${step.color} text-black text-xs`}>
                        {step.command.split(' ')[1] || step.command}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">
                        {step.command}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview dos Comandos */}
        {commands.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-medium">Comandos Gerados:</Label>
              <Button 
                onClick={copyCommands}
                variant="outline"
                size="sm"
                className="glass-hover border-cyber-green/50 text-cyber-green hover:bg-cyber-green/10"
              >
                Copiar Comandos
              </Button>
            </div>
            <div className="terminal rounded-lg p-4 space-y-2">
              {commands.map((command, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-cyber-green">$</span>
                  <span className="font-mono text-cyber-blue">{command}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avisos */}
        {!repositoryUrl && selectedSteps.includes("remote") && (
          <div className="bg-cyber-orange/10 border border-cyber-orange/30 rounded-lg p-3">
            <p className="text-sm text-cyber-orange">
              ⚠️ URL do repositório necessária para incluir o comando remote
            </p>
          </div>
        )}

        {!commitMessage && selectedSteps.includes("commit") && (
          <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-3">
            <p className="text-sm text-cyber-blue">
              💡 Configure o commit no painel ao lado para personalizar a mensagem
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}