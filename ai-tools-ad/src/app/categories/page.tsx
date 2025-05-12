"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Layers, Grid3X3, ChevronRight, Search, Grid, List, Users, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/cards/tool-card";
import { ToolDetailDialog } from "@/components/tools/tool-detail-dialog";
import { aiTools, categories, type ToolCategory } from "@/lib/data/tools";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<"rating" | "users" | "name">("rating");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Get selected category from URL if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category');
      if (categoryParam && categories.includes(categoryParam as ToolCategory)) {
        setSelectedCategory(categoryParam as ToolCategory);
      }
    }
  }, []);

  // Filter tools based on category and search
  const filteredTools = aiTools.filter((tool) => {
    const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    return matchesCategory && matchesSearch;
  });

  // Sort tools based on selected option
  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortOption) {
      case "rating":
        return b.rating - a.rating;
      case "users":
        return b.usageStats.users - a.usageStats.users;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Create category stats - count tools per category
  const categoryStats = categories.map(category => ({
    name: category,
    count: aiTools.filter(tool => tool.category === category).length,
    trending: aiTools.filter(tool => tool.category === category && tool.isTrending).length,
    new: aiTools.filter(tool => tool.category === category && tool.isNew).length,
  }));

  // Handler for category selection
  const handleCategorySelect = (category: ToolCategory) => {
    setSelectedCategory(prev => prev === category ? null : category);
  };

  // Open tool detail
  const openToolDetail = (toolId: string) => {
    setSelectedTool(toolId);
  };
  
  // Get selected tool data
  const selectedToolData = selectedTool ? aiTools.find(tool => tool.id === selectedTool) : null;

  // Get category color based on name - for visual distinction
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Generative AI": "from-purple-500 to-indigo-500",
      "Text Processing": "from-blue-500 to-cyan-500",
      "Image Generation": "from-green-500 to-teal-500",
      "Code Assistant": "from-yellow-500 to-amber-500",
      "Audio Processing": "from-red-500 to-rose-500",
      "Video Creation": "from-orange-500 to-amber-500",
      "Data Analysis": "from-sky-500 to-blue-500",
      "Chat Bot": "from-pink-500 to-purple-500"
    };
    
    return colors[category] || "from-gray-500 to-gray-700";
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-cyber-blue/90 to-cyber-green/80 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <Layers className="h-8 w-8 text-white" />
              <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
                AI Tool <span className="text-cyber-purple">Categories</span>
              </h1>
            </div>
            <p className="max-w-2xl text-lg text-gray-100">
              Browse AI tools by category and discover specialized solutions for every need.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative flex w-full max-w-md items-center">
            <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search across all categories..."
              className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Grid */}
        {!selectedCategory && (
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Browse Categories</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">View:</span>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryStats.map((category) => (
                  <motion.div
                    key={category.name}
                    whileHover={{ y: -5 }}
                    className="cursor-pointer"
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    <div className="group relative rounded-xl overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(category.name)} opacity-90`}></div>
                      <div className="relative p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                        <p className="text-white/70 text-sm mb-4">
                          {category.count} tools available
                        </p>
                        
                        <div className="flex space-x-2 mb-4">
                          {category.trending > 0 && (
                            <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
                              {category.trending} Trending
                            </span>
                          )}
                          {category.new > 0 && (
                            <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
                              {category.new} New
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white border-white/50 bg-transparent hover:bg-white/20"
                          >
                            Explore
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((category) => (
                  <motion.div
                    key={category.name}
                    whileHover={{ x: 5 }}
                    className="cursor-pointer"
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    <div className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${getCategoryColor(category.name)} flex items-center justify-center text-white`}>
                          <Layers className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.count} tools</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {category.trending > 0 && (
                          <span className="flex items-center text-sm text-muted-foreground">
                            <span className="mr-1 h-2 w-2 rounded-full bg-cyber-orange"></span>
                            {category.trending} trending
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Category View */}
        {selectedCategory && (
          <div>
            <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
                  <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
                  Back
                </Button>
                <h2 className="text-2xl font-bold">{selectedCategory}</h2>
                <span className="rounded-full bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {filteredTools.length} tools
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <div className="flex items-center rounded-lg border border-input bg-card p-1">
                  <Button
                    variant={sortOption === "rating" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortOption("rating")}
                    className="flex items-center rounded-md gap-1"
                  >
                    <Star className="h-3.5 w-3.5" />
                    Rating
                  </Button>
                  <Button
                    variant={sortOption === "users" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortOption("users")}
                    className="flex items-center rounded-md gap-1"
                  >
                    <Users className="h-3.5 w-3.5" />
                    Popularity
                  </Button>
                  <Button
                    variant={sortOption === "name" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortOption("name")}
                    className="rounded-md"
                  >
                    A-Z
                  </Button>
                </div>
                
                <div className="border-l border-border pl-2 flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {sortedTools.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
                <h3 className="text-xl font-semibold">No tools found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or selecting a different category.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            ) : (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => openToolDetail(tool.id)}
                      className="cursor-pointer"
                    >
                      <ToolCard tool={tool} index={index} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="cursor-pointer"
                      onClick={() => openToolDetail(tool.id)}
                    >
                      <div className="flex items-center space-x-4 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border">
                          <img
                            src={tool.logo}
                            alt={`${tool.name} logo`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate pr-4">{tool.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-sm">{tool.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1">{tool.description}</p>
                          
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {tool.pricing}
                            </span>
                            {tool.isNew && (
                              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                                New
                              </span>
                            )}
                            {tool.isTrending && (
                              <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500">
                                Trending
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="shrink-0">
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Tool Detail Dialog */}
      {selectedTool && selectedToolData && (
        <ToolDetailDialog
          tool={selectedToolData}
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
} 