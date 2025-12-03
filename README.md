# @promptcraft/ui

Shared UI component library for PromptCraft - A professional AI prompt engineering suite.

## Overview

This library provides reusable React components, hooks, utilities, and constants for building AI prompt engineering interfaces. It follows atomic design principles and supports both web and desktop (Tauri) applications.

## Installation

```bash
npm install @promptcraft/ui
# or
pnpm add @promptcraft/ui
# or
yarn add @promptcraft/ui
```

## Peer Dependencies

This library requires the following peer dependencies:

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "lucide-react": "^0.462.0"
}
```

## Usage

### Importing Components

```javascript
// Import all from main entry
import { Button, Input, MainLayout } from '@promptcraft/ui';

// Or import specific paths
import { Button } from '@promptcraft/ui/components/atoms/Button.jsx';
import { usePromptManager } from '@promptcraft/ui/hooks/usePromptManager.js';
```

### Components

#### Atoms
- `Button` - Base button component
- `Input` - Text input field
- `Label` - Form label
- `Badge` - Status/tag badge

#### Molecules
- `FormField` - Input with label
- `TagGroup` - Group of tags
- `EnhanceButton` - AI enhancement button
- `FileDropZone` - File upload area
- `ImportDialog` - Workflow import dialog
- `URLImportDialog` - URL-based import
- `SectionHeader` - Section title with actions
- `ContextMenu` - Right-click context menu

#### Organisms
- `Navigation` (Sidebar, MobileNav) - App navigation
- `MainLayout` - App shell layout
- `SettingsModal` - Settings configuration
- `PromptFooter` - Footer with actions
- `VideoBuilder` - Video prompt builder (Sora/Veo)
- `GrokBuilder` - Grok image prompt builder
- `DallEBuilder` - DALL-E prompt builder
- `MidjourneyBuilder` - Midjourney prompt builder
- `SDBuilder` - Stable Diffusion builder (ComfyUI/A1111)
- `GenerationPanel` - Generation controls

### Hooks

#### Shared Hooks
- `usePromptManager` - Manage prompt state
- `useDraggable` - Draggable UI elements
- `useHistory` - Browser history management
- `usePlatform` - Platform detection (web/desktop)
- `useWorkflowImport` - Import workflow logic

#### Desktop-Only Hooks (Tauri)
- `useGeneration` - AI generation management
- `useJobs` - Job queue management
- `useWorkflows` - Workflow CRUD operations
- `useProviders` - Provider configuration
- `useScenes` - Scene management
- `useOptionalTauriInvoke` - Safe Tauri invocation

### Utilities

- `exportHelper` - Export prompts to markdown, JSON, workflows
- `workflowParser` - Parse ComfyUI/A1111 workflows
- `pngMetadata` - Read/write PNG metadata
- `aiApi` - Call AI enhancement APIs (Gemini, OpenAI, Anthropic)

### Constants

- `TAG_CATEGORIES` - Modifier tag categories
- `NAV_ITEMS` - Navigation menu items
- `SAMPLERS` - Sampler definitions
- `NODE_TEMPLATES` - ComfyUI node templates

## Styling

This library uses Tailwind CSS. Make sure your consuming application has Tailwind configured with dark mode support:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@promptcraft/ui/**/*.{js,jsx}", // Include library components
  ],
  darkMode: 'class',
  // ... rest of config
}
```

## Architecture

### Component Structure

```
components/
├── atoms/           # Basic building blocks
├── molecules/       # Simple component combinations
├── organisms/       # Complex UI sections
└── templates/       # Page layouts
```

### Platform Support

This library supports both:
- **Web**: Pure React in browser
- **Desktop**: React + Tauri with Rust backend

Components use `usePlatform` to detect environment and conditionally enable features.

## Development

### Local Development

```bash
# Install dependencies
pnpm install

# Build library
pnpm build

# Watch mode for development
pnpm dev
```

### Testing with Applications

Use `npm link` or `pnpm link` to test locally before publishing:

```bash
# In this package
pnpm link --global

# In your consuming app
pnpm link --global @promptcraft/ui
```

## License

MIT

## Contributing

This library is part of the PromptCraft project. For contributions, please refer to the main repository.

## Related Packages

- **promptcraft-web** - Web application
- **promptcraft-desktop** - Desktop application with Tauri
