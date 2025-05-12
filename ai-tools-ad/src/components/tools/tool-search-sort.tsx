"use client";

import React from "react";
import { Search, ArrowUpDown, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolSearchSortProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: "rating" | "users" | "newest" | "name";
  onSortChange: (option: "rating" | "users" | "newest" | "name") => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  onFilterToggle?: () => void;
  onClearFilters?: () => void;
  showClearFilters?: boolean;
  searchPlaceholder?: string;
}

export function ToolSearchSort({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  onFilterToggle,
  onClearFilters,
  showClearFilters = false,
  searchPlaceholder = "Search tools..."
}: ToolSearchSortProps) {
  // 获取排序显示文本
  const getSortLabel = () => {
    switch (sortOption) {
      case "rating":
        return "Rating";
      case "users":
        return "Popularity";
      case "newest":
        return "Newest";
      case "name":
        return "Name (A-Z)";
      default:
        return "Sort by";
    }
  };

  // 切换排序选项
  const toggleSortOption = () => {
    if (sortOption === "rating") {
      onSortChange("users");
    } else if (sortOption === "users") {
      onSortChange("newest");
    } else if (sortOption === "newest") {
      onSortChange("name");
    } else {
      onSortChange("rating");
    }
  };

  return (
    <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      {/* Search Input */}
      <div className="relative flex w-full max-w-md items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            onClick={toggleSortOption}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort by: {getSortLabel()}
          </button>
        </div>
        
        {/* View Mode Toggle (Optional) */}
        {viewMode && onViewModeChange && (
          <div className="border-l border-border pl-2 flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Mobile Filter Toggle (Optional) */}
        {onFilterToggle && (
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={onFilterToggle}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        )}
        
        {/* Clear Filters */}
        {showClearFilters && onClearFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
} 