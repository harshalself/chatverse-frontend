import { memo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useDeleteSource } from "@/hooks/use-base-sources";
import {
  Search,
  FileText,
  Type,
  Globe,
  Database,
  HelpCircle,
  Trash2,
  Loader2,
  Eye,
} from "lucide-react";

// Source definitions
import { DataSource } from "@/types/source.types";

// Map API source types to UI elements
export const sourceIcons = {
  file: FileText,
  text: Type,
  website: Globe,
  database: Database,
  qa: HelpCircle,
};

export const sourceLabels = {
  file: "Files",
  text: "Text",
  website: "Website",
  database: "Database",
  qa: "Q&A",
};

// Create a helper function to get count from source properties
const getSourceCount = (source: DataSource): number => {
  // For TextSource
  if (source.type === "text") {
    return 1;
  }

  // For WebsiteSource
  if (source.type === "website") {
    return source.pageCount || source.metadata?.pageCount || 0;
  }

  // For DatabaseSource
  if (source.type === "database") {
    return source.recordCount || source.metadata?.recordCount || 0;
  }

  // For QASource
  if (source.type === "qa") {
    return source.questions?.length || source.metadata?.questions?.length || 0;
  }

  // For FileSource
  if (source.type === "file") {
    return source.metadata?.fileCount || 1;
  }

  // Default fallback
  return 1;
};

interface AllSourcesTableProps {
  sources: DataSource[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

function AllSourcesTableComponent({
  sources,
  isOpen,
  onClose,
  onRefresh,
}: AllSourcesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<DataSource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the delete source mutation hook
  const { mutate: deleteSource, isPending } = useDeleteSource();

  // Filter sources based on search query
  const filteredSources = sources.filter(
    (source) =>
      // Safely handle undefined name property
      (source.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      sourceLabels[source.type]
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Handle delete source
  const handleDeleteClick = (source: DataSource) => {
    console.log("Delete clicked for source:", source);
    setSourceToDelete(source);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (!sourceToDelete) {
      console.error("Missing sourceToDelete");
      return;
    }

    try {
      setIsDeleting(true);
      console.log("Attempting to delete source:", sourceToDelete.id);

      deleteSource(Number(sourceToDelete.id), {
        onSuccess: () => {
          console.log("Source deleted successfully");
          // Toast notification is automatically handled by the hook

          // Call the refresh function if provided to update the list
          if (onRefresh) {
            onRefresh();
          }
        },
        onError: (error) => {
          console.error("Error deleting source:", error);
          toast({
            title: "Delete failed",
            description: "There was a problem deleting this source.",
            variant: "destructive",
          });
        },
        onSettled: () => {
          setIsDeleting(false);
          setDeleteDialogOpen(false);
          setSourceToDelete(null);
        },
      });
    } catch (error) {
      console.error("Error during delete operation:", error);
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSourceToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Sources</DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-2 pb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear
            </Button>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  {/* Removed Count column */}
                  <TableHead>Date Added</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSources.length > 0 ? (
                  filteredSources.map((source) => {
                    const Icon = sourceIcons[source.type];
                    return (
                      <TableRow key={source.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{sourceLabels[source.type]}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {source.name || "Unnamed Source"}
                        </TableCell>
                        {/* Removed Count cell */}
                        <TableCell>
                          {new Date(source.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted"
                              onClick={() => {
                                // TODO: Implement view action
                                toast({
                                  title: "View source",
                                  description: `Viewing '${source.name}' (not yet implemented)`,
                                });
                              }}
                              title="View source"
                              type="button">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-red-100 hover:text-red-700"
                              onClick={() => {
                                console.log("Delete button clicked");
                                handleDeleteClick(source);
                              }}
                              disabled={isDeleting}
                              title="Delete source"
                              type="button">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground">
                      No sources found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            console.log("AlertDialog onOpenChange:", open);
            if (!open && !isDeleting) {
              setDeleteDialogOpen(false);
              setSourceToDelete(null);
            }
          }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the source{" "}
                <span className="font-medium">{sourceToDelete?.name}</span>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeleting || isPending}
                onClick={() => {
                  console.log("Cancel clicked");
                  setDeleteDialogOpen(false);
                  setSourceToDelete(null);
                }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  console.log("Confirm delete clicked");
                  e.preventDefault();
                  handleConfirmDelete();
                }}
                disabled={isDeleting || isPending}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                {isDeleting || isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

// Optimize with React.memo to prevent unnecessary re-renders
export const AllSourcesTable = memo(AllSourcesTableComponent);
