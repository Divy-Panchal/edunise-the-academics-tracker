import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Search, Folder, Download, Star } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: "pdf" | "doc" | "note" | "image";
  subject: string;
  size: string;
  uploadDate: string;
  favorite: boolean;
}

const ResourceLocker = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      name: "Data Structures Notes.pdf",
      type: "pdf",
      subject: "DSA",
      size: "2.4 MB",
      uploadDate: "2024-01-20",
      favorite: true
    },
    {
      id: "2",
      name: "DBMS Cheatsheet.pdf",
      type: "pdf",
      subject: "DBMS",
      size: "1.8 MB",
      uploadDate: "2024-01-19",
      favorite: false
    },
    {
      id: "3",
      name: "Web Dev Project Ideas",
      type: "note",
      subject: "Web Tech",
      size: "0.5 MB",
      uploadDate: "2024-01-18",
      favorite: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-destructive" />;
      case "note":
        return <FileText className="w-4 h-4 text-primary" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setResources(resources.map(resource =>
      resource.id === id ? { ...resource, favorite: !resource.favorite } : resource
    ));
  };

  return (
    <Card className="h-full shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-lg font-semibold">Resource Locker</CardTitle>
          <Button size="sm" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-muted/50 transition-smooth cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              {getTypeIcon(resource.type)}
              <Folder className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{resource.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {resource.subject}
                </Badge>
                <span className="text-xs text-muted-foreground">{resource.size}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleFavorite(resource.id)}
                className={resource.favorite ? "text-warning" : "text-muted-foreground"}
              >
                <Star className="w-4 h-4" fill={resource.favorite ? "currentColor" : "none"} />
              </Button>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No resources found</p>
            <Button variant="outline" className="mt-3 gap-2">
              <Upload className="w-4 h-4" />
              Upload your first resource
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceLocker;