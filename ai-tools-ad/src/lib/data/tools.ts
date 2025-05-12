export interface AiTool {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: ToolCategory;
  tags: string[];
  rating: number;
  usageStats: {
    users: number;
    apiCalls: number;
  };
  pricing: ToolPricing;
  features: string[];
  url: string;
  isNew?: boolean;
  isTrending?: boolean;
  lastUpdated: Date;
}

export type ToolCategory = 
  | "Generative AI"
  | "Text Processing"
  | "Image Generation"
  | "Code Assistant"
  | "Audio Processing"
  | "Video Creation"
  | "Data Analysis"
  | "Chat Bot";

export type ToolPricing = 
  | "Free"
  | "Freemium"
  | "Paid"
  | "Enterprise"
  | "Contact Sales";

export const aiTools: AiTool[] = [
  {
    id: "tool-01",
    name: "CodeSage",
    description: "AI-powered code assistant with real-time suggestions and error detection.",
    logo: "/tool-logos/codesage.svg",
    category: "Code Assistant",
    tags: ["Programming", "IDE", "Productivity"],
    rating: 4.8,
    usageStats: {
      users: 250000,
      apiCalls: 9800000,
    },
    pricing: "Freemium",
    features: [
      "Real-time code suggestions",
      "Error detection and fixes",
      "Multi-language support",
    ],
    url: "https://example.com/codesage",
    isTrending: true,
    lastUpdated: new Date("2023-12-10"),
  },
  {
    id: "tool-02",
    name: "ImageMaster AI",
    description: "Generate stunning images from text descriptions with advanced AI models.",
    logo: "/tool-logos/imagemaster.svg",
    category: "Image Generation",
    tags: ["Design", "Creative", "Visual"],
    rating: 4.6,
    usageStats: {
      users: 780000,
      apiCalls: 12500000,
    },
    pricing: "Paid",
    features: [
      "Text-to-image generation",
      "Style transfer",
      "Image editing",
    ],
    url: "https://example.com/imagemaster",
    lastUpdated: new Date("2023-11-15"),
  },
  {
    id: "tool-03",
    name: "SmartChat",
    description: "Customizable AI chatbot platform with natural language processing capabilities.",
    logo: "/tool-logos/smartchat.svg",
    category: "Chat Bot",
    tags: ["Customer Service", "Automation", "NLP"],
    rating: 4.3,
    usageStats: {
      users: 450000,
      apiCalls: 28700000,
    },
    pricing: "Freemium",
    features: [
      "Natural language processing",
      "Custom knowledge base integration",
      "Multi-platform deployment",
    ],
    url: "https://example.com/smartchat",
    lastUpdated: new Date("2023-10-28"),
  },
  {
    id: "tool-04",
    name: "DataLens",
    description: "AI-powered data analysis platform that transforms raw data into actionable insights.",
    logo: "/tool-logos/datalens.svg",
    category: "Data Analysis",
    tags: ["Analytics", "Business Intelligence", "Visualization"],
    rating: 4.7,
    usageStats: {
      users: 120000,
      apiCalls: 5400000,
    },
    pricing: "Enterprise",
    features: [
      "Automated data analysis",
      "Interactive visualizations",
      "Predictive analytics",
    ],
    url: "https://example.com/datalens",
    lastUpdated: new Date("2023-12-05"),
  },
  {
    id: "tool-05",
    name: "AudioForge",
    description: "Transform text into natural-sounding speech with customizable voices and styles.",
    logo: "/tool-logos/audioforge.svg",
    category: "Audio Processing",
    tags: ["Text-to-Speech", "Podcasting", "Accessibility"],
    rating: 4.5,
    usageStats: {
      users: 320000,
      apiCalls: 7600000,
    },
    pricing: "Paid",
    features: [
      "Text-to-speech conversion",
      "Voice customization",
      "Multiple language support",
    ],
    url: "https://example.com/audioforge",
    lastUpdated: new Date("2023-11-20"),
  },
  {
    id: "tool-06",
    name: "VideoGen",
    description: "Create professional videos with AI-generated scenes, transitions, and effects.",
    logo: "/tool-logos/videogen.svg",
    category: "Video Creation",
    tags: ["Marketing", "Content Creation", "Social Media"],
    rating: 4.2,
    usageStats: {
      users: 180000,
      apiCalls: 3200000,
    },
    pricing: "Paid",
    features: [
      "AI-powered video creation",
      "Customizable templates",
      "Automatic transitions",
    ],
    url: "https://example.com/videogen",
    lastUpdated: new Date("2023-12-01"),
  },
  {
    id: "tool-07",
    name: "TextSculptor",
    description: "Advanced AI text editor that enhances writing with suggestions and style improvements.",
    logo: "/tool-logos/textsculptor.svg",
    category: "Text Processing",
    tags: ["Writing", "Editing", "Content Creation"],
    rating: 4.4,
    usageStats: {
      users: 520000,
      apiCalls: 15800000,
    },
    pricing: "Freemium",
    features: [
      "Grammar and style checking",
      "Content suggestions",
      "Tone adjustment",
    ],
    url: "https://example.com/textsculptor",
    lastUpdated: new Date("2023-11-10"),
  },
  {
    id: "tool-08",
    name: "QuantumAI",
    description: "Next-generation AI framework for complex problem-solving and pattern recognition.",
    logo: "/tool-logos/quantumai.svg",
    category: "Generative AI",
    tags: ["Research", "Problem Solving", "Innovation"],
    rating: 4.9,
    usageStats: {
      users: 90000,
      apiCalls: 2100000,
    },
    pricing: "Enterprise",
    features: [
      "Advanced pattern recognition",
      "Quantum-inspired algorithms",
      "Research-grade AI",
    ],
    url: "https://example.com/quantumai",
    isNew: true,
    lastUpdated: new Date("2023-12-15"),
  }
];

export const pricingOptions: ToolPricing[] = [
  "Free",
  "Freemium",
  "Paid", 
  "Enterprise",
  "Contact Sales"
]; 