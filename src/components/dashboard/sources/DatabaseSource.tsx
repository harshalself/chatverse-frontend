import { useState } from "react";
import {
  Database,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useDeleteSource } from "@/hooks/use-base-sources";
// NOTE: Database source specific hooks need to be implemented

export function DatabaseSource() {
  // Data hooks - Database sources functionality needs to be implemented
  const databaseSourcesData = { data: [] };
  const databaseSourcesLoading = false;
  const databaseSourcesError = null;
  const refetchDatabaseSources = () => {};
  const createDatabaseSource = () => {};
  const createLoading = false;
  const { mutate: deleteSource } = useDeleteSource();
  const testConnection = () => {};
  const databaseSources = databaseSourcesData?.data || [];
  const [dbType, setDbType] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  // Data hooks
  // ...stubbed hooks and variables above...

  const buildConnectionString = () => {
    if (!dbType || !host || !database || !username) return "";

    const portPart = port ? `:${port}` : "";
    const passwordPart = password ? `:${password}` : "";

    switch (dbType) {
      case "postgresql":
        return `postgresql://${username}${passwordPart}@${host}${portPart}/${database}`;
      case "mysql":
        return `mysql://${username}${passwordPart}@${host}${portPart}/${database}`;
      case "mongodb":
        return `mongodb://${username}${passwordPart}@${host}${portPart}/${database}`;
      default:
        return `${dbType}://${username}${passwordPart}@${host}${portPart}/${database}`;
    }
  };

  const handleTestConnection = () => {
    // TODO: Implement database connection testing
    toast({
      title: "Not Implemented",
      description: "Database connection testing is not yet implemented",
      variant: "destructive",
    });
  };

  const handleAddDatabase = () => {
    // TODO: Implement database source creation
    toast({
      title: "Not Implemented",
      description: "Database source creation is not yet implemented",
      variant: "destructive",
    });
  };

  const handleDeleteDatabase = (id: string, name: string) => {
    deleteSource(Number(id), {
      onSuccess: () => {
        toast({
          title: "Database source deleted",
          description: `"${name}" has been removed from your knowledge base.`,
        });
        refetchDatabaseSources();
      },
      onError: () => {
        toast({
          title: "Failed to delete database source",
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
    <div className="flex-1 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Database Source
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Connect to your database to extract structured data
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Add Database Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dbType">Database Type</Label>
            <Select value={dbType} onValueChange={setDbType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="redis">Redis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="5432"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">Database Name</Label>
            <Input
              id="database"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              placeholder="my_database"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
            <Button
              onClick={handleAddDatabase}
              disabled={
                !dbType || !host || !database || !username || createLoading
              }
              className="flex-1">
              {createLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {createLoading ? "Adding..." : "Add Database Source"}
            </Button>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={
                !dbType ||
                !host ||
                !database ||
                !username ||
                isTestingConnection
              }
              className="xs:w-auto w-full">
              {isTestingConnection ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span className="ml-2 xs:hidden">Test Connection</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Database Sources */}
      <div className="mt-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Existing Database Sources
        </h3>

        {databaseSourcesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : databaseSourcesError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load database sources.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchDatabaseSources()}
                className="ml-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : databaseSources.length > 0 ? (
          <div className="space-y-4">
            {databaseSources.map((source) => (
              <Card key={source.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                        <Database className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {source.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                          {source.metadata?.dbType || "Database"} •{" "}
                          {source.metadata?.host || "Unknown host"}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground mt-2">
                          <span>Updated {formatDate(source.updatedAt)}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{source.metadata?.tableCount || 0} tables</span>
                          <span className="hidden sm:inline">•</span>
                          <span>
                            {source.metadata?.recordCount || 0} records
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
                      <Badge
                        variant="secondary"
                        className={`text-xs
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
                            title: "Opening database source",
                            description: `Opening "${source.name}"...`,
                          });
                          // TODO: Implement database viewer
                        }}
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteDatabase(source.id, source.name)
                        }
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9">
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
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">
                No database sources yet
              </h4>
              <p className="text-muted-foreground">
                Connect your first database using the form above
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
