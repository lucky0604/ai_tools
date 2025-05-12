"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { HeroSection } from "@/components/hero/hero-section";
import { ToolCard } from "@/components/cards/tool-card";
import { Sidebar } from "@/components/layout/sidebar";
import { aiTools, type ToolCategory } from "@/lib/data/tools";
import { Sparkles, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 8;

  // Filter tools based on search query and category
  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory 
      ? tool.category === selectedCategory 
      : true;
      
    return matchesSearch && matchesCategory;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const currentTools = filteredTools.slice(
    (currentPage - 1) * toolsPerPage,
    currentPage * toolsPerPage
  );
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);
  
  return (
    <main className="flex min-h-screen flex-col">      
      {/* Hero Section */}
      <HeroSection 
        onSearch={setSearchQuery} 
        onCategorySelect={(category) => setSelectedCategory(category as ToolCategory)} 
      />
      
      {/* Tools Section */}
      <section className="container py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            {selectedCategory 
              ? `${selectedCategory} Tools`
              : searchQuery 
                ? `Search Results for "${searchQuery}"`
                : "Discover AI Tools"
            }
          </h2>
          
          {(selectedCategory || searchQuery) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
        
        {filteredTools.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
            <h3 className="text-xl font-semibold">No tools found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentTools.map((tool, index) => (
                <AnimatePresence key={tool.id}>
                  <ToolCard tool={tool} index={index} />
                </AnimatePresence>
              ))}
            </div>
            
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
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                
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
          </>
        )}
      </section>
      
      {/* Trending Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container">
          <div className="mb-8 flex items-center">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Sparkles className="ml-2 h-5 w-5 text-yellow-500" />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {aiTools
                  .filter(tool => tool.isTrending)
                  .slice(0, 4)
                  .map((tool, index) => (
                    <ToolCard key={tool.id} tool={tool} index={index} />
                  ))}
              </div>
            </div>
            
            <div>
              <Sidebar />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative overflow-hidden bg-cyber-gradient py-16 text-white">
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Ready to showcase your AI tool?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Join our growing directory and reach thousands of potential users
              looking for solutions like yours.
            </p>
            <Button variant="neon" size="lg" className="mt-8">
              Submit Your Tool
            </Button>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-cyber-green/30 blur-3xl" />
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-cyber-purple/30 blur-3xl" />
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold">
                <span className="text-cyber-green">AI</span>Tools
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Discover the best AI tools for your needs
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white">About</a>
              <a href="#" className="text-gray-400 hover:text-white">Submit Tool</a>
              <a href="#" className="text-gray-400 hover:text-white">Advertise</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AITools Directory. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
