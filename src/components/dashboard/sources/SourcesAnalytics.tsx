import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  UserIcon,
  FileIcon,
  ClockIcon,
  UsersIcon,
  Brain,
  Database,
  Globe,
  FileText,
  HelpCircle,
  Type,
} from "lucide-react";

/**
 * A component that displays analytics about user interaction with sources
 */
export function SourcesAnalytics() {
  // Mock data for visualization - in real app, this would come from API
  const sourceUsageData = [
    { name: "Database", value: 65 },
    { name: "Files", value: 42 },
    { name: "Website", value: 38 },
    { name: "Text", value: 27 },
    { name: "Q&A", value: 19 },
  ];

  const usageByTimeData = [
    { name: "Mon", value: 23 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 37 },
    { name: "Thu", value: 52 },
    { name: "Fri", value: 48 },
    { name: "Sat", value: 18 },
    { name: "Sun", value: 12 },
  ];

  // Mock user engagement data
  const topUsers = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      accessCount: 42,
      avatar: "",
    },
    {
      id: 2,
      name: "Jamie Smith",
      email: "jamie@example.com",
      accessCount: 37,
      avatar: "",
    },
    {
      id: 3,
      name: "Taylor Kim",
      email: "taylor@example.com",
      accessCount: 28,
      avatar: "",
    },
    {
      id: 4,
      name: "Morgan Lee",
      email: "morgan@example.com",
      accessCount: 25,
      avatar: "",
    },
  ];

  // Mock popular sources
  const topSources = [
    { id: 6, name: "Customer Database", type: "database", accessCount: 142 },
    { id: 3, name: "example.com", type: "website", accessCount: 98 },
    {
      id: 1,
      name: "Product Documentation.pdf",
      type: "files",
      accessCount: 76,
    },
    { id: 4, name: "FAQ Pairs", type: "qa", accessCount: 52 },
  ];

  // Source type icons
  const sourceIcons = {
    files: FileText,
    text: Type,
    website: Globe,
    database: Database,
    qa: HelpCircle,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Source Analytics</h2>
      <p className="text-muted-foreground">
        Explore how users are interacting with your knowledge sources
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage by Source Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Source Usage by Type</CardTitle>
            <CardDescription>
              Which source types are most frequently accessed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sourceUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  name="Usage Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage by Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Source Access Over Time</CardTitle>
            <CardDescription>Daily source access patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={usageByTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  name="Source Access"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sources Overview</CardTitle>
            <CardDescription>Summary of source engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Sources</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ClockIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Average Usage Time</p>
                  <p className="text-2xl font-bold">8.4 min</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UsersIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Sources */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Top Sources by User Engagement
            </CardTitle>
            <CardDescription>Most frequently accessed sources</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sources">
              <TabsList className="mb-4">
                <TabsTrigger value="sources">Top Sources</TabsTrigger>
                <TabsTrigger value="users">Top Users</TabsTrigger>
              </TabsList>

              <TabsContent value="sources" className="space-y-4">
                {topSources.map((source) => {
                  const Icon = sourceIcons[source.type] || Brain;

                  return (
                    <div
                      key={source.id}
                      className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {source.type}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {source.accessCount} accesses
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {Math.round((source.accessCount / 368) * 100)}%
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                {topUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {user.accessCount} accesses
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Source Engagement Insights</CardTitle>
          <CardDescription>
            Recommendations based on usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <h3 className="font-semibold mb-2">
              Optimize Database Access Patterns
            </h3>
            <p className="text-sm text-muted-foreground">
              Database sources are your most accessed data type. Consider
              implementing caching strategies to improve performance and reduce
              load on these resources.
            </p>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-lg">
            <h3 className="font-semibold mb-2">Underutilized Resources</h3>
            <p className="text-sm text-muted-foreground">
              3 sources have had no access in the past 30 days. Consider
              archiving or repurposing these resources to optimize your data
              infrastructure.
            </p>
          </div>

          <div className="p-4 bg-green-500/10 rounded-lg">
            <h3 className="font-semibold mb-2">User Training Opportunity</h3>
            <p className="text-sm text-muted-foreground">
              4 users have accessed API sources but lack typical access
              patterns. Consider providing additional training on API usage best
              practices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
