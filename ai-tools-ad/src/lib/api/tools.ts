import type { AiTool, ToolCategory, ToolPricing } from '../data/tools';
import { aiTools, pricingOptions } from '../data/tools';

// Create a local categories array for fallback
const fallbackCategories: ToolCategory[] = [
  "Generative AI",
  "Text Processing",
  "Image Generation",
  "Code Assistant",
  "Audio Processing", 
  "Video Creation",
  "Data Analysis",
  "Chat Bot"
];

/**
 * API配置
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.github.com';
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';

/**
 * 开发和回退配置
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * 请求配置
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/vnd.github.v3+json',
  ...(GITHUB_TOKEN ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {})
};

/**
 * 错误处理
 */
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/**
 * 基础请求方法
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 调试环境变量
  console.log('Environment variables check:');
  console.log('API_URL:', API_URL);
  console.log('GITHUB_TOKEN set:', !!GITHUB_TOKEN);
  console.log('USE_MOCK_DATA:', USE_MOCK_DATA);
  
  // 如果使用模拟数据模式，则直接返回本地数据
  if (USE_MOCK_DATA) {
    console.log(`[Mock Data] Fetching: ${endpoint}`);
    return getMockData<T>(endpoint);
  }
  
  try {
    console.log(`[API] Fetching: ${API_URL}${endpoint}`);
    console.log('Request headers:', defaultHeaders);
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: defaultHeaders,
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(`API error: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return transformApiResponse(data, endpoint) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 详细记录错误
    console.error('API request failed:', error);
    console.error('Endpoint:', `${API_URL}${endpoint}`);
    
    // 回退到本地数据（用于开发或API不可用时）
    console.warn('Using fallback mock data instead');
    return getMockData<T>(endpoint);
  }
}

/**
 * 转换API响应，将GitHub格式转换为我们的应用格式
 */
function transformApiResponse(data: any, endpoint: string): any {
  // 分析端点和处理数据
  if (endpoint.startsWith('/search/repositories')) {
    // 获取仓库列表
    if (data && data.items && Array.isArray(data.items)) {
      return data.items.map(transformTool);
    }
  }
  
  // 如果是获取单个仓库
  if (endpoint.startsWith('/repos/')) {
    return transformTool(data);
  }
  
  // 获取类别 - 这里我们使用GitHub的主题作为类别
  if (endpoint.startsWith('/topics')) {
    if (data && data.items && Array.isArray(data.items)) {
      return data.items.map((item: any) => item.name).filter((name: string) => 
        name.includes('ai') || name.includes('ml') || name.includes('machine-learning')
      );
    }
    return fallbackCategories; // 返回本地类别作为后备
  }
  
  // 如果其他响应格式，返回原始数据
  console.warn('Unknown API response format for endpoint:', endpoint);
  return data;
}

/**
 * 转换单个工具数据，从GitHub仓库格式到我们的应用格式
 */
