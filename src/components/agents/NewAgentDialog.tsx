import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAgent } from "@/hooks/use-agents";
import { toast } from "@/hooks/use-toast";
import { AgentProvider } from "@/types/agent.types";

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAgent?: (agentId: string, agentName: string) => void;
}

export function NewAgentDialog({
  open,
  onOpenChange,
  onCreateAgent,
}: NewAgentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    provider: "openai" as AgentProvider,
    api_key: "",
    model: "",
    temperature: 0.7,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createAgentMutation = useCreateAgent();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Agent name is required";
    }

    if (!formData.provider) {
      errors.provider = "Provider is required";
    }

    if (!formData.api_key.trim()) {
      errors.api_key = "API key is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const requestData = {
        name: formData.name.trim(),
        provider: formData.provider,
        api_key: formData.api_key.trim(),
        ...(formData.model && { model: formData.model }),
        temperature: formData.temperature,
        is_active: 1,
      };

      const newAgent = await createAgentMutation.mutateAsync(requestData);

      toast({
        title: "Agent created successfully!",
        description: `${formData.name} has been created and is ready to use.`,
      });

      // Reset form
      setFormData({
        name: "",
        provider: "openai",
        api_key: "",
        model: "",
        temperature: 0.7,
      });
      setFieldErrors({});

      // Close dialog
      onOpenChange(false);

      // Notify parent component with both agent ID and name
      onCreateAgent?.(newAgent.id, formData.name.trim());
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      provider: "openai",
      api_key: "",
      model: "",
      temperature: 0.7,
    });
    setFieldErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Create a new AI agent by providing a name, selecting a provider, and
            entering your API key.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g. Customer Support Bot"
              className={fieldErrors.name ? "border-destructive" : ""}
            />
            {fieldErrors.name && (
              <p className="text-sm text-destructive">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Provider *</Label>
            <Select
              value={formData.provider}
              onValueChange={(value: AgentProvider) =>
                handleInputChange("provider", value)
              }>
              <SelectTrigger
                className={fieldErrors.provider ? "border-destructive" : ""}>
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.provider && (
              <p className="text-sm text-destructive">{fieldErrors.provider}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_key">API Key *</Label>
            <Input
              id="api_key"
              type="password"
              value={formData.api_key}
              onChange={(e) => handleInputChange("api_key", e.target.value)}
              placeholder="Enter your API key"
              className={fieldErrors.api_key ? "border-destructive" : ""}
            />
            {fieldErrors.api_key && (
              <p className="text-sm text-destructive">{fieldErrors.api_key}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model (Optional)</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              placeholder="e.g. gpt-4-turbo, claude-3-opus"
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to use the provider's default model
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">
              Temperature: {formData.temperature}
            </Label>
            <Input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={formData.temperature}
              onChange={(e) =>
                handleInputChange("temperature", parseFloat(e.target.value))
              }
              className="slider"
            />
            <p className="text-sm text-muted-foreground">
              Controls randomness: 0 = focused, 2 = creative
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={
              !formData.name.trim() ||
              !formData.provider ||
              !formData.api_key.trim() ||
              createAgentMutation.isPending
            }>
            {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
