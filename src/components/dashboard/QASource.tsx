import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function QASource() {
  const [questionTitle, setQuestionTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAddQA = () => {
    if (questionTitle && question && answer) {
      // Add Q&A source logic here
      console.log("Adding Q&A source:", { questionTitle, question, answer });
      setQuestionTitle("");
      setQuestion("");
      setAnswer("");
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Q&A Source</h2>
          <p className="text-muted-foreground">Add question and answer pairs to your knowledge base</p>
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

          <Button onClick={handleAddQA} disabled={!questionTitle || !question || !answer}>
            <Plus className="h-4 w-4 mr-2" />
            Add Q&A Pair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}