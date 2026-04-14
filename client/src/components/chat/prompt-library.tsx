import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Copy,
  Star,
  Users,
  Heart,
  Globe,
  Building,
  Activity,
  GraduationCap,
  Target
} from "lucide-react";
import { promptLibrary, type PromptCategory, type Prompt, searchPrompts } from "@/data/promptLibrary";

interface PromptLibraryProps {
  onSelectPrompt: (promptText: string) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCategory?: string;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  "ministry-leadership": Users,
  "mens-ministry": Building,
  "womens-ministry": Heart,
  "missions-outreach": Globe,
  "church-planting": Building,
  "health-wellness": Activity,
  "personal-growth": BookOpen,
  "youth-ministry": Target
};

export function PromptLibrary({ onSelectPrompt, children, open, onOpenChange, defaultCategory }: PromptLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory ?? "all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const isDialogOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = (v: boolean) => { setIsOpen(v); onOpenChange?.(v); };

  useEffect(() => {
    if (open) { setSelectedCategory(defaultCategory ?? "all"); setSearchQuery(""); }
  }, [open, defaultCategory]);

  // Get prompts for the selected category
  const getCategoryPrompts = () => {
    if (selectedCategory === "all") {
      return promptLibrary.flatMap(cat => cat.prompts);
    }
    const category = promptLibrary.find(cat => cat.id === selectedCategory);
    console.log(`Category "${selectedCategory}" found:`, category?.name, `with ${category?.prompts?.length || 0} prompts`);
    return category?.prompts || [];
  };

  // Apply search filter to the category prompts
  const filteredPrompts = searchQuery.trim() 
    ? searchPrompts(searchQuery).filter(prompt => {
        if (selectedCategory === "all") return true;
        const categoryPrompts = getCategoryPrompts();
        return categoryPrompts.some(p => p.id === prompt.id);
      })
    : getCategoryPrompts();

  const handleSelectPrompt = (prompt: Prompt) => {
    onSelectPrompt(prompt.text);
    setIsOpen(false);
  };

  const toggleFavorite = (promptId: string) => {
    setFavorites(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] w-[95vw] sm:w-full flex flex-col p-0 mobile-keyboard-safe">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Prompt Library</span>
            <Badge variant="secondary" className="text-xs">
              {filteredPrompts.length} prompts
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Browse pre-written prompts organized by ministry categories to discover what biblical guidance and support you can access.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col px-6 py-4 min-h-0">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search prompts by topic, category, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 w-full h-auto p-1 gap-1 mb-4 mobile-scroll">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              {promptLibrary.map((category) => {
                const IconComponent = categoryIcons[category.id] || BookOpen;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-xs flex items-center justify-center space-x-1 min-h-[40px] px-1 sm:px-2"
                    title={category.description}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="hidden xs:inline text-xs truncate">{category.name.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="flex-1 min-h-0 overflow-hidden">
              {/* Show prompts for selected category */}
              <ScrollArea className="h-full">
                {selectedCategory !== "all" && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    {(() => {
                      const category = promptLibrary.find(cat => cat.id === selectedCategory);
                      return category ? (
                        <>
                          <h3 className="font-semibold text-blue-900 mb-1">{category.name}</h3>
                          <p className="text-sm text-blue-700">{category.description}</p>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
                <PromptGrid 
                  prompts={filteredPrompts}
                  onSelectPrompt={handleSelectPrompt}
                  onToggleFavorite={toggleFavorite}
                  onCopyPrompt={copyPrompt}
                  favorites={favorites}
                  showCategory={selectedCategory === "all"}
                />
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PromptGridProps {
  prompts: Prompt[];
  onSelectPrompt: (prompt: Prompt) => void;
  onToggleFavorite: (promptId: string) => void;
  onCopyPrompt: (text: string) => void;
  favorites: string[];
  showCategory: boolean;
}

function PromptGrid({ 
  prompts, 
  onSelectPrompt, 
  onToggleFavorite, 
  onCopyPrompt, 
  favorites, 
  showCategory 
}: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Search className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">No prompts found</p>
        <p className="text-sm">Try adjusting your search or browse different categories</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 p-1">
      {prompts.map((prompt) => {
          const category = promptLibrary.find(cat => 
            cat.prompts.some(p => p.id === prompt.id)
          );
          
          return (
            <div
              key={prompt.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => onSelectPrompt(prompt)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {prompt.title}
                </h4>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(prompt.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Star 
                      className={`w-3 h-3 ${
                        favorites.includes(prompt.id) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyPrompt(prompt.text);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {prompt.text}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {showCategory && category && (
                    <Badge variant="outline" className="text-xs mr-2">
                      {category.name}
                    </Badge>
                  )}
                  {prompt.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {prompt.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{prompt.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}