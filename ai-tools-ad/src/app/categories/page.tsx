"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, ChevronRight, Users, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolDetailDialog } from "@/components/tools/tool-detail-dialog";
import { aiTools, categories, type ToolCategory } from "@/lib/data/tools";
import { PageLayout } from "@/components/layout/page-layout";
import { ToolList } from "@/components/tools/tool-list";
import { ToolSearchSort } from "@/components/tools/tool-search-sort";
import { Pagination } from "@/components/ui/pagination";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<"rating" | "users" | "name" | "newest">("rating");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 9;

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
      case "newest":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
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
    setCurrentPage(1);
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
  
  // Pagination logic for listed tools
  const totalPages = Math.ceil(sortedTools.length / toolsPerPage);
  const currentTools = sortedTools.slice(
    (currentPage - 1) * toolsPerPage,
    currentPage * toolsPerPage
  );
  
  // Clear filters 
  const clearFilters = () => {
    setSearchQuery("");
    setSortOption("rating");
  };

  return (
    <PageLayout
      title="AI Tool Categories"
      description="Browse AI tools by category and discover specialized solutions for every need."
      icon={Layers}
      backgroundClass="bg-gradient-to-r from-cyber-blue/90 to-cyber-green/80"
      titleColor="text-cyber-purple"
    >
      {/* Search for all categories */}
      {!selectedCategory && (
        <ToolSearchSort
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchPlaceholder="Search across all categories..."
        />
      )}
      
      {/* Category selection */}
      {selectedCategory && (
        <div className="mb-8 flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
            <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
            Back to Categories
          </Button>
          <h2 className="text-2xl font-bold">{selectedCategory}</h2>
          
          {/* Only show search and sort when a category is selected */}
          <div className="ml-auto">
            <ToolSearchSort
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOption={sortOption}
              onSortChange={setSortOption}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onClearFilters={clearFilters}
              showClearFilters={!!searchQuery}
              searchPlaceholder={`Search in ${selectedCategory}...`}
            />
          </div>
        </div>
      )}

      {/* Category Grid - Only shown when no category is selected */}
      {!selectedCategory && (
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
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

      {/* Selected Category View - Tools List */}
      {selectedCategory && (
        <>
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{currentTools.length}</span> of <span className="font-medium text-foreground">{filteredTools.length}</span> tools
            </p>
          </div>
          
          {/* Tool List */}
          <ToolList
            tools={currentTools}
            isLoading={false}
            viewMode={viewMode}
            onToolClick={openToolDetail}
            columnCount={3}
            badgeRender={(tool) => (
              <div className="absolute right-2 top-2 z-10 flex space-x-1">
                {tool.isNew && (
                  <span className="rounded-full bg-cyber-green px-2 py-1 text-xs font-medium text-white">
                    New
                  </span>
                )}
                {tool.isTrending && (
                  <span className="rounded-full bg-cyber-orange px-2 py-1 text-xs font-medium text-white">
                    Trending
                  </span>
                )}
              </div>
            )}
            emptyState={
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
                <h3 className="text-xl font-semibold">No tools found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            }
          />
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      
      {/* Tool Detail Dialog */}
      {selectedTool && selectedToolData && (
        <ToolDetailDialog
          tool={selectedToolData}
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </PageLayout>
  );
} 