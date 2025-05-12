"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolDetailDialog } from "@/components/tools/tool-detail-dialog";
import { ToolFilterSidebar } from "@/components/tools/tool-filter-sidebar";
import { type ToolCategory, type ToolPricing } from "@/lib/data/tools";
import { useFilteredTools, usePricingOptions, useCategories, useTool } from "@/lib/hooks/use-tools";
import { PageLayout } from "@/components/layout/page-layout";
import { ToolList } from "@/components/tools/tool-list";
import { ToolSearchSort } from "@/components/tools/tool-search-sort";
import { Pagination } from "@/components/ui/pagination";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ToolCategory[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<ToolPricing[]>([]);
  const [sortOption, setSortOption] = useState<"rating" | "users" | "newest" | "name">("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toolsPerPage = 9;

  // 获取分类和定价选项
  const { categories = [] } = useCategories();
  const { pricingOptions = [] } = usePricingOptions();
  
  // 使用过滤hook获取工具数据
  const { tools: filteredTools, isLoading } = useFilteredTools({
    category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
    pricing: selectedPricing.length === 1 ? selectedPricing[0] : undefined,
    search: searchQuery || undefined,
    sort: sortOption,
  });
  
  // 获取选中的工具详情
  const { tool: selectedToolData } = useTool(selectedTool || "");
  
  // 排序工具
  const sortedTools = [...filteredTools];
  
  // 分页
  const totalPages = Math.ceil(sortedTools.length / toolsPerPage);
  const currentTools = sortedTools.slice(
    (currentPage - 1) * toolsPerPage,
    currentPage * toolsPerPage
  );
  
  // 过滤器改变时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedPricing, sortOption]);
  
  // 处理类别切换
  const toggleCategory = (category: ToolCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // 处理定价切换
  const togglePricing = (pricing: ToolPricing) => {
    setSelectedPricing(prev => 
      prev.includes(pricing)
        ? prev.filter(p => p !== pricing)
        : [...prev, pricing]
    );
  };
  
  // 清除所有过滤器
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedPricing([]);
    setSortOption("rating");
  };
  
  // 打开工具详情
  const openToolDetail = (toolId: string) => {
    setSelectedTool(toolId);
  };

  // 显示过滤器标签
  const showFilterTags = selectedCategories.length > 0 || selectedPricing.length > 0;
  
  return (
    <PageLayout
      title="AI Tools Explorer"
      description="Discover and compare the most powerful AI tools to enhance your productivity and creativity."
    >
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
              categories={categories}
              pricingOptions={pricingOptions}
            />
          </div>
        </div>
        
        <div className="flex-1">
          {/* Search and Sort Bar */}
          <ToolSearchSort
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            onClearFilters={clearFilters}
            showClearFilters={selectedCategories.length > 0 || selectedPricing.length > 0 || !!searchQuery}
          />
          
          {/* Active Filters Display */}
          {showFilterTags && (
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
                categories={categories}
                pricingOptions={pricingOptions}
              />
            </motion.div>
          )}
          
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{currentTools.length}</span> of <span className="font-medium text-foreground">{filteredTools.length}</span> tools
            </p>
          </div>
          
          {/* Tools List */}
          <ToolList
            tools={currentTools}
            isLoading={isLoading}
            onToolClick={openToolDetail}
            columnCount={3}
          />
          
          {/* Pagination */}
          {!isLoading && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
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
    </PageLayout>
  );
} 