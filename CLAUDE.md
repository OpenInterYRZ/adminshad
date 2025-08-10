# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev`
- **Build**: `pnpm build` (TypeScript compilation + Vite build)
- **Linting**: `pnpm lint` (ESLint)
- **Preview**: `pnpm preview` (preview production build)

## Project Architecture

This is a React admin dashboard built with modern tooling:

### Core Stack
- **React 19** with TypeScript and Vite
- **TanStack Router** for file-based routing with auto code-splitting
- **TanStack Query** for server state management (5min staleTime, 10min gcTime)
- **Shadcn/ui** components with Radix UI primitives
- **Tailwind CSS v4** with CSS variables and zinc base color
- **Ky** for HTTP client with centralized error handling

### Key Features
- **Chinese/English bilingual UI** (管理系统/Admin Dashboard)
- **Dark/light theme** support with next-themes
- **Sidebar navigation** with collapsible menu
- **User management** with data tables and export functionality
- **ProTable component** for reusable data tables with search/filter

### Project Structure
- `src/routes/` - File-based routing (TanStack Router auto-generates `routeTree.gen.ts`)
- `src/api/` - API layer with typed request/response interfaces
- `src/components/ui/` - Shadcn/ui components
- `src/lib/http.ts` - HTTP client with standardized response handling
- `src/lib/utils.ts` - Utility functions
- Path alias `@/` maps to `src/`

### API Integration
- Uses standardized response format: `{ code, data, msg }`
- Success responses have `code: "0000"`
- Authentication errors (`code: "9004"`) trigger login redirect
- HTTP client configured for 10-minute timeout with custom error handling

### Routing Pattern
- Route files use `.lazy.tsx` for code splitting
- Nested routes in `sub-history/` for user detail views
- Root layout includes sidebar navigation and theme provider

### Development Notes
- TypeScript configured with path mapping for `@/*` imports
- ESLint with React and TypeScript rules
- Vite dev server with React Fast Refresh
- Uses pnpm as package manager