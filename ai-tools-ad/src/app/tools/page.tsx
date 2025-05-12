"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, ArrowUpDown, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/cards/tool-card";
import { ToolDetailDialog } from "@/components/tools/tool-detail-dialog";
import { ToolFilterSidebar } from "@/components/tools/tool-filter-sidebar";
import { aiTools, type ToolCategory, type ToolPricing, categories, pricingOptions } from "@/lib/data/tools";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ToolCategory[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<ToolPricing[]>([]);
  const [sortOption, setSortOption] = useState<"rating" | "users" | "newest">("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toolsPerPage = 9;

  // Filter tools based on search query, categories, and pricing
  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch = searchQuery 
      ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesCategory = selectedCategories.length > 0 
      ? selectedCategories.includes(tool.category)
      : true;
      
    const matchesPricing = selectedPricing.length > 0
      ? selectedPricing.includes(tool.pricing)
      : true;
      
    return matchesSearch && matchesCategory && matchesPricing;
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
  }, [searchQuery, selectedCategories, selectedPricing, sortOption]);
  
  // Handle category toggle
  const toggleCategory = (category: ToolCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Handle pricing toggle
  const togglePricing = (pricing: ToolPricing) => {
    setSelectedPricing(prev => 
      prev.includes(pricing)
        ? prev.filter(p => p !== pricing)
        : [...prev, pricing]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedPricing([]);
    setSortOption("rating");
  };
  
  // Open tool detail
  const openToolDetail = (toolId: string) => {
    setSelectedTool(toolId);
  };
  
  // Get selected tool data
  const selectedToolData = selectedTool ? aiTools.find(tool => tool.id === selectedTool) : null;
  
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header Bar */}
      <div className="bg-gray-900 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
              AI <span className="text-cyber-green">Tools</span> Explorer
            </h1>
            <p className="max-w-2xl text-lg text-gray-300">
              Discover and compare the most powerful AI tools to enhance your productivity and creativity.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container py-12">
        <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-8 lg:space-y-0">
          {/* Filters for Desktop */}
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <ToolFilterSidebar
                selectedCategories={selectedCategories}
                selectedPricing={selectedPricing}
                toggleCategory={toggleCategory}
                togglePricing={togglePricing}
                clearFilters={clearFilters}
              />
            </div>
          </div>
          
          <div className="flex-1">
            {/* Search and Filter Bar */}
            <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              {/* Search Input */}
              <div className="relative flex w-full max-w-md items-center">
                <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setSortOption(prev => 
                      prev === "rating" ? "users" : prev === "users" ? "newest" : "rating"
                    )}
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort by: {sortOption === "rating" ? "Rating" : sortOption === "users" ? "Popularity" : "Newest"}
                  </button>
                </div>
                
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                
                {/* Clear Filters - Only show if filters are applied */}
                {(selectedCategories.length > 0 || selectedPricing.length > 0 || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || selectedPricing.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map(category => (
                  <span 
                    key={category}
                    className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {category}
                    <button 
                      className="ml-1.5 rounded-full bg-primary/20 p-0.5 hover:bg-primary/30"
                      onClick={() => toggleCategory(category)}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
                
                {selectedPricing.map(pricing => (
                  <span 
                    key={pricing}
                    className="flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary"
                  >
                    {pricing}
                    <button 
                      className="ml-1.5 rounded-full bg-secondary/20 p-0.5 hover:bg-secondary/30"
                      onClick={() => togglePricing(pricing)}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Mobile Filters (Slide Down) */}
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden rounded-lg border bg-card p-4 lg:hidden"
              >
                <ToolFilterSidebar
                  selectedCategories={selectedCategories}
                  selectedPricing={selectedPricing}
                  toggleCategory={toggleCategory}
                  togglePricing={togglePricing}
                  clearFilters={clearFilters}
                  isMobile
                />
              </motion.div>
            )}
            
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{currentTools.length}</span> of <span className="font-medium text-foreground">{filteredTools.length}</span> tools
              </p>
            </div>
            
            {/* Tools Grid */}
            {currentTools.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
                <h3 className="text-xl font-semibold">No tools found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentTools.map((tool, index) => (
                  <div key={tool.id} onClick={() => openToolDetail(tool.id)} className="cursor-pointer">
                    <ToolCard tool={tool} index={index} />
                  </div>
                ))}
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
        </div>
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