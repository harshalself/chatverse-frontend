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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  Type,
  Globe,
  Database,
  HelpCircle,
} from "lucide-react";

// Source type definitions
export interface Source {
  id: string;
  type: "files" | "text" | "website" | "database" | "qa";
  name: string;
  count: number;
  dateAdded?: string;
}

export const sourceIcons = {
  files: FileText,
  text: Type,
  website: Globe,
  database: Database,
  qa: HelpCircle,
};

export const sourceLabels = {
  files: "Files",
  text: "Text",
  website: "Website",
  database: "Database",
  qa: "Q&A",
};

interface AllSourcesTableProps {
  sources: Source[];
  isOpen: boolean;
  onClose: () => void;
}

function AllSourcesTableComponent({
  sources,
  isOpen,
  onClose,
}: AllSourcesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sources based on search query
  const filteredSources = sources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sourceLabels[source.type]
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
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
                <TableHead>Count</TableHead>
                <TableHead>Date Added</TableHead>
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
                        {source.name}
                      </TableCell>
                      <TableCell>{source.count}</TableCell>
                      <TableCell>{source.dateAdded || "Unknown"}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
  );
}

// Optimize with React.memo to prevent unnecessary re-renders
export const AllSourcesTable = memo(AllSourcesTableComponent);
