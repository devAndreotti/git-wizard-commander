import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { GitCommit, Code, Sparkles, Plus, Save, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GitCommitBuilderProps {
  onCommitChange: (commit: string) => void;
}

interface CommitTemplate {
  id: string;
  name: string;
  type: string;
  scope?: string;
  description: string;
  useScope: boolean;
}

const commitTypes = [
  { value: "feat", label: "feat", description: "nova funcionalidade", color: "bg-cyber-green" },
  { value: "fix", label: "fix", description: "correção de bug", color: "bg-cyber-orange" },
  { value: "docs", label: "docs", description: "apenas documentação", color: "bg-cyber-blue" },
  { value: "style", label: "style", description: "formatação/código não funcional", color: "bg-cyber-pink" },
  { value: "refactor", label: "refactor", description: "refatoração de código", color: "bg-cyber-purple" },
  { value: "test", label: "test", description: "testes", color: "bg-cyan-500" },
  { value: "chore", label: "chore", description: "tarefas auxiliares", color: "bg-yellow-500" }
];

export function GitCommitBuilder({ onCommitChange }: GitCommitBuilderProps) {
  const [type, setType] = useState("");
  const [useScope, setUseScope] = useState(false);
  const [scope, setScope] = useState("");
  const [description, setDescription] = useState("");
  const [generatedCommit, setGeneratedCommit] = useState("");
  
  // Templates personalizáveis
  const [templates, setTemplates] = useState<CommitTemplate[]>(() => {
    const saved = localStorage.getItem("git-commit-templates");
    return saved ? JSON.parse(saved) : [];
  });
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    if (type && description) {
      const scopeText = useScope && scope ? `(${scope})` : "";
      const commit = `${type}${scopeText}: ${description}`;
      setGeneratedCommit(commit);
      onCommitChange(commit);
    } else {
      setGeneratedCommit("");
      onCommitChange("");
    }
  }, [type, useScope, scope, description, onCommitChange]);

  useEffect(() => {
    localStorage.setItem("git-commit-templates", JSON.stringify(templates));
  }, [templates]);

  const saveTemplate = () => {
    if (!templateName.trim() || !type || !description) {
      toast({
        title: "Erro",
        description: "Preencha o nome do template e os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: CommitTemplate = {
      id: Date.now().toString(),
      name: templateName,
      type,
      scope: useScope ? scope : "",
      description,
      useScope,
    };

    setTemplates([...templates, newTemplate]);
    setTemplateName("");
    setShowTemplateDialog(false);
    
    toast({
      title: "Template salvo!",
      description: `Template "${templateName}" foi salvo com sucesso`,
    });
  };

  const loadTemplate = (template: CommitTemplate) => {
    setType(template.type);
    setUseScope(template.useScope);
    setScope(template.scope || "");
    setDescription(template.description);
    
    toast({
      title: "Template carregado!",
      description: `Template "${template.name}" foi aplicado`,
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Template removido",
      description: "Template foi removido com sucesso",
    });
  };

  const selectedType = commitTypes.find(t => t.value === type);

  return (
    <Card className="glass glass-hover border-cyber-purple/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyber-purple neon-text">
            <GitCommit className="w-5 h-5" />
            Construtor de Commit
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="glass border-cyber-green/30 hover:border-cyber-green nav-btn"
                  disabled={!type || !description}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Template
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-cyber-purple/50">
                <DialogHeader>
                  <DialogTitle className="text-cyber-purple">Salvar Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Nome do Template</Label>
                    <Input
                      id="template-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="ex: Feature padrão, Hotfix rápido..."
                      className="glass border-cyber-purple/30 focus:border-cyber-purple"
                    />
                  </div>
                  <div className="terminal rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2">Preview do template:</p>
                    <code className="text-cyber-blue">
                      {type}{useScope && scope ? `(${scope})` : ""}: {description}
                    </code>
                  </div>
                  <Button 
                    onClick={saveTemplate} 
                    className="w-full bg-cyber-green hover:bg-cyber-green/80 text-black nav-btn"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Template
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Construa seus commits passo a passo com templates personalizáveis
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Templates Salvos */}
        {templates.length > 0 && (
          <div className="space-y-3">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyber-purple" />
              Templates Salvos
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {templates.map((template) => (
                <div key={template.id} className="glass border-cyber-purple/30 rounded-lg p-3 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-cyber-purple">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.type}{template.useScope && template.scope ? `(${template.scope})` : ""}: {template.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => loadTemplate(template)}
                        className="h-8 w-8 p-0 nav-btn"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTemplate(template.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 nav-btn"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tipo do Commit */}
        <div className="space-y-2">
          <Label htmlFor="commit-type" className="text-foreground font-medium">
            Tipo (obrigatório) <span className="text-cyber-green">*</span>
          </Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="glass border-cyber-purple/30 focus:border-cyber-purple">
              <SelectValue placeholder="Selecione o tipo de commit" />
            </SelectTrigger>
            <SelectContent className="glass border-cyber-purple/50">
              {commitTypes.map((commitType) => (
                <SelectItem key={commitType.value} value={commitType.value}>
                  <div className="flex items-center gap-2">
                    <Badge className={`${commitType.color} text-black text-xs`}>
                      {commitType.label}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {commitType.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Usar Escopo */}
        <div className="flex items-center space-x-2">
          <Switch
            id="use-scope"
            checked={useScope}
            onCheckedChange={setUseScope}
            className="data-[state=checked]:bg-cyber-purple"
          />
          <Label htmlFor="use-scope" className="text-foreground">
            Usar escopo?
          </Label>
        </div>

        {/* Campo de Escopo */}
        {useScope && (
          <div className="space-y-2">
            <Label htmlFor="scope" className="text-foreground font-medium">
              Escopo
            </Label>
            <Input
              id="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="ex: login, api, button"
              className="glass border-cyber-purple/30 focus:border-cyber-purple"
            />
          </div>
        )}

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground font-medium">
            Descrição da mudança (obrigatório) <span className="text-cyber-green">*</span>
          </Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ex: adicionar validação de e-mail"
            className="glass border-cyber-purple/30 focus:border-cyber-purple"
          />
        </div>

        {/* Preview do Commit */}
        {generatedCommit && (
          <div className="space-y-2">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-green" />
              Preview automático
            </Label>
            <div className="terminal rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-cyber-green" />
                <span className="text-cyber-green text-sm">git commit -m</span>
              </div>
              <div className="font-mono text-cyber-blue">
                "{generatedCommit}"
              </div>
            </div>
          </div>
        )}

        {/* Dicas */}
        <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-3">
          <h4 className="text-sm font-medium text-cyber-purple mb-2">💡 Dicas para commits:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use verbos no infinitivo (adicionar, remover, corrigir)</li>
            <li>• Seja específico e objetivo na descrição</li>
            <li>• O escopo ajuda a identificar qual área foi modificada</li>
            {selectedType && (
              <li className="text-cyber-green">
                • <strong>{selectedType.label}:</strong> {selectedType.description}
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}