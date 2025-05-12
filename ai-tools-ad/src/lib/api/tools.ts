import type { AiTool, ToolCategory, ToolPricing } from '../data/tools';
import { aiTools, categories, pricingOptions } from '../data/tools';

/**
 * API配置
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
const API_KEY = process.env.API_KEY;

/**
 * 开发和回退配置
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * 请求配置
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
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
  // 如果使用模拟数据模式，则直接返回本地数据
  if (USE_MOCK_DATA) {
    console.log(`[Mock Data] Fetching: ${endpoint}`);
    return getMockData<T>(endpoint);
  }
  
  try {
    console.log(`[API] Fetching: ${API_URL}${endpoint}`);
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: defaultHeaders,
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(`API error: ${response.statusText}`, response.status);
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 回退到本地数据（用于开发或API不可用时）
    console.error('API request failed, using fallback data:', error);
    return getMockData<T>(endpoint);
  }
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
      return categories as unknown as T;
      
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
  return fetchAPI<AiTool[]>('/tools');
}

// 按ID获取工具
export async function getToolById(id: string): Promise<AiTool> {
  return fetchAPI<AiTool>(`/tools/${id}`);
}

// 按类别获取工具
export async function getToolsByCategory(category: ToolCategory): Promise<AiTool[]> {
  return fetchAPI<AiTool[]>(`/tools?category=${encodeURIComponent(category)}`);
}

// 获取热门工具
export async function getTrendingTools(): Promise<AiTool[]> {
  return fetchAPI<AiTool[]>('/tools?trending=true');
}

// 获取新工具
export async function getNewTools(): Promise<AiTool[]> {
  return fetchAPI<AiTool[]>('/tools?isNew=true');
}

// 获取所有类别
export async function getAllCategories(): Promise<ToolCategory[]> {
  return fetchAPI<ToolCategory[]>('/categories');
}

// 获取所有定价选项
export async function getAllPricingOptions(): Promise<ToolPricing[]> {
  return fetchAPI<ToolPricing[]>('/pricing-options');
}

// 搜索工具
export async function searchTools(query: string): Promise<AiTool[]> {
  return fetchAPI<AiTool[]>(`/tools/search?q=${encodeURIComponent(query)}`);
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
  const queryParams = new URLSearchParams();
  
  if (options.category) queryParams.append('category', options.category);
  if (options.pricing) queryParams.append('pricing', options.pricing);
  if (options.search) queryParams.append('search', options.search);
  if (options.trending) queryParams.append('trending', 'true');
  if (options.isNew) queryParams.append('isNew', 'true');
  if (options.sort) queryParams.append('sort', options.sort);
  
  const queryString = queryParams.toString();
  return fetchAPI<AiTool[]>(`/tools/filter?${queryString}`);
} 