function transformTool(repo: any): AiTool {
  // GitHub API 仓库结构:
  // {
  //   id: 12345,
  //   name: "repo-name",
  //   full_name: "owner/repo-name",
  //   description: "Repository description",
  //   html_url: "https://github.com/owner/repo-name",
  //   owner: { avatar_url: "https://..." },
  //   stargazers_count: 1000,
  //   topics: ["ai", "machine-learning"],
  //   created_at: "2023-01-01T00:00:00Z",
  //   updated_at: "2023-06-01T00:00:00Z",
  //   language: "Python"
  // }

  // 基于主题或描述推断类别
  const inferCategory = (repo: any): ToolCategory => {
    const topics = repo.topics || [];
    const description = (repo.description || '').toLowerCase();
    
    if (topics.includes('image-generation') || description.includes('image generation')) 
      return 'Image Generation';
    if (topics.includes('text-processing') || description.includes('text processing') || description.includes('nlp')) 
      return 'Text Processing';
    if (topics.includes('code-assistant') || description.includes('code') || repo.language === 'JavaScript' || repo.language === 'TypeScript') 
      return 'Code Assistant';
    if (topics.includes('audio-processing') || description.includes('audio') || description.includes('speech')) 
      return 'Audio Processing';
    if (topics.includes('video') || description.includes('video')) 
      return 'Video Creation';
    if (topics.includes('data-analysis') || description.includes('data analysis') || description.includes('analytics')) 
      return 'Data Analysis';
    if (topics.includes('chatbot') || description.includes('chat') || description.includes('bot')) 
      return 'Chat Bot';
    
    return 'Generative AI';
  };

  // 确保logo是有效的图片URL
  const getValidLogoUrl = (repo: any): string => {
    // 首选使用仓库所有者的头像
    if (repo.owner && repo.owner.avatar_url) {
      return repo.owner.avatar_url;
    }
    
    // 后备选项1：使用随机图像
    const fallbackImages = [
      '/tool-logos/default.svg',
      '/tool-logos/ai-1.png',
      '/tool-logos/ai-2.png',
      '/tool-logos/ai-3.png',
    ];
    
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  return {
    id: repo.id?.toString() || `tool-${Math.random().toString(36).substr(2, 9)}`,
    name: repo.name || repo.full_name || "Unknown Tool",
    description: repo.description || "An AI tool on GitHub",
    logo: getValidLogoUrl(repo),
    category: inferCategory(repo),
    tags: repo.topics || [],
    rating: repo.stargazers_count ? Math.min(5, Math.max(3, Math.log10(repo.stargazers_count) * 0.8)) : 4.0,
    usageStats: {
      users: repo.stargazers_count || 0,
      apiCalls: repo.forks_count ? repo.forks_count * 1000 : 0,
    },
    pricing: "Free", // GitHub 仓库通常是免费的
    features: [(repo.language || "Unknown language"), "Open Source", "GitHub Hosted"],
    url: repo.html_url || "#",
    isNew: new Date(repo.created_at).getTime() > (Date.now() - 30 * 24 * 60 * 60 * 1000),
    isTrending: repo.stargazers_count > 1000,
    lastUpdated: new Date(repo.updated_at || repo.created_at || Date.now()),
  };
}

/**
 * 获取模拟数据
 */
function getMockData<T>(endpoint: string): T {
  // 从请求路径中提取查询参数
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');
  
  // 根据路径返回相应的模拟数据
  switch (path) {
    case '/tools':
      // 检查查询参数
      if (params.has('trending') && params.get('trending') === 'true') {
        return aiTools.filter(tool => tool.isTrending) as unknown as T;
      }
      if (params.has('isNew') && params.get('isNew') === 'true') {
        return aiTools.filter(tool => tool.isNew) as unknown as T;
      }
      if (params.has('category')) {
        const category = params.get('category');
        return aiTools.filter(tool => tool.category === category) as unknown as T;
      }
      return aiTools as unknown as T;
      
    case '/categories':
      return fallbackCategories as unknown as T;
      
    case '/pricing-options':
      return pricingOptions as unknown as T;
      
    case '/tools/search':
      const query = params.get('q') || '';
      return aiTools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ) as unknown as T;
      
    case '/tools/filter':
      let filteredTools = [...aiTools];
      
      // 应用类别过滤
      if (params.has('category')) {
        const category = params.get('category');
        filteredTools = filteredTools.filter(tool => tool.category === category);
      }
      
      // 应用定价过滤
      if (params.has('pricing')) {
        const pricing = params.get('pricing');
        filteredTools = filteredTools.filter(tool => tool.pricing === pricing);
      }
      
      // 应用搜索过滤
      if (params.has('search')) {
        const search = params.get('search') || '';
        filteredTools = filteredTools.filter(tool => 
          tool.name.toLowerCase().includes(search.toLowerCase()) ||
          tool.description.toLowerCase().includes(search.toLowerCase()) ||
          tool.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      // 应用trending过滤
      if (params.has('trending')) {
        filteredTools = filteredTools.filter(tool => tool.isTrending);
      }
      
      // 应用isNew过滤
      if (params.has('isNew')) {
        filteredTools = filteredTools.filter(tool => tool.isNew);
      }
      
      // 排序
      if (params.has('sort')) {
        const sort = params.get('sort');
        filteredTools.sort((a, b) => {
          switch (sort) {
            case 'rating':
              return b.rating - a.rating;
            case 'users':
              return b.usageStats.users - a.usageStats.users;
            case 'newest':
              return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });
      }
      
      return filteredTools as unknown as T;
      
    default:
      // 处理单个工具请求，如 /tools/tool-01
      if (path.startsWith('/tools/')) {
        const id = path.replace('/tools/', '');
        const tool = aiTools.find(t => t.id === id);
        return (tool || null) as unknown as T;
      }
      
      throw new Error(`Unknown mock endpoint: ${endpoint}`);
  }
}

/**
 * 工具API方法
 */

// 获取所有工具
export async function getAllTools(): Promise<AiTool[]> {
  return fetchAPI<AiTool[]>('/search/repositories?q=topic:ai+topic:machine-learning&sort=stars&order=desc&per_page=50');
}

// 按ID获取工具
export async function getToolById(id: string): Promise<AiTool> {
  // 由于GitHub API不支持直接按ID查询，我们需要首先获取所有工具，然后通过ID过滤
  const tools = await getAllTools();
  const tool = tools.find(t => t.id === id);
  
  if (!tool) {
    throw new Error(`Tool with ID ${id} not found`);
  }
  
  return tool;
}

// 按类别获取工具
export async function getToolsByCategory(category: ToolCategory): Promise<AiTool[]> {
  // 获取所有工具，然后按类别过滤
  const tools = await getAllTools();
  return tools.filter(tool => tool.category === category);
}

// 获取热门工具
export async function getTrendingTools(): Promise<AiTool[]> {
  return fetchAPI<AiTool[]>('/search/repositories?q=topic:ai+stars:>1000&sort=stars&order=desc&per_page=20');
}

// 获取新工具
export async function getNewTools(): Promise<AiTool[]> {
  // 获取过去30天创建的AI相关仓库
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateStr = thirtyDaysAgo.toISOString().split('T')[0]; // 格式: YYYY-MM-DD
  
  return fetchAPI<AiTool[]>(`/search/repositories?q=topic:ai+created:>${dateStr}&sort=stars&order=desc&per_page=20`);
}

// 获取所有类别
export async function getAllCategories(): Promise<ToolCategory[]> {
  // First try to get all tools
  try {
    // If we're using mock data or in development, get categories from tools
    if (USE_MOCK_DATA) {
      // Extract unique categories from aiTools
      const uniqueCategories = new Set<ToolCategory>();
      aiTools.forEach(tool => {
        uniqueCategories.add(tool.category);
      });
      return Promise.resolve(Array.from(uniqueCategories));
    }
    
    // Try to get categories from GitHub topics
    const tools = await getAllTools();
    if (tools && tools.length > 0) {
      // Extract unique categories from the fetched tools
      const uniqueCategories = new Set<ToolCategory>();
      tools.forEach(tool => {
        uniqueCategories.add(tool.category);
      });
      return Array.from(uniqueCategories);
    }
  } catch (error) {
    console.error('Error generating categories from tools:', error);
  }
  
  // Fallback to predefined categories
  return Promise.resolve(fallbackCategories);
}

// 获取所有定价选项
export async function getAllPricingOptions(): Promise<ToolPricing[]> {
  // 返回预定义的定价选项
  return Promise.resolve(pricingOptions);
}

// 搜索工具
export async function searchTools(query: string): Promise<AiTool[]> {
  return fetchAPI<AiTool[]>(`/search/repositories?q=${encodeURIComponent(query)}+topic:ai&sort=stars&order=desc&per_page=50`);
}

// 使用进阶过滤获取工具
interface FilterOptions {
  category?: ToolCategory;
  pricing?: ToolPricing;
  search?: string;
  trending?: boolean;
  isNew?: boolean;
  sort?: 'rating' | 'users' | 'newest' | 'name';
}

export async function getFilteredTools(options: FilterOptions): Promise<AiTool[]> {
  // 构建GitHub API查询
  let query = 'topic:ai';
  
  if (options.search) {
    query += `+${encodeURIComponent(options.search)}`;
  }
  
  // 添加trending条件
  if (options.trending) {
    query += '+stars:>1000';
  }
  
  // 添加新工具条件
  if (options.isNew) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0];
    query += `+created:>${dateStr}`;
  }
  
  // 确定排序方式
  let sort = 'stars';
  let order = 'desc';
  
  if (options.sort) {
    switch (options.sort) {
      case 'rating':
      case 'users':
        sort = 'stars';
        break;
      case 'newest':
        sort = 'created';
        break;
      case 'name':
        sort = 'name';
        order = 'asc';
        break;
    }
  }
  
  // 获取仓库
  let tools = await fetchAPI<AiTool[]>(`/search/repositories?q=${query}&sort=${sort}&order=${order}&per_page=100`);
  
  // 如果有类别过滤，在客户端应用
  if (options.category) {
    tools = tools.filter(tool => tool.category === options.category);
  }
  
  // 如果有价格过滤，在客户端应用 (注意GitHub项目通常都是免费的)
  if (options.pricing) {
    tools = tools.filter(tool => tool.pricing === options.pricing);
  }
  
  return tools;
} 