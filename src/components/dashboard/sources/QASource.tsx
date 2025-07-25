import { useState } from "react";
import { HelpCircle, Plus, RefreshCw, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateQASource,
  useSourcesByType,
  useDeleteSource,
} from "@/hooks/use-sources";

export function QASource() {
  const [questionTitle, setQuestionTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();

  // Data hooks
  const {
    data: qaSourcesData,
    isLoading: qaSourcesLoading,
    error: qaSourcesError,
    refetch: refetchQASources,
  } = useSourcesByType("qa");

  const { mutate: createQASource, isPending: createLoading } =
    useCreateQASource();

  const { mutate: deleteSource } = useDeleteSource();

  const qaSources = qaSourcesData?.data || [];

  const handleAddQA = () => {
    if (questionTitle && question && answer) {
      createQASource(
        {
          name: questionTitle,
          questions: [{ question, answer }],
        },
        {
          onSuccess: (data) => {
            toast({
              title: "Q&A pair created",
              description: `"${questionTitle}" has been added to your knowledge base.`,
            });
            setQuestionTitle("");
            setQuestion("");
            setAnswer("");
            refetchQASources();
          },
          onError: (error) => {
            toast({
              title: "Failed to create Q&A pair",
              description: "Please try again later.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDeleteQA = (id: string, name: string) => {
    deleteSource(id, {
      onSuccess: () => {
        toast({
          title: "Q&A source deleted",
          description: `"${name}" has been removed from your knowledge base.`,
        });
        refetchQASources();
      },
      onError: () => {
        toast({
          title: "Failed to delete Q&A source",
          description: "Please try again later.",
          variant: "destructive",
        });
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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

        {qaSourcesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : qaSourcesError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load Q&A sources.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchQASources()}
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {source.name}
                        </h4>
                        <div className="mt-2 space-y-2">
                          {source.metadata?.questions
                            ?.slice(0, 2)
                            .map((qa: any, index: number) => (
                              <div
                                key={index}
                                className="p-2 bg-muted/50 rounded text-sm">
                                <p className="font-medium text-foreground">
                                  {qa.question}
                                </p>
                                <p className="text-muted-foreground mt-1 line-clamp-2">
                                  {qa.answer?.substring(0, 100)}
                                  {(qa.answer?.length || 0) > 100 && "..."}
                                </p>
                              </div>
                            )) || (
                            <p className="text-sm text-muted-foreground">
                              No Q&A pairs available
                            </p>
                          )}
                          {(source.metadata?.questions?.length || 0) > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{(source.metadata?.questions?.length || 0) - 2}{" "}
                              more Q&A pairs
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                          <span>Updated {formatDate(source.updatedAt)}</span>
                          <span>•</span>
                          <span>
                            {source.metadata?.questions?.length || 0} Q&A pairs
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={`
                        ${
                          source.status === "ready"
                            ? "bg-success/10 text-success border-success/20"
                            : ""
                        }
                        ${
                          source.status === "processing"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : ""
                        }
                        ${
                          source.status === "error"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : ""
                        }
                        ${
                          source.status === "pending"
                            ? "bg-muted/10 text-muted-foreground border-muted/20"
                            : ""
                        }
                      `}>
                        {source.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Opening Q&A source",
                            description: `Opening "${source.name}"...`,
                          });
                          // TODO: Implement Q&A viewer
                        }}>
                        <Eye className="h-4 w-4" />
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
