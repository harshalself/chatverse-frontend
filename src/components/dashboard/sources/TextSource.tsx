import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function TextSource() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddText = () => {
    if (title && description) {
      // Add text source logic here
      console.log("Adding text source:", { title, description });
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Text Source</h2>
          <p className="text-muted-foreground">Add custom text content to your knowledge base</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Text Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your text content"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your text content here..."
              className="min-h-[200px]"
            />
          </div>

          <Button onClick={handleAddText} disabled={!title || !description}>
            <Plus className="h-4 w-4 mr-2" />
            Add Text Source
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}