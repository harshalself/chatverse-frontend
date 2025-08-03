import { useState, useEffect } from "react";
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
import { useCreateAgent } from "@/hooks/use-agents";
import { toast } from "@/hooks/use-toast";
import { AgentProvider } from "@/types/agent.types";
import { ProviderSelect } from "@/components/ProviderSelect";
import { ModelSelect } from "@/components/ModelSelect";

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
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createAgentMutation = useCreateAgent();

  // Reset model when provider changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, model: "" }));
  }, [formData.provider]);

  // Show error toast for API failures
  useEffect(() => {
    if (createAgentMutation.error) {
      toast({
        title: "Failed to create agent",
        description: "There was an error creating the agent. Please try again.",
        variant: "destructive",
      });
    }
  }, [createAgentMutation.error]);

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

    if (!formData.model) {
      errors.model = "Model is required";
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
        model: formData.model,
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
      });
      setFieldErrors({});

      // Close dialog
      onOpenChange(false);

      // Notify parent component with both agent ID and name
      onCreateAgent?.(newAgent.id, formData.name.trim());
    } catch (error) {
      console.error("Failed to create agent:", error);
      toast({
        title: "Failed to create agent",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      provider: "openai",
      api_key: "",
      model: "",
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

          <ProviderSelect
            value={formData.provider}
            onValueChange={(value: AgentProvider) =>
              handleInputChange("provider", value)
            }
            error={fieldErrors.provider}
            required
          />

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

          <ModelSelect
            provider={formData.provider}
            value={formData.model}
            onValueChange={(value: string) => handleInputChange("model", value)}
            error={fieldErrors.model}
            required
          />
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
              !formData.model ||
              createAgentMutation.isPending
            }>
            {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
