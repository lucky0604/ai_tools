import type { AiTool, ToolCategory, ToolPricing } from '../data/tools';

/**
 * API配置
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
const API_KEY = process.env.API_KEY;

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
  try {
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
    if (endpoint.includes('/tools')) {
      return (await import('../data/tools')).aiTools as unknown as T;
    }
    
    throw new Error(`Failed to fetch from API: ${(error as Error).message}`);
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