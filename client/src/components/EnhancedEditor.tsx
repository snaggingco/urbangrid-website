import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LinkManager from "./LinkManager";

interface EnhancedEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  id?: string;
}

export default function EnhancedEditor({
  label = "Content",
  value,
  onChange,
  placeholder = "Write your content here...",
  rows = 15,
  error,
  id = "content"
}: EnhancedEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Enhanced paste handler to preserve formatting
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');
    
    let processedContent = '';
    
    if (htmlData) {
      // Process HTML content and convert to our format
      processedContent = convertHtmlToEditorFormat(htmlData);
    } else if (textData) {
      // Process plain text and preserve line breaks
      processedContent = convertPlainTextToEditorFormat(textData);
    }
    
    if (processedContent) {
      insertAtCursor(processedContent);
    }
  };

  // Convert HTML content to editor format
  const convertHtmlToEditorFormat = (html: string): string => {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Convert common formatting
    let converted = tempDiv.innerHTML;
    
    // Preserve existing HTML tags but clean up common issues
    converted = converted
      // Convert <b> to <strong>
      .replace(/<b([^>]*)>/gi, '<strong$1>')
      .replace(/<\/b>/gi, '</strong>')
      // Convert <i> to <em>
      .replace(/<i([^>]*)>/gi, '<em$1>')
      .replace(/<\/i>/gi, '</em>')
      // Convert div to p tags
      .replace(/<div([^>]*)>/gi, '<p$1>')
      .replace(/<\/div>/gi, '</p>')
      // Convert double line breaks to paragraph breaks
      .replace(/\n\s*\n/g, '</p>\n<p>')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Remove style attributes for cleaner content
      .replace(/\sstyle="[^"]*"/gi, '')
      // Remove class attributes
      .replace(/\sclass="[^"]*"/gi, '')
      // Remove font tags
      .replace(/<\/?font[^>]*>/gi, '')
      // Remove span tags but keep content
      .replace(/<span[^>]*>([^<]*)<\/span>/gi, '$1')
      // Clean up empty paragraphs
      .replace(/<p[^>]*>\s*<\/p>/gi, '')
      // Remove o:p tags from Word
      .replace(/<\/?o:p[^>]*>/gi, '')
      // Clean up Word-specific elements
      .replace(/<\/?w:[^>]*>/gi, '')
      // Remove XML namespaces
      .replace(/\s*xmlns[^=]*="[^"]*"/gi, '');
    
    // If no proper HTML structure, wrap in paragraphs
    if (!converted.includes('<p>') && !converted.includes('<h1>') && !converted.includes('<h2>')) {
      const lines = converted.split('\n').filter(line => line.trim());
      converted = lines.map(line => `<p>${line.trim()}</p>`).join('\n');
    }
    
    return converted;
  };

  // Convert plain text to editor format with preserved line breaks
  const convertPlainTextToEditorFormat = (text: string): string => {
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    const converted = paragraphs
      .filter(para => para.trim())
      .map(para => {
        // Single line breaks within paragraphs become <br>
        const content = para.trim().replace(/\n/g, '<br>');
        return `<p>${content}</p>`;
      })
      .join('\n');
    
    return converted || `<p>${text.replace(/\n/g, '<br>')}</p>`;
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const insertFormatting = (beforeTag: string, afterTag: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let insertText;
    if (selectedText) {
      // Wrap selected text
      insertText = `${beforeTag}${selectedText}${afterTag}`;
    } else {
      // Insert tags with placeholder
      const placeholder = afterTag ? "text" : "";
      insertText = `${beforeTag}${placeholder}${afterTag}`;
    }
    
    const newValue = value.substring(0, start) + insertText + value.substring(end);
    onChange(newValue);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + insertText.length, start + insertText.length);
      } else {
        const placeholderStart = start + beforeTag.length;
        const placeholderEnd = placeholderStart + (afterTag ? "text".length : 0);
        textarea.setSelectionRange(placeholderStart, placeholderEnd);
      }
    }, 0);
  };

  const formatButtons = [
    {
      icon: "fas fa-bold",
      title: "Bold",
      action: () => insertFormatting("<strong>", "</strong>")
    },
    {
      icon: "fas fa-italic", 
      title: "Italic",
      action: () => insertFormatting("<em>", "</em>")
    },
    {
      icon: "fas fa-heading",
      title: "Heading 2",
      action: () => insertFormatting("<h2>", "</h2>")
    },
    {
      icon: "fas fa-heading",
      title: "Heading 3", 
      action: () => insertFormatting("<h3>", "</h3>")
    },
    {
      icon: "fas fa-paragraph",
      title: "Paragraph",
      action: () => insertFormatting("<p>", "</p>")
    },
    {
      icon: "fas fa-list-ul",
      title: "Bullet List",
      action: () => insertFormatting("<ul>\n  <li>", "</li>\n  <li>Item 2</li>\n</ul>")
    },
    {
      icon: "fas fa-list-ol",
      title: "Numbered List", 
      action: () => insertFormatting("<ol>\n  <li>", "</li>\n  <li>Item 2</li>\n</ol>")
    },
    {
      icon: "fas fa-quote-right",
      title: "Blockquote",
      action: () => insertFormatting("<blockquote>\n  <p>", "</p>\n</blockquote>")
    }
  ];

  return (
    <div className="space-y-4">
      <Label htmlFor={id}>{label} *</Label>
      
      {/* Editor Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Formatting Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={button.action}
                title={button.title}
                className="text-xs"
              >
                <i className={`${button.icon} mr-1`}></i>
                {button.title === "Heading 3" ? "H3" : button.title === "Heading 2" ? "H2" : ""}
              </Button>
            ))}
            
            <div className="border-l border-gray-200 mx-2"></div>
            
            <LinkManager 
              onInsertLink={insertAtCursor}
              trigger={
                <Button type="button" variant="outline" size="sm">
                  <i className="fas fa-link mr-1"></i>
                  Link
                </Button>
              }
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <i className={`fas ${showPreview ? 'fa-edit' : 'fa-eye'} mr-1`}></i>
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>

          {showPreview ? (
            <div className="border rounded-md p-4 bg-gray-50 min-h-[300px]">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: value || "<p>Nothing to preview yet...</p>" }}
              />
            </div>
          ) : (
            <Textarea
              ref={textareaRef}
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onPaste={handlePaste}
              placeholder={placeholder}
              rows={rows}
              className={`font-mono text-sm ${error ? "border-red-500" : ""}`}
            />
          )}
          
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
          
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>• Use the toolbar buttons to format your content</p>
            <p>• Click "Link" to add internal links to other blog posts or external links</p>
            <p>• Click "Preview" to see how your content will look</p>
            <p>• You can paste formatted content - bold, italic, and line breaks will be preserved</p>
            <p>• You can also type HTML directly for advanced formatting</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}