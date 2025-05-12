"use client";

import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categories, pricingOptions, type ToolCategory, type ToolPricing } from "@/lib/data/tools";

interface ToolFilterSidebarProps {
  selectedCategories: ToolCategory[];
  selectedPricing: ToolPricing[];
  toggleCategory: (category: ToolCategory) => void;
  togglePricing: (pricing: ToolPricing) => void;
  clearFilters: () => void;
  isMobile?: boolean;
}

export function ToolFilterSidebar({
  selectedCategories,
  selectedPricing,
  toggleCategory,
  togglePricing,
  clearFilters,
  isMobile = false
}: ToolFilterSidebarProps) {
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(true);
  const [isPricingOpen, setIsPricingOpen] = React.useState(true);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {(selectedCategories.length > 0 || selectedPricing.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {/* Categories */}
      <div className="border-t pt-4">
        <button
          className="flex w-full items-center justify-between text-sm font-medium"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          Categories
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", {
              "rotate-180": isCategoryOpen,
            })}
          />
        </button>
        
        {isCategoryOpen && (
          <div className="mt-2 space-y-1">
            {categories.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                    selectedCategories.includes(category)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input"
                  )}
                  onClick={() => toggleCategory(category)}
                >
                  {selectedCategories.includes(category) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <span className="flex-1">{category}</span>
                <span className="text-xs text-muted-foreground">
                  {/* Count of tools in this category could be added here */}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Pricing */}
      <div className="border-t pt-4">
        <button
          className="flex w-full items-center justify-between text-sm font-medium"
          onClick={() => setIsPricingOpen(!isPricingOpen)}
        >
          Pricing
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", {
              "rotate-180": isPricingOpen,
            })}
          />
        </button>
        
        {isPricingOpen && (
          <div className="mt-2 space-y-1">
            {pricingOptions.map((pricing) => (
              <label
                key={pricing}
                className="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                    selectedPricing.includes(pricing)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input"
                  )}
                  onClick={() => togglePricing(pricing)}
                >
                  {selectedPricing.includes(pricing) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <span className="flex-1">{pricing}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Apply Button - For Mobile Only */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-4"
        >
          <Button className="w-full" size="sm">
            Apply Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
} 