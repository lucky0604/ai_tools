"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data/tools";
import { ParticleBackground } from "./particle-background";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
}

export function HeroSection({ onSearch, onCategorySelect }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-gray-900 px-4 py-20 text-white">
      {/* Animated Particle Background */}
      <ParticleBackground />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            <span className="gradient-text">Discover AI Power</span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Explore the ultimate collection of cutting-edge AI tools to supercharge your productivity and creativity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl"
        >
          <form onSubmit={handleSearch} className="flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <div className="glassmorphism flex w-full items-center rounded-lg px-4 py-3">
                <Search className="mr-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="relative">
              <button
                type="button"
                className="glassmorphism flex w-full items-center justify-between rounded-lg px-4 py-3 sm:w-auto"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>Categories</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="glassmorphism absolute top-14 z-20 w-full rounded-lg py-2 shadow-xl">
                  <div className="max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/10"
                        onClick={() => {
                          onCategorySelect(category);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button type="submit" variant="gradient" size="lg" className="group">
              <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              Find Tools
            </Button>
          </form>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button variant="neon" size="lg" className="shadow-glow">
            Submit Your Tool
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 