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
import {
  useSources,
  useUploadFile,
  useDeleteSource,
  useProcessSource,
  useBulkDeleteSources,
  useSourcesByType,
} from "@/hooks/use-sources";

export function DocumentFiles() {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Data hooks
  const {
    data: documentsData,
    isLoading: documentsLoading,
    error: documentsError,
    refetch: refetchDocuments,
  } = useSourcesByType("file");

  const { mutate: uploadFile, isPending: uploadLoading } = useUploadFile();

  const { mutate: deleteSource } = useDeleteSource();

  const { mutate: bulkDeleteSources } = useBulkDeleteSources();

  const { mutate: processSource } = useProcessSource();

  const documents = documentsData?.data || [];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map((doc) => doc.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectDoc = (docId: string) => {
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
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        uploadFile(
          { file },
          {
            onSuccess: (data) => {
              toast({
                title: "File uploaded successfully",
                description: `${file.name} has been uploaded and is being processed.`,
              });
              refetchDocuments();
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
      deleteSource(selectedDocs[0], {
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
      bulkDeleteSources(selectedDocs, {
        onSuccess: () => {
          toast({
            title: "Documents deleted",
            description: `${selectedDocs.length} documents have been removed.`,
          });
          setSelectedDocs([]);
          refetchDocuments();
        },
      });
    }
  };

  const handleViewDocument = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      toast({
        title: "Opening document",
        description: `Opening ${doc.name}...`,
      });
      // TODO: Implement document viewer
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
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
          <h2 className="text-2xl font-semibold text-foreground">
            Document Files
          </h2>
          <p className="text-muted-foreground">
            Upload and manage your knowledge base documents
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Drag and drop files here or click to browse
            </p>
            <Button onClick={handleFileSelect} disabled={uploadLoading}>
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
              accept=".pdf,.doc,.docx,.txt,.md"
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
          <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
            <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
            <span className="text-sm font-medium">Select All Documents</span>
            {selectedDocs.length > 0 && (
              <div className="flex items-center space-x-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedDocs.forEach((id) => handleViewDocument(id));
                  }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View ({selectedDocs.length})
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedDocs.length})
                </Button>
              </div>
            )}
          </div>

          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => handleSelectDoc(doc.id)}
                    />
                    <div className="p-2 bg-muted rounded-lg">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {doc.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.metadata?.size)}</span>
                        <span>•</span>
                        <span>Updated {formatDate(doc.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`
                      ${
                        doc.status === "ready"
                          ? "bg-success/10 text-success border-success/20"
                          : ""
                      }
                      ${
                        doc.status === "processing"
                          ? "bg-warning/10 text-warning border-warning/20"
                          : ""
                      }
                      ${
                        doc.status === "error"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : ""
                      }
                      ${
                        doc.status === "pending"
                          ? "bg-muted/10 text-muted-foreground border-muted/20"
                          : ""
                      }
                    `}>
                      {doc.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocument(doc.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        deleteSource(doc.id, {
                          onSuccess: () => {
                            toast({
                              title: "Document deleted",
                              description: `${doc.name} has been removed.`,
                            });
                            refetchDocuments();
                          },
                        });
                      }}>
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
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first document to start building your knowledge base
            </p>
            <Button onClick={handleFileSelect}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
