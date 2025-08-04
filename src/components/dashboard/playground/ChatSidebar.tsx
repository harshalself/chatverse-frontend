import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  useAgent as useAgentDetails,
  useUpdateAgent,
} from "@/hooks/use-agents";
import { useProviders, useProviderModels } from "@/hooks/use-provider-models";
import { toast } from "@/hooks/use-toast";
import { AgentProvider } from "@/types/agent.types";
import { useAgent } from "@/contexts";

const SYSTEM_PROMPTS = [
  { label: "Sales Agent", value: "sales" },
  { label: "Support Agent", value: "support" },
  { label: "General Assistant", value: "general" },
];

export function ChatSidebar() {
  // Get agentId from context
  const { currentAgentId } = useAgent();
  const [selectedProvider, setSelectedProvider] = useState<AgentProvider | "">(
    ""
  );
  const [selectedModel, setSelectedModel] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState("sales");
  const [instructions, setInstructions] = useState("");

  // Track initial values to detect changes
  const [initialValues, setInitialValues] = useState({
    provider: "",
    model: "",
    temperature: 0.7,
    systemPrompt: "sales",
    instructions: "",
  });

  // Backend hooks - only fetch if agentId is available
  const { data: agentData, isLoading: agentLoading } = useAgentDetails(
    currentAgentId?.toString() || "",
    !!currentAgentId
  );
  const { data: providersData, isLoading: providersLoading } = useProviders();
  const { data: modelsData, isLoading: modelsLoading } = useProviderModels(
    selectedProvider || undefined
  );
  const updateAgentMutation = useUpdateAgent();

  // Get available providers
  const providers = providersData?.data || [];

  // Get available models for selected provider
  const availableModels = modelsData?.data || [];

  // Reset model when provider changes
  useEffect(() => {
    if (selectedProvider && selectedModel) {
      // Check if the current model is still available for the new provider
      const isModelAvailable = availableModels.some(
        (model) => model.model_name === selectedModel
      );
      if (!isModelAvailable && !modelsLoading) {
        setSelectedModel("");
      }
    }
  }, [selectedProvider, availableModels, modelsLoading, selectedModel]);

  // Only update form state from backend when agentId changes
  const lastLoadedAgentId = useRef<string | number | null>(null);
  useEffect(() => {
    if (agentData && !agentLoading) {
      const agent = agentData;
      if (lastLoadedAgentId.current !== agent.id) {
        // Temperature can be a string or number from the backend
        let agentTemperature = 0.7; // default fallback
        if (agent.temperature !== null && agent.temperature !== undefined) {
          const parsedTemp =
            typeof agent.temperature === "string"
              ? parseFloat(agent.temperature)
              : agent.temperature;
          if (!isNaN(parsedTemp) && parsedTemp >= 0 && parsedTemp <= 1) {
            agentTemperature = parsedTemp;
          }
        }

        const values = {
          provider: agent.provider || "",
          model: agent.model || "",
          temperature: agentTemperature,
          systemPrompt: "sales", // Default since this isn't in backend yet
          instructions: "", // Default since this isn't in backend yet
        };

        setSelectedProvider(agent.provider || "");
        setSelectedModel(agent.model || "");
        setTemperature(agentTemperature);
        setSystemPrompt("sales");
        setInstructions("");
        setInitialValues(values);
        lastLoadedAgentId.current = agent.id;
      }
    }
  }, [agentData, agentLoading]);

  // Check if any values have changed
  const hasChanges = useMemo(() => {
    return (
      selectedProvider !== initialValues.provider ||
      selectedModel !== initialValues.model ||
      temperature !== initialValues.temperature ||
      systemPrompt !== initialValues.systemPrompt ||
      instructions !== initialValues.instructions
    );
  }, [
    selectedProvider,
    selectedModel,
    temperature,
    systemPrompt,
    instructions,
    initialValues,
  ]);

  function handleSaveAgent() {
    if (!currentAgentId || !hasChanges) return;

    // Temperature is always a number
    const updateData = {
      provider: selectedProvider as AgentProvider,
      model: selectedModel,
      temperature: temperature,
      // Note: systemPrompt and instructions would need to be added to backend schema
    };

    updateAgentMutation.mutate(
      { id: currentAgentId.toString(), data: updateData },
      {
        onSuccess: () => {
          // Update initial values to current values
          setInitialValues({
            provider: selectedProvider,
            model: selectedModel,
            temperature: temperature,
            systemPrompt: systemPrompt,
            instructions: instructions,
          });
          toast({
            title: "Success",
            description: "Agent settings updated successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update agent settings",
            variant: "destructive",
          });
          console.error("Error updating agent:", error);
        },
      }
    );
  }

  // Show message when no agent is selected
  if (!currentAgentId) {
    return (
      <aside className="flex flex-col gap-4 w-96 h-full p-6 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            No agent selected.
            <br />
            Please select an agent to configure its settings.
          </p>
        </div>
      </aside>
    );
  }

  if (agentLoading || providersLoading) {
    return (
      <aside className="flex flex-col gap-4 w-96 h-full p-6 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col gap-4 w-96 h-full p-6 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">
      <Button
        onClick={handleSaveAgent}
        className="w-full"
        disabled={!hasChanges || updateAgentMutation.isPending}>
        {updateAgentMutation.isPending ? "Saving..." : "Save Agent"}
      </Button>

      <div>
        <label className="block mb-1 text-sm font-medium">Provider</label>
        <Select
          value={selectedProvider}
          onValueChange={(value: AgentProvider) => setSelectedProvider(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {providers.map((provider) => (
                <SelectItem key={provider.provider} value={provider.provider}>
                  {provider.displayName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Model</label>
        <Select
          value={selectedModel}
          onValueChange={(value: string) => setSelectedModel(value)}
          disabled={!selectedProvider || modelsLoading}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !selectedProvider
                  ? "Select a provider first"
                  : modelsLoading
                  ? "Loading models..."
                  : "Select a model"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {availableModels.length === 0 &&
              selectedProvider &&
              !modelsLoading ? (
                <SelectItem value="" disabled>
                  No models available for {selectedProvider}
                </SelectItem>
              ) : (
                availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.model_name}>
                    {model.model_name}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Temperature{" "}
          <span className="ml-2 text-xs text-gray-500">
            {temperature.toFixed(1)}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={temperature}
          onChange={(e) => {
            // Snap to nearest 0.1 step
            let value = Math.round(parseFloat(e.target.value) * 10) / 10;
            if (isNaN(value)) value = 0.7;
            setTemperature(value);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {[...Array(11)].map((_, i) => (
            <span key={i}>{(i / 10).toFixed(1)}</span>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">System Prompt</label>
        <Select value={systemPrompt} onValueChange={setSystemPrompt}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a prompt" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SYSTEM_PROMPTS.map((prompt) => (
                <SelectItem key={prompt.value} value={prompt.value}>
                  {prompt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 flex flex-col">
        <label className="block mb-1 text-sm font-medium">Instructions</label>
        <ShadcnTextarea
          className="flex-1 resize-none min-h-[120px]"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Add custom instructions for the agent..."
        />
      </div>
    </aside>
  );
}
