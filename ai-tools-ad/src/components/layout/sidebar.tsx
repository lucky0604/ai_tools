"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { aiTools } from "@/lib/data/tools";
import { formatNumber } from "@/lib/utils";

export function Sidebar() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const trendingTools = aiTools.filter(tool => tool.isTrending).slice(0, 5);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would send the email to a backend service
    setIsSubscribed(true);
  };
  
  return (
    <aside className="space-y-8">
      {/* Trending Tools Section */}
      <section className="rounded-xl border bg-card p-5 shadow-sm dark:border-gray-800">
        <div className="mb-4 flex items-center">
          <h3 className="text-lg font-bold">Trending Tools</h3>
          <Sparkles className="ml-2 h-4 w-4 text-yellow-500" />
        </div>
        
        <div className="space-y-4">
          {trendingTools.map((tool, index) => (
            <motion.div 
              key={tool.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{tool.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(tool.usageStats.users)} users
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="rounded-xl border bg-card p-5 shadow-sm dark:border-gray-800">
        <div className="mb-4 flex items-center">
          <h3 className="text-lg font-bold">Stay Updated</h3>
          <Mail className="ml-2 h-4 w-4 text-primary" />
        </div>
        
        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Get weekly updates on the best new AI tools directly to your inbox!
            </p>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="youremail@example.com"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button variant="gradient" type="submit" className="w-full">
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="rounded-lg bg-secondary/20 p-4 text-center text-sm">
            <p className="font-medium text-secondary-foreground">
              Thank you for subscribing!
            </p>
            <p className="mt-1 text-muted-foreground">
              Check your inbox for confirmation.
            </p>
          </div>
        )}
      </section>
      
      {/* Ad Space */}
      <section className="overflow-hidden rounded-xl">
        <div className="flex h-64 items-center justify-center bg-cyber-gradient p-6 text-center text-white">
          <div>
            <h3 className="text-xl font-bold">Your Ad Here</h3>
            <p className="mt-2 text-sm text-white/80">
              Reach thousands of AI enthusiasts and developers
            </p>
            <Button variant="neon" className="mt-4">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </aside>
  );
} 