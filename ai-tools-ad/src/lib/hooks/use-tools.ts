import useSWR from 'swr';
import type { AiTool, ToolCategory, ToolPricing } from '../data/tools';
import * as toolsApi from '../api/tools';

// SWR fetcher函数
const fetcher = async <T>(key: string): Promise<T> => {
  const [path, params] = key.split('?');
  const queryParams = new URLSearchParams(params);
  
  // 根据路径调用相应的API函数
  switch (path) {
    case '/tools':
      return toolsApi.getAllTools() as Promise<T>;
    case '/tools/trending':
      return toolsApi.getTrendingTools() as Promise<T>;
    case '/tools/new':
      return toolsApi.getNewTools() as Promise<T>;
    case '/categories':
      return toolsApi.getAllCategories() as Promise<T>;
    case '/pricing-options':
      return toolsApi.getAllPricingOptions() as Promise<T>;
    case '/tools/filter': {
      const options: Record<string, any> = {};
      for (const [key, value] of queryParams.entries()) {
        options[key] = value;
      }
      return toolsApi.getFilteredTools(options) as Promise<T>;
    }
    default:
      if (path.startsWith('/tools/')) {
        const id = path.replace('/tools/', '');
        return toolsApi.getToolById(id) as Promise<T>;
      }
      if (path.startsWith('/tools/category/')) {
        const category = path.replace('/tools/category/', '');
        return toolsApi.getToolsByCategory(category as ToolCategory) as Promise<T>;
      }
      throw new Error(`Unknown API path: ${path}`);
  }
};

// 获取所有工具
export function useAllTools() {
  const { data, error, isLoading, mutate } = useSWR<AiTool[]>(
    '/tools',
    fetcher
  );

  return {
    tools: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// 获取单个工具
export function useTool(id: string) {
  const { data, error, isLoading, mutate } = useSWR<AiTool>(
    id ? `/tools/${id}` : null,
    fetcher
  );

  return {
    tool: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// 获取热门工具
export function useTrendingTools() {
  const { data, error, isLoading, mutate } = useSWR<AiTool[]>(
    '/tools/trending',
    fetcher
  );

  return {
    trendingTools: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// 获取最新工具
export function useNewTools() {
  const { data, error, isLoading, mutate } = useSWR<AiTool[]>(
    '/tools/new',
    fetcher
  );

  return {
    newTools: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// 获取所有类别
export function useCategories() {
  const { data, error, isLoading } = useSWR<ToolCategory[]>(
    '/categories',
    fetcher
  );

  return {
    categories: data || [],
    isLoading,
    isError: !!error,
  };
}

// 获取所有定价选项
export function usePricingOptions() {
  const { data, error, isLoading } = useSWR<ToolPricing[]>(
    '/pricing-options',
    fetcher
  );

  return {
    pricingOptions: data || [],
    isLoading,
    isError: !!error,
  };
}

// 获取特定类别的工具
export function useToolsByCategory(category: ToolCategory | null) {
  const { data, error, isLoading, mutate } = useSWR<AiTool[]>(
    category ? `/tools/category/${category}` : null,
    fetcher
  );

  return {
    tools: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// 使用高级筛选获取工具
interface FilterOptions {
  category?: ToolCategory;
  pricing?: ToolPricing;
  search?: string;
  trending?: boolean;
  isNew?: boolean;
  sort?: 'rating' | 'users' | 'newest' | 'name';
}

export function useFilteredTools(options: FilterOptions = {}) {
  // 构建查询参数
  const queryParams = new URLSearchParams();
  
  if (options.category) queryParams.append('category', options.category);
  if (options.pricing) queryParams.append('pricing', options.pricing);
  if (options.search) queryParams.append('search', options.search);
  if (options.trending !== undefined) queryParams.append('trending', options.trending.toString());
  if (options.isNew !== undefined) queryParams.append('isNew', options.isNew.toString());
  if (options.sort) queryParams.append('sort', options.sort);
  
  const queryString = queryParams.toString();
  const key = queryString ? `/tools/filter?${queryString}` : '/tools';
  
  const { data, error, isLoading, mutate } = useSWR<AiTool[]>(key, fetcher);

  return {
    tools: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
} 