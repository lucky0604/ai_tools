"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/hooks/use-theme";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "glassmorphism py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              <span className="text-cyber-green">AI</span>Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 md:flex">
            <Link href="/tools" className="px-4 py-2 text-sm text-white/90 transition-colors hover:text-white">
              Tools
            </Link>
            <Link href="/trending" className="px-4 py-2 text-sm text-white/90 transition-colors hover:text-white">
              Trending
            </Link>
            <Link href="/categories" className="px-4 py-2 text-sm text-white/90 transition-colors hover:text-white">
              Categories
            </Link>
            <Link href="#submit" className="px-4 py-2 text-sm text-white/90 transition-colors hover:text-white">
              Submit
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2 text-white"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="gradient" className="ml-4">
              Sign In
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-white"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex items-start justify-center bg-gray-900/95 pt-24"
          >
            <div className="container flex flex-col items-center space-y-6 px-4">
              <Link 
                href="/tools" 
                className="w-full rounded-lg py-3 text-center text-lg font-medium text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tools
              </Link>
              <Link 
                href="/trending" 
                className="w-full rounded-lg py-3 text-center text-lg font-medium text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <Link 
                href="/categories" 
                className="w-full rounded-lg py-3 text-center text-lg font-medium text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="#submit" 
                className="w-full rounded-lg py-3 text-center text-lg font-medium text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Submit
              </Link>
              <Button variant="gradient" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 