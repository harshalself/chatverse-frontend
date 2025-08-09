import { useState } from "react";
import { HelpCircle, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useSourcesByAgent } from "@/hooks/use-base-sources";
import { useCreateQASource, useDeleteQASource } from "@/hooks/use-qa-sources";
import { useAgent } from "@/contexts/AgentContext";

export function QASource() {
  const [questionTitle, setQuestionTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();
  const { currentAgentId } = useAgent();

  // Get all sources for this agent and filter for QA sources
  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    error: sourcesError,
    refetch: refetchSources,
  } = useSourcesByAgent(currentAgentId || 0, !!currentAgentId);

  const { mutate: createQASource, isPending: createLoading } =
    useCreateQASource();
  const { mutate: deleteQASource } = useDeleteQASource();

  // Filter sources to only include QA type
  const qaSources = (sourcesData || []).filter(
    (source) => source.source_type === "qa"
  );

  const handleAddQA = () => {
    if (!currentAgentId) {
      toast({
        title: "Error",
        description: "Please select an agent first.",
        variant: "destructive",
      });
      return;
    }

    if (questionTitle && question && answer) {
      createQASource(
        {
          agent_id: currentAgentId,
          name: questionTitle,
          qa_pairs: [{ question, answer }],
        },
        {
          onSuccess: () => {
            setQuestionTitle("");
            setQuestion("");
            setAnswer("");
          },
        }
      );
    }
  };

  const handleDeleteQA = (id: number, name: string) => {
    deleteQASource(id, {
      onSuccess: () => {
        toast({
          title: "QA source deleted",
          description: `"${name}" has been removed from your knowledge base.`,
        });
      },
      onError: () => {
        toast({
          title: "Failed to delete QA source",
          description: "Please try again later.",
          variant: "destructive",
        });
      },
    });
  };

  // Show date and time for all dates (same format as TextSource)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Q&A Source</h2>
          <p className="text-muted-foreground">
            Add question and answer pairs to your knowledge base
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Add Q&A Pair</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="questionTitle">Question Title</Label>
            <Input
              id="questionTitle"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="Enter a title for this Q&A pair"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question here..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer here..."
              className="min-h-[150px]"
            />
          </div>

          <Button
            onClick={handleAddQA}
            disabled={!questionTitle || !question || !answer || createLoading}>
            {createLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {createLoading ? "Adding..." : "Add Q&A Pair"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Q&A Sources */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Existing Q&A Sources</h3>

        {sourcesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : sourcesError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load Q&A sources.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchSources()}
                className="ml-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : qaSources.length > 0 ? (
          <div className="space-y-4">
            {qaSources.map((source) => (
              <Card key={source.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {source.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Q&A</span>
                          <span>•</span>
                          <span>Updated {formatDate(source.updated_at)}</span>
                        </div>
                        {source.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {source.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          source.status === "completed"
                            ? "default"
                            : source.status === "processing"
                            ? "secondary"
                            : source.status === "failed"
                            ? "destructive"
                            : "outline"
                        }>
                        {source.status === "completed"
                          ? "Ready"
                          : source.status === "processing"
                          ? "Processing"
                          : source.status === "failed"
                          ? "Failed"
                          : "Pending"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          /* TODO: Implement QA viewer if needed */
                        }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQA(source.id, source.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No Q&A sources yet</h4>
              <p className="text-muted-foreground">
                Create your first Q&A pair using the form above
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
