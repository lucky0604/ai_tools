# AI Tools Advertisement Platform

A modern Next.js website to showcase and explore AI tools.

## Features

- 🚀 Built with Next.js 14, React, TypeScript, and Tailwind CSS
- 🎨 Modern UI with cyber-gradient theme
- 📱 Fully responsive design
- 🔍 Search and filter AI tools
- 🔄 Dynamic data fetching from API
- 🔐 API integration with fallback to local data
- 📊 Categories and trending tools
- 📱 Mobile-friendly UI

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# RapidAPI配置
NEXT_PUBLIC_API_URL=https://ai-tools-apps-database-resource.p.rapidapi.com
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
NEXT_PUBLIC_RAPIDAPI_HOST=ai-tools-apps-database-resource.p.rapidapi.com

# 开发模式配置
NEXT_PUBLIC_USE_MOCK_DATA=true
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Integration

### Overview

The application supports two data sources:

1. **RapidAPI AI Tools Directory** - Real data from the RapidAPI marketplace
2. **Local Data** - Fallback data stored locally in the codebase

Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in your `.env.local` file to use local data during development.

### RapidAPI Integration

To use the RapidAPI data source:

1. Sign up for a RapidAPI account at [rapidapi.com](https://rapidapi.com/)
2. Subscribe to the "AI Tools Directory" API (or similar AI tools API)
3. Copy your RapidAPI key from your dashboard
4. Add the key to your `.env.local` file as `NEXT_PUBLIC_RAPIDAPI_KEY`
5. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` to use the API

The application will automatically transform the API responses to match our data models.

### API Data Flow

The data flow follows this pattern:

1. React components use hooks from `src/lib/hooks/use-tools.ts`
2. Hooks use SWR for data fetching, caching and revalidation
3. SWR calls API functions from `src/lib/api/tools.ts`
4. API functions make requests to the RapidAPI endpoints 
5. The responses are transformed to match our application's data model
6. If API calls fail, the system falls back to local data

### Expected API Endpoints

The application is configured to work with the following endpoints from RapidAPI:

- `GET /tools` - Get all tools
- `GET /tools/{id}` - Get a specific tool by ID
- `GET /tools?category={category}` - Get tools by category
- `GET /tools?trending=true` - Get trending tools
- `GET /tools?isNew=true` - Get new tools
- `GET /categories` - Get all categories
- `GET /pricing-options` - Get all pricing options
- `GET /tools/search?q={query}` - Search tools
- `GET /tools/filter?{params}` - Filter tools with multiple parameters

If your chosen RapidAPI service uses different endpoints, you may need to adjust the API mapping in `src/lib/api/tools.ts`.

### Data Models

The main data models are:

- `AiTool` - Information about an AI tool
- `ToolCategory` - Categories for AI tools
- `ToolPricing` - Pricing options for AI tools

## Folder Structure

- `/src/app` - Next.js app router pages
- `/src/components` - React components
  - `/ui` - UI components
  - `/layout` - Layout components
  - `/cards` - Card components for displaying tools
  - `/tools` - Tool-specific components
  - `/hero` - Hero section components
- `/src/lib` - Utility functions, hooks, and data
  - `/api` - API service functions
  - `/data` - Local data models and mock data
  - `/hooks` - React hooks for data fetching
  - `/utils` - Utility functions

## Deployment

The application can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or AWS.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
