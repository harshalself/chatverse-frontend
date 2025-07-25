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
import {
  useCreateDatabaseSource,
  useSourcesByType,
  useDeleteSource,
  useTestDatabaseConnection,
} from "@/hooks/use-sources";

export function DatabaseSource() {
  const [dbType, setDbType] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  // Data hooks
  const {
    data: databaseSourcesData,
    isLoading: databaseSourcesLoading,
    error: databaseSourcesError,
    refetch: refetchDatabaseSources,
  } = useSourcesByType("database");

  const { mutate: createDatabaseSource, isPending: createLoading } =
    useCreateDatabaseSource();

  const { mutate: deleteSource } = useDeleteSource();

  const { mutate: testConnection } = useTestDatabaseConnection();

  const databaseSources = databaseSourcesData?.data || [];

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
    const connectionString = buildConnectionString();
    if (!connectionString) {
      toast({
        title: "Connection details incomplete",
        description:
          "Please fill in all required fields to test the connection.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    testConnection(connectionString, {
      onSuccess: (data) => {
        setIsTestingConnection(false);
        toast({
          title: "Connection successful",
          description: `Successfully connected to ${database} database.`,
        });
      },
      onError: (error) => {
        setIsTestingConnection(false);
        toast({
          title: "Connection failed",
          description: `Could not connect to the database. Please check your credentials and try again.`,
          variant: "destructive",
        });
      },
    });
  };

  const handleAddDatabase = () => {
    const connectionString = buildConnectionString();
    if (dbType && host && database && username && connectionString) {
      createDatabaseSource(
        {
          name: `${dbType}:${host}/${database}`,
          connectionString: connectionString,
        },
        {
          onSuccess: (data) => {
            toast({
              title: "Database source created",
              description: `Connected to ${database} database successfully.`,
            });
            // Reset form
            setDbType("");
            setHost("");
            setPort("");
            setDatabase("");
            setUsername("");
            setPassword("");
            refetchDatabaseSources();
          },
          onError: (error) => {
            toast({
              title: "Failed to create database source",
              description:
                "Please check your connection details and try again.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDeleteDatabase = (id: string, name: string) => {
    deleteSource(id, {
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
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Database Source
          </h2>
          <p className="text-muted-foreground">
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
              <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="5432"
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
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
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
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
              }>
              {isTestingConnection ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Database Sources */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Database className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {source.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {source.metadata?.dbType || "Database"} •{" "}
                          {source.metadata?.host || "Unknown host"}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                          <span>Updated {formatDate(source.updatedAt)}</span>
                          <span>•</span>
                          <span>{source.metadata?.tableCount || 0} tables</span>
                          <span>•</span>
                          <span>
                            {source.metadata?.recordCount || 0} records
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
                            title: "Opening database source",
                            description: `Opening "${source.name}"...`,
                          });
                          // TODO: Implement database viewer
                        }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteDatabase(source.id, source.name)
                        }>
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
