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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAgent } from "@/hooks/use-agents";
import { toast } from "@/hooks/use-toast";
import { AgentType } from "@/types/agent.types";

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAgent?: (agentId: string) => void;
}

export function NewAgentDialog({
  open,
  onOpenChange,
  onCreateAgent,
}: NewAgentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "chatbot" as AgentType,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createAgentMutation = useCreateAgent();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Agent name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Agent description is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newAgent = await createAgentMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        configuration: {
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: "You are a helpful AI assistant.",
          tools: [],
          knowledgeBase: [],
        },
      });

      toast({
        title: "Agent created successfully!",
        description: `${formData.name} has been created and is ready to configure.`,
      });

      // Reset form
      setFormData({ name: "", description: "", type: "chatbot" });
      setFieldErrors({});

      // Close dialog
      onOpenChange(false);

      // Notify parent component
      onCreateAgent?.(newAgent.id);
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", type: "chatbot" });
    setFieldErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
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
            Create a new AI agent with a name, description, and type. You can
            configure advanced settings after creation.
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
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this agent will help with..."
              className={fieldErrors.description ? "border-destructive" : ""}
              rows={3}
            />
            {fieldErrors.description && (
              <p className="text-sm text-destructive">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Agent Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: AgentType) =>
                handleInputChange("type", value)
              }>
              <SelectTrigger>
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chatbot">
                  Chatbot - Interactive conversation agent
                </SelectItem>
                <SelectItem value="assistant">
                  Assistant - Task-focused helper
                </SelectItem>
                <SelectItem value="analyst">
                  Analyst - Data analysis and insights
                </SelectItem>
                <SelectItem value="automation">
                  Automation - Workflow automation
                </SelectItem>
              </SelectContent>
            </Select>
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
              !formData.description.trim() ||
              createAgentMutation.isPending
            }>
            {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
