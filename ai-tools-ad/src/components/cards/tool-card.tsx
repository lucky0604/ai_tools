"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { AiTool } from "@/lib/data/tools";
import { formatNumber, generateStars } from "@/lib/utils";

interface ToolCardProps {
  tool: AiTool;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card-hover group relative flex flex-col rounded-xl border bg-card p-6 shadow-sm dark:border-gray-800"
    >
      {tool.isNew && (
        <div className="absolute -right-2 -top-2 z-20 rounded-full bg-cyber-green px-3 py-1 text-xs font-medium text-black shadow-lg">
          NEW
        </div>
      )}
      {tool.isTrending && (
        <div className="absolute -right-2 -top-2 z-20 rounded-full bg-cyber-orange px-3 py-1 text-xs font-medium text-black shadow-lg">
          🔥 TRENDING
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
          <Image
            src={tool.logo}
            alt={`${tool.name} logo`}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-medium text-yellow-500">
            {generateStars(tool.rating)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {tool.rating.toFixed(1)}
          </div>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold">{tool.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {tool.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Quick View - Only visible on hover */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between rounded-xl bg-gradient-to-b from-primary/90 to-primary/95 p-6 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        <div>
          <h3 className="text-xl font-bold">{tool.name}</h3>
          <p className="mt-2 text-sm">{tool.description}</p>
          
          <div className="mt-4">
            <h4 className="font-medium">Key Features</h4>
            <ul className="mt-1 list-inside list-disc text-sm">
              {tool.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4" data-no-click="true">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-white/70">Users</p>
              <p className="font-medium">{formatNumber(tool.usageStats.users)}</p>
            </div>
            <div>
              <p className="text-white/70">API Calls</p>
              <p className="font-medium">{formatNumber(tool.usageStats.apiCalls)}</p>
            </div>
          </div>
          
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-30 mt-4 block rounded-lg bg-white px-4 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-white/90 active:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={(e) => e.stopPropagation()}
            data-no-click="true"
          >
            Try {tool.name}
          </a>
        </div>
      </div>
    </motion.div>
  );
} 