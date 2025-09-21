import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Bold, Italic, Link, List, ListOrdered, Quote, Code, Eye } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing..."
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea[data-markdown]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const renderPreview = (markdown: string) => {
    // Simple markdown to HTML conversion for preview
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>');
    
    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
    
    // Lists
    html = html.replace(/^\* (.*)$/gim, '<li class="ml-4">• $1</li>');
    html = html.replace(/^(\d+)\. (.*)$/gim, '<li class="ml-4">$1. $2</li>');
    
    // Blockquotes
    html = html.replace(/^> (.*)$/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground">$1</blockquote>');
    
    // Code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = '<p class="mb-4">' + html + '</p>';
    
    return html;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
        <div className="bg-muted/30 px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('**', '**')}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('*', '*')}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('[', '](url)')}
                title="Link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('* ', '')}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('1. ', '')}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('> ', '')}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('`', '`')}
                title="Code"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
            
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="write" className="text-xs">Write</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="write" className="m-0">
          <Textarea
            data-markdown
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-96 resize-none border-0 rounded-none focus:ring-0"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="m-0">
          <Card className="border-0 rounded-none">
            <CardContent className="p-4 min-h-96">
              {value ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
                />
              ) : (
                <p className="text-muted-foreground italic">Nothing to preview yet. Start writing in the Write tab!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};