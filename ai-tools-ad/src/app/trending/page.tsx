"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TrendingUp, Calendar, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolDetailDialog } from "@/components/tools/tool-detail-dialog";
import { type ToolCategory } from "@/lib/data/tools";
import { PageLayout } from "@/components/layout/page-layout";
import { ToolList } from "@/components/tools/tool-list";
import { ToolSearchSort } from "@/components/tools/tool-search-sort";
import { Pagination } from "@/components/ui/pagination";
import { useTrendingTools, useTool, useCategories, useFilteredTools } from "@/lib/hooks/use-tools";

export default function TrendingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [sortOption, setSortOption] = useState<"rating" | "users" | "newest" | "name">("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const toolsPerPage = 6;

  // 基于选择的时间周期构建查询参数
  const getTimeframeQuery = (timeframe: "week" | "month" | "year"): string => {
    const now = new Date();
    let date = new Date();
    
    switch (timeframe) {
      case "week":
        date.setDate(now.getDate() - 7);
        break;
      case "month":
        date.setMonth(now.getMonth() - 1);
        break;
      case "year":
        date.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // 获取趋势工具，根据时间框架不同可能需要不同的 API 调用
  const { tools: allTrendingTools, isLoading: isLoadingTrending } = useFilteredTools({
    trending: true,
    sort: sortOption
  });

  // 获取所有可用的类别
  const { categories } = useCategories();

  // 添加额外的过滤和处理
  const filteredTools = useMemo(() => {
    if (!allTrendingTools) return [];

    // 设置创建时间过滤器
    const timeframeDate = getTimeframeQuery(timeframe);
    
    return allTrendingTools.filter(tool => {
      // 时间框架过滤
      const toolDate = new Date(tool.lastUpdated).toISOString().split('T')[0];
      const isInTimeframe = toolDate >= timeframeDate;

      // 搜索过滤
      const matchesSearch = searchQuery 
        ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
        
      // 类别过滤
      const matchesCategory = selectedCategory 
        ? tool.category === selectedCategory
        : true;
        
      return isInTimeframe && matchesSearch && matchesCategory;
    });
  }, [allTrendingTools, searchQuery, selectedCategory, timeframe]);
  
  // 获取类别选项，基于当前的趋势工具
  const categoryOptions = useMemo(() => {
    if (!allTrendingTools || allTrendingTools.length === 0) return [];
    
    const categories = new Set<ToolCategory>();
    allTrendingTools.forEach(tool => {
      categories.add(tool.category);
    });
    
    return Array.from(categories);
  }, [allTrendingTools]);
  
  // 分页
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const currentTools = filteredTools.slice(
    (currentPage - 1) * toolsPerPage,
    currentPage * toolsPerPage
  );
  
  // 重置为第1页当过滤器改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortOption, timeframe]);
  
  // 打开工具详情
  const openToolDetail = (toolId: string) => {
    setSelectedTool(toolId);
  };
  
  // 获取选定的工具数据
  const { tool: selectedToolData } = useTool(selectedTool || "");
  
  // 清除所有过滤器
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
        {categoryOptions.map(category => (
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
        ))}
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
          isLoading={isLoadingTrending}
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
          badgeRender={(tool) => (
            <div className="absolute right-2 top-2 z-10 rounded-full bg-cyber-orange px-2 py-1 text-xs font-medium text-white">
              Trending
            </div>
          )}
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