import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useProviderModels } from "@/hooks/use-provider-models";

interface ModelSelectProps {
  provider?: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function ModelSelect({
  provider,
  value,
  onValueChange,
  error,
  label = "Model",
  required = false,
  disabled = false,
}: ModelSelectProps) {
  const providerModels = useProviderModels(provider);

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="model">
          {label} {required && "*"}
        </Label>
      )}
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || !provider || providerModels.isLoading}
      >
        <SelectTrigger
          className={error ? "border-destructive" : ""}
          id="model"
        >
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {!provider ? (
            <SelectItem value="no-provider" disabled>
              Select a provider first
            </SelectItem>
          ) : providerModels.isLoading ? (
            <SelectItem value="loading" disabled>
              Loading models...
            </SelectItem>
          ) : providerModels.error ? (
            <SelectItem value="error" disabled>
              Error loading models
            </SelectItem>
          ) : !providerModels.data?.data.length ? (
            <SelectItem value="no-models" disabled>
              No models available for this provider
            </SelectItem>
          ) : (
            providerModels.data.data.map((model) => (
              <SelectItem key={model.id} value={model.model_name}>
                {model.model_name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
