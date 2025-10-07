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
        disabled={disabled || !provider || providerModels.isLoading}>
        <SelectTrigger className={`${error ? "border-destructive" : ""} focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0`} id="model">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {!provider ? (
            <SelectItem value="__no-provider__" disabled>
              Select a provider first
            </SelectItem>
          ) : providerModels.isLoading ? (
            <SelectItem value="__loading__" disabled>
              Loading models...
            </SelectItem>
          ) : providerModels.error ? (
            <SelectItem value="__error__" disabled>
              Error loading models
            </SelectItem>
          ) : !providerModels.data?.data.length ? (
            <SelectItem value="__no-models__" disabled>
              No models available for this provider
            </SelectItem>
          ) : (
            providerModels.data.data.map((model) => (
              <SelectItem
                key={model.id}
                value={model.model_name}
                disabled={!model.model_name || model.model_name.trim() === ""}>
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
