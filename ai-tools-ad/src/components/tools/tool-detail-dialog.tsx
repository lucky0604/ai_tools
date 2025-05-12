"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Users, Zap, ExternalLink, CheckCircle } from "lucide-react";

import { AiTool } from "@/lib/data/tools";
import { Button } from "@/components/ui/button";
import { formatNumber, generateStars, getRelativeTimeString } from "@/lib/utils";

interface ToolDetailDialogProps {
  tool: AiTool;
  isOpen: boolean;
  onClose: () => void;
}

export function ToolDetailDialog({ tool, isOpen, onClose }: ToolDetailDialogProps) {
  if (!isOpen) return null;

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-background shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-muted/50 p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Left Column - Hero Section */}
              <div className="relative flex w-full flex-col items-center justify-center space-y-6 bg-gradient-to-br from-primary/90 to-primary/70 p-8 text-white lg:w-2/5">
                <div className="relative h-32 w-32 overflow-hidden rounded-xl border-4 border-white/20 shadow-lg">
                  <Image
                    src={tool.logo}
                    alt={`${tool.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-center">
                  <h2 className="mb-2 text-3xl font-bold">{tool.name}</h2>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tool.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex w-full flex-col space-y-4">
                  <div className="flex justify-between rounded-lg bg-white/10 p-3">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      <span className="text-sm">Users</span>
                    </div>
                    <span className="font-medium">{formatNumber(tool.usageStats.users)}</span>
                  </div>

                  <div className="flex justify-between rounded-lg bg-white/10 p-3">
                    <div className="flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      <span className="text-sm">API Calls</span>
                    </div>
                    <span className="font-medium">{formatNumber(tool.usageStats.apiCalls)}</span>
                  </div>
                </div>

                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full border-white bg-transparent text-white hover:bg-white hover:text-primary"
                  >
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>

                <div className="flex w-full items-center space-x-3">
                  <div className="h-px flex-1 bg-white/20"></div>
                  <span className="text-xs font-medium uppercase text-white/60">Updated {getRelativeTimeString(tool.lastUpdated)}</span>
                  <div className="h-px flex-1 bg-white/20"></div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="w-full p-8 lg:w-3/5">
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center">
                      <h3 className="text-xl font-semibold">About</h3>
                      {tool.isNew && (
                        <span className="ml-2 rounded-full bg-cyber-green px-2 py-0.5 text-xs font-medium text-black">
                          NEW
                        </span>
                      )}
                      {tool.isTrending && (
                        <span className="ml-2 rounded-full bg-cyber-orange px-2 py-0.5 text-xs font-medium text-black">
                          🔥 TRENDING
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Key Features</h3>
                    <ul className="space-y-2">
                      {tool.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-cyber-green" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{tool.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pricing</p>
                        <p className="font-medium">{tool.pricing}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block lg:hidden"
                    >
                      <Button variant="default" className="w-full">
                        Try {tool.name}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 