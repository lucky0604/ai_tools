"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolDetailDialog } from "@/components/tools/tool-detail-dialog";
import { aiTools, type ToolCategory } from "@/lib/data/tools";
import { PageLayout } from "@/components/layout/page-layout";
import { ToolList } from "@/components/tools/tool-list";
import { ToolSearchSort } from "@/components/tools/tool-search-sort";
import { Pagination } from "@/components/ui/pagination";

export default function TrendingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [sortOption, setSortOption] = useState<"rating" | "users" | "newest" | "name">("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const toolsPerPage = 6;

  // Filter trending tools based on search query and category
  const trendingTools = aiTools.filter(tool => tool.isTrending);
  
  const filteredTools = trendingTools.filter((tool) => {
    const matchesSearch = searchQuery 
      ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesCategory = selectedCategory 
      ? tool.category === selectedCategory
      : true;
      
    return matchesSearch && matchesCategory;
  });
  
  // Sort tools based on selected option
  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortOption) {
      case "rating":
        return b.rating - a.rating;
      case "users":
        return b.usageStats.users - a.usageStats.users;
      case "newest":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedTools.length / toolsPerPage);
  const currentTools = sortedTools.slice(
    (currentPage - 1) * toolsPerPage,
    currentPage * toolsPerPage
  );
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortOption, timeframe]);
  
  // Open tool detail
  const openToolDetail = (toolId: string) => {
    setSelectedTool(toolId);
  };
  
  // Get selected tool data
  const selectedToolData = selectedTool ? aiTools.find(tool => tool.id === selectedTool) : null;
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortOption("users");
    setTimeframe("month");
  };
  
  return (
    <PageLayout
      title="Trending AI Tools"
      description="Discover the most popular and fastest-growing AI tools that are making waves in the industry."
      icon={TrendingUp}
      backgroundClass="bg-gradient-to-r from-cyber-purple/90 to-cyber-blue/80"
      titleColor="text-cyber-orange"
    >
      {/* Timeframe Selector */}
      <div className="mb-8 flex flex-wrap gap-2">
        <div className="flex items-center space-x-2 rounded-lg border border-input bg-card p-1">
          <Button
            variant={timeframe === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeframe("week")}
            className="rounded-md"
          >
            This Week
          </Button>
          <Button
            variant={timeframe === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeframe("month")}
            className="rounded-md"
          >
            This Month
          </Button>
          <Button
            variant={timeframe === "year" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeframe("year")}
            className="rounded-md"
          >
            This Year
          </Button>
        </div>
      </div>
      
      {/* Search and Sort */}
      <ToolSearchSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={clearFilters}
        showClearFilters={!!searchQuery || !!selectedCategory}
        searchPlaceholder="Search trending tools..."
      />
      
      {/* Category Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {aiTools
          .filter(tool => tool.isTrending)
          .reduce((categories, tool) => {
            if (!categories.includes(tool.category)) {
              categories.push(tool.category);
            }
            return categories;
          }, [] as ToolCategory[])
          .map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${selectedCategory === category ? 'bg-cyber-purple text-white' : ''}`}
              onClick={() => setSelectedCategory(
                selectedCategory === category ? null : category
              )}
            >
              {category}
            </Button>
          ))
        }
      </div>
      
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{currentTools.length}</span> of <span className="font-medium text-foreground">{filteredTools.length}</span> tools
        </p>
      </div>
      
      {/* Tools Display */}
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute -left-40 top-20 h-64 w-64 rounded-full bg-cyber-purple/20 blur-3xl" />
        <div className="absolute -right-40 bottom-20 h-64 w-64 rounded-full bg-cyber-orange/10 blur-3xl" />
        
        <ToolList
          tools={currentTools}
          isLoading={false}
          viewMode={viewMode}
          onToolClick={openToolDetail}
          columnCount={3}
          emptyState={
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
              <h3 className="text-xl font-semibold">No trending tools found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          }
          badgeRender={(tool) => tool.isTrending ? (
            <div className="absolute right-2 top-2 z-10 rounded-full bg-cyber-orange px-2 py-1 text-xs font-medium text-white">
              Trending
            </div>
          ) : null}
        />
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
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