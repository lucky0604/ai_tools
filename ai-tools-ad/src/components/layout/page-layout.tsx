"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PageLayoutProps {
  title: string;
  description: string;
  titleColor?: string;
  icon?: LucideIcon;
  backgroundClass?: string;
  children: ReactNode;
}

export function PageLayout({
  title,
  description,
  titleColor = "text-cyber-green",
  icon: Icon,
  backgroundClass = "bg-gray-900",
  children
}: PageLayoutProps) {
  const titleParts = title.split(" ");
  const lastWord = titleParts.pop() || "";
  const firstPart = titleParts.join(" ");

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header Bar */}
      <div className={`${backgroundClass} py-16`}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className="h-8 w-8 text-white" />}
              <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
                {firstPart} <span className={titleColor}>{lastWord}</span>
              </h1>
            </div>
            <p className="max-w-2xl text-lg text-gray-100">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container py-12">
        {children}
      </div>
    </div>
  );
} 