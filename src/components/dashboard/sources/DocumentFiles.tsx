import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  MoreHorizontal,
  Eye,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUploadFileSource,
  useDeleteFileSource,
} from "@/hooks/use-file-sources";
import { useSourcesByAgent } from "@/hooks/use-base-sources";
import { FileSource } from "@/types/source.types";
import { UI_CONSTANTS } from "@/lib/constants";

export function DocumentFiles() {
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get the current agent ID from context
  const { currentAgentId, isAgentSelected } = useAgent();

  // Use the same sources as AllSourcesTable, then filter for file type
  const {
    data: allSources,
    isLoading: documentsLoading,
    error: documentsError,
    refetch: refetchDocuments,
  } = useSourcesByAgent(currentAgentId || 0, isAgentSelected);

  const { mutate: uploadFileSource, isPending: uploadLoading } =
    useUploadFileSource();
  // Query client for invalidating sources summary
  const queryClient = useQueryClient();

  const { mutate: deleteFileSource } = useDeleteFileSource();

  // Only show sources of type 'file' (document files)
  const documents = (allSources || []).filter((src) => src.type === "file");

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map((doc) => doc.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectDoc = (docId: number) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    // Check if agent is selected
    if (!currentAgentId) {
      toast({
        title: "No agent selected",
        description: "Please select an agent before uploading files.",
        variant: "destructive",
      });
      return;
    }

    if (files && files.length > 0) {
      // Validate file count
      if (files.length > UI_CONSTANTS.MAX_FILES_PER_UPLOAD) {
        toast({
          title: "Too many files",
          description: `Maximum ${UI_CONSTANTS.MAX_FILES_PER_UPLOAD} files allowed per upload.`,
          variant: "destructive",
        });
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      for (const file of Array.from(files)) {
        // Check file size
        if (file.size > UI_CONSTANTS.MAX_FILE_SIZE) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 10MB limit.`,
            variant: "destructive",
          });
          continue;
        }

        // Check file type
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
        if (!UI_CONSTANTS.SUPPORTED_FILE_TYPES.includes(fileExtension as any)) {
          toast({
            title: "Unsupported file type",
            description: `${
              file.name
            } is not a supported file type. Supported: ${UI_CONSTANTS.SUPPORTED_FILE_TYPES.join(
              ", "
            )}`,
            variant: "destructive",
          });
          continue;
        }

        validFiles.push(file);
      }

      // Upload valid files
      validFiles.forEach((file) => {
        uploadFileSource(
          {
            agentId: currentAgentId,
            file,
            name: file.name,
          },
          {
            onSuccess: (data) => {
              toast({
                title: "File uploaded successfully",
                description: `${file.name} has been uploaded and is being processed.`,
              });
              refetchDocuments();
              // Invalidate sources summary query to refresh SourcesSummary
              queryClient.invalidateQueries({
                queryKey: ["sources", "by-agent", currentAgentId],
              });
            },
            onError: (error) => {
              toast({
                title: "Upload failed",
                description: `Failed to upload ${file.name}. Please try again.`,
                variant: "destructive",
              });
            },
          }
        );
      });
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDocs.length === 1) {
      deleteFileSource(selectedDocs[0], {
        onSuccess: () => {
          toast({
            title: "Document deleted",
            description:
              "The document has been removed from your knowledge base.",
          });
          setSelectedDocs([]);
          refetchDocuments();
        },
      });
    } else if (selectedDocs.length > 1) {
      // For bulk operations, we'll need to call deleteFileSource multiple times
      // since the new API doesn't have bulk delete yet
      const deletePromises = selectedDocs.map(
        (id) =>
          new Promise<void>((resolve) => {
            deleteFileSource(id, {
              onSuccess: () => resolve(),
              onError: () => resolve(), // Continue even if some fail
            });
          })
      );

      Promise.all(deletePromises).then(() => {
        toast({
          title: "Documents deleted",
          description: `${selectedDocs.length} documents have been processed for deletion.`,
        });
        setSelectedDocs([]);
        refetchDocuments();
      });
    }
  };

  const handleViewDocument = (docId: number) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      toast({
        title: "Opening document",
        description: `Opening ${doc.name}...`,
      });
      // Open the file URL in a new tab if available (from metadata)
      const fileUrl = doc.metadata?.file_url;
      if (fileUrl) {
        window.open(fileUrl, "_blank");
      }
    }
  };

  // File size logic removed as per request

  // Show date and time for all dates
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
    <div className="flex-1 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Document Files
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload and manage your knowledge base documents
          </p>
        </div>
      </div>

      {/* Show alert if agent is not selected */}
      {!isAgentSelected && (
        <Alert className="mb-4 sm:mb-6">
          <AlertDescription>
            Please select an agent to manage document files.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Card */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Upload Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-8 text-center">
            <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              Drag and drop files here or click to browse
              <br />
              <span className="text-xs">
                Supported: PDF, DOC, DOCX, TXT (max 10MB each, up to 10 files)
              </span>
            </p>
            <Button
              onClick={handleFileSelect}
              disabled={uploadLoading || !isAgentSelected}
              title={!isAgentSelected ? "Select an agent first" : ""}
              className="w-full sm:w-auto">
              {uploadLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {uploadLoading ? "Uploading..." : "Choose Files"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {documentsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : documentsError ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load documents.
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchDocuments()}
              className="ml-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : documents.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
              <span className="text-sm font-medium">Select All Documents</span>
            </div>
            {selectedDocs.length > 0 && (
              <div className="flex items-center space-x-2 sm:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedDocs.forEach((id) => handleViewDocument(id));
                  }}
                  className="flex-1 sm:flex-none">
                  <Eye className="h-4 w-4 mr-2" />
                  View ({selectedDocs.length})
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="flex-1 sm:flex-none">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedDocs.length})
                </Button>
              </div>
            )}
          </div>

          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Checkbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => handleSelectDoc(doc.id)}
                      className="flex-shrink-0"
                    />
                    <div className="p-2 bg-muted rounded-lg flex-shrink-0">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground truncate">
                        {doc.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs sm:text-sm text-muted-foreground">
                        {/* File type: Prefer mime_type, else use file extension, else Unknown */}
                        <span className="truncate">
                          {doc.metadata?.mime_type
                            ? doc.metadata.mime_type
                            : doc.name && doc.name.includes(".")
                            ? doc.name
                                .substring(doc.name.lastIndexOf(".") + 1)
                                .toUpperCase() + " file"
                            : "Unknown type"}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        {/* Updated date: Show 'Yesterday', 'X days ago', or formatted date */}
                        <span className="truncate">
                          Updated {formatDate(doc.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 flex-shrink-0">
                    <Badge
                      variant={
                        doc.status === "completed"
                          ? "default"
                          : doc.status === "processing"
                          ? "secondary"
                          : doc.status === "failed"
                          ? "destructive"
                          : "outline"
                      }
                      className="text-xs">
                      {doc.status === "completed"
                        ? "Ready"
                        : doc.status === "processing"
                        ? "Processing"
                        : doc.status === "failed"
                        ? "Failed"
                        : "Pending"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocument(doc.id)}
                      className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        deleteFileSource(doc.id, {
                          onSuccess: () => {
                            toast({
                              title: "Document deleted",
                              description: `${doc.name} has been removed.`,
                            });
                            refetchDocuments();
                          },
                        });
                      }}
                      className="h-8 w-8 p-0">
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
          <CardContent className="p-6 sm:p-8 text-center">
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">
              No documents yet
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              {!isAgentSelected
                ? "Select an agent first to view its documents"
                : "Upload your first document to start building your knowledge base"}
            </p>
            <Button
              onClick={handleFileSelect}
              disabled={!isAgentSelected}
              title={!isAgentSelected ? "Select an agent first" : ""}
              className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
