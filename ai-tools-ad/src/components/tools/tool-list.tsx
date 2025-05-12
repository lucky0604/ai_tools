"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

import { AiTool } from "@/lib/data/tools";
import { ToolCard } from "@/components/cards/tool-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ToolListProps {
  tools: AiTool[];
  isLoading: boolean;
  viewMode?: "grid" | "list";
  onToolClick?: (toolId: string) => void;
  badgeRender?: (tool: AiTool, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  columnCount?: 2 | 3 | 4;
}

export function ToolList({
  tools,
  isLoading,
  viewMode = "grid",
  onToolClick,
  badgeRender,
  emptyState,
  columnCount = 3
}: ToolListProps) {
  const getGridClassName = () => {
    switch (columnCount) {
      case 2:
        return "grid-cols-1 gap-6 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  if (isLoading) {
    return viewMode === "grid" ? (
      <div className={`grid ${getGridClassName()}`}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[180px] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 rounded-lg border border-border p-4">
            <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full max-w-[500px]" />
              <div className="flex space-x-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return emptyState || (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
        <h3 className="text-xl font-semibold">No tools found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return viewMode === "grid" ? (
    <div className={`grid ${getGridClassName()}`}>
      {tools.map((tool, index) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group relative"
          onClick={(e) => {
            if (
              e.target instanceof HTMLElement && 
              (e.target.tagName === 'A' || 
               e.target.closest('a') || 
               e.target.getAttribute('data-no-click') === 'true')
            ) {
              e.stopPropagation();
              return;
            }
            onToolClick && onToolClick(tool.id);
          }}
        >
          {badgeRender && badgeRender(tool, index)}
          <div className="relative">
            <ToolCard tool={tool} index={index} />
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      {tools.map((tool, index) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="cursor-pointer"
          onClick={(e) => {
            if (
              e.target instanceof HTMLElement && 
              (e.target.tagName === 'A' || 
               e.target.closest('a') || 
               e.target.getAttribute('data-no-click') === 'true')
            ) {
              e.stopPropagation();
              return;
            }
            onToolClick && onToolClick(tool.id);
          }}
        >
          <div className="flex items-center space-x-4 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border">
              <Image
                src={tool.logo}
                alt={`${tool.name} logo`}
                className="h-full w-full object-cover"
                width={56}
                height={56}
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
  );
} 