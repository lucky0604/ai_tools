"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, Calendar, Users, ArrowUpDown, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/cards/tool-card";
import { ToolDetailDialog } from "@/components/tools/tool-detail-dialog";
import { aiTools, type ToolCategory } from "@/lib/data/tools";

export default function TrendingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [sortOption, setSortOption] = useState<"rating" | "users" | "newest">("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
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
    <div className="min-h-screen bg-background pt-20">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-cyber-purple/90 to-cyber-blue/80 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-white" />
              <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
                Trending <span className="text-cyber-orange">AI Tools</span>
              </h1>
            </div>
            <p className="max-w-2xl text-lg text-gray-100">
              Discover the most popular and fastest-growing AI tools that are making waves in the industry.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container py-12">
        {/* Timeframe and Search Bar */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          {/* Timeframe Selector */}
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

          {/* Search Input */}
          <div className="relative flex w-full max-w-md items-center">
            <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search trending tools..."
              className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
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
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="rounded-full"
            >
              Clear
            </Button>
          )}
        </div>
        
        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <div className="flex items-center space-x-2 rounded-lg border border-input bg-card p-1">
              <Button
                variant={sortOption === "users" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortOption("users")}
                className="rounded-md flex items-center gap-1"
              >
                <Users className="h-3.5 w-3.5" />
                Popularity
              </Button>
              <Button
                variant={sortOption === "rating" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortOption("rating")}
                className="rounded-md flex items-center gap-1"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Rating
              </Button>
              <Button
                variant={sortOption === "newest" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortOption("newest")}
                className="rounded-md flex items-center gap-1"
              >
                <Calendar className="h-3.5 w-3.5" />
                Newest
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{currentTools.length}</span> of <span className="font-medium text-foreground">{filteredTools.length}</span> tools
          </p>
        </div>
        
        {/* Tools Display */}
        {currentTools.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
            <h3 className="text-xl font-semibold">No trending tools found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -left-40 top-20 h-64 w-64 rounded-full bg-cyber-purple/20 blur-3xl" />
            <div className="absolute -right-40 bottom-20 h-64 w-64 rounded-full bg-cyber-orange/10 blur-3xl" />
            
            {/* Tools Grid - Using a different layout than the tools page */}
            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative"
                  onClick={() => openToolDetail(tool.id)}
                >
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue opacity-0 blur transition duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <ToolCard tool={tool} index={index} />
                  </div>
                  
                  {/* Rank Badge */}
                  <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cyber-orange font-bold text-black shadow-lg">
                    #{index + 1 + (currentPage - 1) * toolsPerPage}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              // Show only a few pages if there are many
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, i, array) => (
                <React.Fragment key={page}>
                  {i > 0 && array[i - 1] !== page - 1 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))
            }
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
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