import { useState, useEffect, useMemo } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import { Settings, Trash2, Loader2, Brain, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts";
import {
  useAgent as useAgentDetails,
  useUpdateAgent,
  useDeleteAgent,
} from "@/hooks/use-agents";
import { useSourcesByAgent, useDeleteSource } from "@/hooks/use-base-sources";
import { AgentProvider } from "@/types/agent.types";
import { DataSource } from "@/types/source.types";
import { ProviderSelect } from "@/components/ProviderSelect";
import { ModelSelect } from "@/components/ModelSelect";
import {
  sourceIcons,
  sourceLabels,
} from "@/components/dashboard/sources/AllSourcesTable";
import { useNavigate } from "react-router-dom";

const settingsItems = [{ id: "general", label: "General", icon: Settings }];

export function SettingsView() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("general");
  const [showDeleteAgentDialog, setShowDeleteAgentDialog] = useState(false);
  const [showDeleteSourceDialog, setShowDeleteSourceDialog] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<DataSource | null>(null);

  // Agent context
  const { currentAgentId } = useAgent();

  // Agent configuration state
  const [selectedProvider, setSelectedProvider] = useState<AgentProvider | "">(
    ""
  );
  const [selectedModel, setSelectedModel] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);

  // Track initial values to detect changes
  const [initialValues, setInitialValues] = useState({
    provider: "",
    model: "",
    temperature: 0.7,
    systemPrompt: "",
    apiKey: "",
  });

  // Hooks
  const { data: agentData, isLoading: agentLoading } = useAgentDetails(
    currentAgentId?.toString() || "",
    !!currentAgentId
  );
  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    refetch: refetchSources,
  } = useSourcesByAgent(currentAgentId || 0, !!currentAgentId);

  const updateAgentMutation = useUpdateAgent();
  const deleteAgentMutation = useDeleteAgent();
  const deleteSourceMutation = useDeleteSource();

  // Get data
  const sources = sourcesData || [];

  // Load agent data
  useEffect(() => {
    if (agentData && !agentLoading) {
      const agent = agentData;
      let agentTemperature = 0.7;
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
        systemPrompt: agent.system_prompt || "", // Load from backend
        apiKey: "", // API keys are not returned from backend for security
      };

      setSelectedProvider(agent.provider || "");
      setSelectedModel(agent.model || "");
      setTemperature(agentTemperature);
      setSystemPrompt(agent.system_prompt || ""); // Load from backend
      setApiKey(""); // API keys are not returned from backend for security
      setHasApiKey(agent.has_api_key || false); // Track if API key exists
      setInitialValues(values);
    }
  }, [agentData, agentLoading]);

  // Check if any values have changed
  const hasChanges = useMemo(() => {
    return (
      selectedProvider !== initialValues.provider ||
      selectedModel !== initialValues.model ||
      temperature !== initialValues.temperature ||
      systemPrompt !== initialValues.systemPrompt ||
      (apiKey.trim() && apiKey !== initialValues.apiKey) // Only consider API key change if user entered something
    );
  }, [
    selectedProvider,
    selectedModel,
    temperature,
    systemPrompt,
    apiKey,
    initialValues,
  ]);

  // Handle save agent configuration
  const handleSaveAgent = () => {
    if (!currentAgentId || !hasChanges) return;

    const updateData: any = {
      provider: selectedProvider as AgentProvider,
      model: selectedModel,
      temperature: temperature,
      system_prompt: systemPrompt,
      is_active: 1, // Keep agent active by default
    };

    // Only include API key if user entered a new one
    if (apiKey.trim()) {
      updateData.api_key = apiKey;
    }

    updateAgentMutation.mutate(
      { id: currentAgentId.toString(), data: updateData },
      {
        onSuccess: () => {
          setInitialValues({
            provider: selectedProvider,
            model: selectedModel,
            temperature: temperature,
            systemPrompt: systemPrompt,
            apiKey: apiKey || initialValues.apiKey, // Keep the entered API key or existing one
          });
          // Clear the API key input after successful update
          setApiKey("");
          // Update hasApiKey status if a new key was provided
          if (apiKey.trim()) {
            setHasApiKey(true);
          }
          toast({
            title: "Success",
            description: "Agent configuration updated successfully",
          });
        },
      }
    );
  };

  // Handle delete source
  const handleDeleteSource = (source: DataSource) => {
    setSourceToDelete(source);
    setShowDeleteSourceDialog(true);
  };

  const confirmDeleteSource = () => {
    if (!sourceToDelete) return;

    deleteSourceMutation.mutate(sourceToDelete.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Source deleted successfully",
        });
        refetchSources();
        setShowDeleteSourceDialog(false);
        setSourceToDelete(null);
      },
    });
  };

  // Handle delete agent
  const handleDeleteAgent = () => {
    if (!currentAgentId) return;

    deleteAgentMutation.mutate(currentAgentId.toString(), {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Agent deleted successfully",
        });
        navigate("/workspace");
      },
    });
  };

  const renderContent = () => {
    switch (activeItem) {
      case "general":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              General Settings
            </h2>

            {!currentAgentId && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Please select an agent to configure its settings.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Agent Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Agent Configuration</CardTitle>
                  <CardDescription>
                    Configure your agent's model and behavior settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agentLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <ProviderSelect
                        value={selectedProvider}
                        onValueChange={(value: AgentProvider) =>
                          setSelectedProvider(value)
                        }
                        disabled={!currentAgentId}
                      />

                      <ModelSelect
                        provider={selectedProvider}
                        value={selectedModel}
                        onValueChange={(value: string) =>
                          setSelectedModel(value)
                        }
                        disabled={!currentAgentId}
                      />

                      <div className="space-y-2">
                        <Label>
                          Temperature{" "}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {temperature.toFixed(1)}
                          </span>
                        </Label>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={temperature}
                          onChange={(e) => {
                            let value =
                              Math.round(parseFloat(e.target.value) * 10) / 10;
                            if (isNaN(value)) value = 0.7;
                            setTemperature(value);
                          }}
                          disabled={!currentAgentId}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0.0</span>
                          <span>0.5</span>
                          <span>1.0</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="systemPrompt">System Prompt</Label>
                        <Textarea
                          id="systemPrompt"
                          placeholder="Enter system prompt for the agent..."
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          disabled={!currentAgentId}
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input
                          id="apiKey"
                          type="password"
                          placeholder={
                            hasApiKey
                              ? "•••••••• (API key is configured)"
                              : "Enter your API key..."
                          }
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          disabled={!currentAgentId}
                        />
                        <p className="text-xs text-muted-foreground">
                          {hasApiKey
                            ? "Leave empty to keep current API key, or enter a new one to update it."
                            : "Your API key is encrypted and stored securely."}
                        </p>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          onClick={handleSaveAgent}
                          disabled={
                            !hasChanges ||
                            updateAgentMutation.isPending ||
                            !currentAgentId
                          }>
                          {updateAgentMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Configuration"
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Sources Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>Sources</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => refetchSources()}
                      disabled={sourcesLoading || !currentAgentId}>
                      <RefreshCw
                        className={`h-4 w-4 ${
                          sourcesLoading ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Manage the sources connected to your agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sourcesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : sources.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No sources found.</p>
                      {currentAgentId && (
                        <p className="text-sm mt-1">
                          Add sources to your agent to get started.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-20">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sources.map((source) => {
                            const Icon =
                              sourceIcons[source.type] || sourceIcons.text;
                            return (
                              <TableRow key={source.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {sourceLabels[source.type] || source.type}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {source.name || `${source.type} source`}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Active</Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteSource(source)}
                                    className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Danger Zone - Delete Agent */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Permanent actions that cannot be undone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-destructive">
                          Delete Agent
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete this agent and all associated data.
                          This action cannot be undone.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteAgentDialog(true)}
                        disabled={!currentAgentId}
                        className="ml-4 flex-shrink-0">
                        Delete Agent
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-120px)]">
        <ReusableSidebar
          title="Settings"
          items={settingsItems}
          activeItem={activeItem}
          onItemChange={setActiveItem}
        />
        <div className="flex-1">{renderContent()}</div>
      </div>

      {/* Delete Source Dialog */}
      <Dialog
        open={showDeleteSourceDialog}
        onOpenChange={setShowDeleteSourceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this source? This action cannot be
              undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteSourceDialog(false);
                setSourceToDelete(null);
              }}
              disabled={deleteSourceMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSource}
              disabled={deleteSourceMutation.isPending}>
              {deleteSourceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Source"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Agent Dialog */}
      <Dialog
        open={showDeleteAgentDialog}
        onOpenChange={setShowDeleteAgentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this agent? This action cannot be
              undone and will permanently remove:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All agent configuration and settings</li>
                <li>All connected sources and training data</li>
                <li>All conversation history</li>
                <li>All analytics and performance data</li>
              </ul>
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md my-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Warning:</strong> This action is permanent and cannot be
              reversed.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteAgentDialog(false)}
              disabled={deleteAgentMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAgent}
              disabled={deleteAgentMutation.isPending}>
              {deleteAgentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Agent"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
