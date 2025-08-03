import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useProviders } from "@/hooks/use-provider-models";
import { AgentProvider } from "@/types/agent.types";

interface ProviderSelectProps {
  value: string;
  onValueChange: (value: AgentProvider) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function ProviderSelect({
  value,
  onValueChange,
  error,
  label = "Provider",
  required = false,
  disabled = false,
}: ProviderSelectProps) {
  const providersQuery = useProviders();

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="provider">
          {label} {required && "*"}
        </Label>
      )}
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || providersQuery.isLoading}
      >
        <SelectTrigger
          className={error ? "border-destructive" : ""}
          id="provider"
        >
          <SelectValue placeholder="Select AI provider" />
        </SelectTrigger>
        <SelectContent>
          {providersQuery.isLoading ? (
            <SelectItem value="loading" disabled>
              Loading providers...
            </SelectItem>
          ) : providersQuery.error ? (
            <SelectItem value="error" disabled>
              Error loading providers
            </SelectItem>
          ) : !providersQuery.data?.data.length ? (
            <SelectItem value="no-providers" disabled>
              No providers available
            </SelectItem>
          ) : (
            providersQuery.data.data.map((provider) => (
              <SelectItem key={provider.provider} value={provider.provider}>
                {provider.displayName}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
