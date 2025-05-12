"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { HeroSection } from "@/components/hero/hero-section";
import { ToolCard } from "@/components/cards/tool-card";
import { Sidebar } from "@/components/layout/sidebar";
import { Sparkles, Filter, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllTools, useCategories, useFilteredTools, useTrendingTools } from "@/lib/hooks/use-tools";
import { Skeleton } from "@/components/ui/skeleton";
import { type ToolCategory } from "@/lib/data/tools";

// 仍然使用之前的辅助函数
function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    "Generative AI": "from-purple-500 to-indigo-500",
    "Text Processing": "from-blue-500 to-cyan-500",
    "Image Generation": "from-green-500 to-teal-500",
    "Code Assistant": "from-yellow-500 to-amber-500",
    "Audio Processing": "from-red-500 to-rose-500",
    "Video Creation": "from-orange-500 to-amber-500",
    "Data Analysis": "from-sky-500 to-blue-500",
    "Chat Bot": "from-pink-500 to-purple-500"
  };
  
  return colors[category] || "from-gray-500 to-gray-700";
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 8;

  // 使用hooks来获取数据
  const { categories = [] } = useCategories();
  const { trendingTools = [] } = useTrendingTools();
  
  // 使用过滤hooks来获取工具
  const { tools: filteredTools, isLoading } = useFilteredTools({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
  });
  
  // 计算分页
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const currentTools = filteredTools.slice(
    (currentPage - 1) * toolsPerPage,
    currentPage * toolsPerPage
  );
  
  // 重置到第一页当过滤器改变时
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
        
        {isLoading ? (
          // 加载状态
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[180px] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
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
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold">Trending Now</h2>
              <Sparkles className="ml-2 h-5 w-5 text-yellow-500" />
            </div>
            <Link href="/trending">
              <Button variant="outline" className="flex items-center gap-2">
                View All Trending
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              {trendingTools.length === 0 && isLoading ? (
                // 加载状态
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-[180px] w-full rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {trendingTools.slice(0, 4).map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue opacity-0 blur transition duration-300 group-hover:opacity-70" />
                      <div className="relative">
                        <ToolCard tool={tool} index={index} />
                      </div>
                      
                      {/* Trending Badge */}
                      <div className="absolute -right-2 -top-2 rounded-full bg-cyber-orange px-3 py-1 text-xs font-bold text-black shadow-lg">
                        #{index + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <Sidebar />
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold">Categories</h2>
              <Layers className="ml-2 h-5 w-5 text-cyber-blue" />
            </div>
            <Link href="/categories">
              <Button variant="outline" className="flex items-center gap-2">
                Explore All Categories
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {categories.length === 0 && isLoading ? (
            // 加载状态
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.slice(0, 4).map((category) => {
                const toolsInCategory = filteredTools.filter(tool => tool.category === category);
                const categoryColor = getCategoryColor(category);
                
                return (
                  <Link href={`/categories?category=${category}`} key={category}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="cursor-pointer"
                    >
                      <div className="group relative h-40 rounded-xl overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-r ${categoryColor} opacity-90`}></div>
                        <div className="relative flex flex-col justify-between h-full p-6 text-white">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{category}</h3>
                            <p className="text-white/70 text-sm">
                              {toolsInCategory.length} tools available
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-white border-white/50 bg-transparent hover:bg-white/20"
                            >
                              Explore
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
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
