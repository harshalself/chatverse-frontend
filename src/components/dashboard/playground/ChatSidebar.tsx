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
import { useState } from "react";

const MODELS = [
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "deepseek-r1-distill-llama-70b",
] as const;

type ModelID = (typeof MODELS)[number];

const defaultModel: ModelID = "meta-llama/llama-4-scout-17b-16e-instruct";

const SYSTEM_PROMPTS = [
  { label: "Sales Agent", value: "sales" },
  { label: "Support Agent", value: "support" },
  { label: "General Assistant", value: "general" },
];

export function ChatSidebar() {
  const [selectedModel, setSelectedModel] = useState<ModelID>(defaultModel);
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState("sales");
  const [instructions, setInstructions] = useState("");

  function handleSaveAgent() {
    // Implement save logic here
    alert("Agent saved!");
  }

  return (
    <aside className="flex flex-col gap-4 w-96 h-full p-6 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">
      <Button onClick={handleSaveAgent} className="w-full">
        Save Agent
      </Button>
      <div>
        <label className="block mb-1 text-sm font-medium">Model</label>
        <Select
          value={selectedModel}
          onValueChange={(value: ModelID) => setSelectedModel(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {MODELS.map((modelId) => (
                <SelectItem key={modelId} value={modelId}>
                  {modelId}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">
          Temperature{" "}
          <span className="ml-2 text-xs text-gray-500">
            {temperature.toFixed(2)}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
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
