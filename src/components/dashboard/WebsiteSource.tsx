import { useState } from "react";
import { Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function WebsiteSource() {
  const [url, setUrl] = useState("");
  const [crawlDepth, setCrawlDepth] = useState("1");

  const handleAddWebsite = () => {
    if (url && crawlDepth) {
      // Add website source logic here
      console.log("Adding website source:", { url, crawlDepth });
      setUrl("");
      setCrawlDepth("1");
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Website Source</h2>
          <p className="text-muted-foreground">Crawl websites to extract content for your knowledge base</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Add Website</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="crawlDepth">Crawl Depth</Label>
            <Select value={crawlDepth} onValueChange={setCrawlDepth}>
              <SelectTrigger>
                <SelectValue placeholder="Select crawl depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 level (current page only)</SelectItem>
                <SelectItem value="2">2 levels</SelectItem>
                <SelectItem value="3">3 levels</SelectItem>
                <SelectItem value="4">4 levels</SelectItem>
                <SelectItem value="5">5 levels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAddWebsite} disabled={!url}>
            <Plus className="h-4 w-4 mr-2" />
            Add Website Source
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}