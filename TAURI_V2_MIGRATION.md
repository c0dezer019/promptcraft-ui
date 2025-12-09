# Tauri v2 Migration Guide

This document describes the refactoring done to support both Tauri v2 and web environments in the PromptCraft UI library.

## Overview

The library has been refactored to work seamlessly in both:
- **Web mode**: Running in a standard web browser with localStorage
- **Desktop mode**: Running as a Tauri v2 application with persistent storage

The refactoring maintains **backward compatibility with Tauri v1** while adding full support for Tauri v2.

## Key Changes

### 1. Platform Detection (`usePlatform` hook)

**File**: [hooks/usePlatform.js](hooks/usePlatform.js)

The `usePlatform` hook now detects both Tauri v1 and v2:

```javascript
import { usePlatform } from '@promptcraft/ui';

function MyComponent() {
  const { platform, isDesktop, isWeb } = usePlatform();
  // platform: 'web' | 'desktop'
  // isDesktop: boolean
  // isWeb: boolean
}
```

**Detection order**:
1. Try importing `@tauri-apps/api/app` (Tauri v2)
2. Fall back to checking `window.__TAURI__` (Tauri v1)
3. Default to web mode if neither exists

### 2. Storage Abstraction Layer

**File**: [utils/storage.js](utils/storage.js)

A new platform-agnostic storage utility that works in both web and desktop:

```javascript
import { initStorage, getItem, setItem, removeItem } from '@promptcraft/ui';

// Initialize storage (call once at app startup)
await initStorage();

// Use storage (same API for both web and desktop)
await setItem('my_key', { foo: 'bar' });
const data = await getItem('my_key', defaultValue);
await removeItem('my_key');
```

**Storage backends**:
- **Web**: Uses `localStorage` with JSON serialization
- **Desktop**: Uses Tauri Store plugin (`@tauri-apps/plugin-store`)

### 3. Tauri Invoke Wrapper

**File**: [utils/tauri.js](utils/tauri.js)

A unified API for calling Tauri commands that works with both v1 and v2:

```javascript
import { invoke, isTauri, getTauriVersion } from '@promptcraft/ui';

// Check if running in Tauri
if (await isTauri()) {
  // Call Tauri commands (works with v1 and v2)
  const result = await invoke('my_command', { arg1: 'value' });

  // Get Tauri version
  const version = getTauriVersion(); // 1, 2, or null
}
```

**API detection**:
1. Try importing `@tauri-apps/api/core` (Tauri v2)
2. Fall back to `window.__TAURI__.core.invoke` (Tauri v1)
3. Throw error if neither exists

## Updated Components & Hooks

### Hooks Updated

All Tauri-dependent hooks now use the new invoke wrapper:

- ✅ [hooks/useGeneration.js](hooks/useGeneration.js) - AI generation management
- ✅ [hooks/useJobs.js](hooks/useJobs.js) - Job queue management
- ✅ [hooks/useWorkflows.js](hooks/useWorkflows.js) - Workflow CRUD operations
- ✅ [hooks/useProviders.js](hooks/useProviders.js) - Provider configuration
- ✅ [hooks/useScenes.js](hooks/useScenes.js) - Scene management

### Components Updated

- ✅ [components/organisms/SettingsModal.jsx](components/organisms/SettingsModal.jsx)
  - Uses storage abstraction for settings persistence
  - Uses invoke wrapper for Tauri commands

### Utilities Updated

- ✅ [utils/aiApi.js](utils/aiApi.js)
  - `callAI()`, `loadAISettings()`, `saveAISettings()` now use storage abstraction
  - All functions are now async and return Promises

## Dependencies

### Optional Dependencies (Tauri v2)

Added as `optionalDependencies` in [package.json](package.json):

```json
{
  "optionalDependencies": {
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-store": "^2.0.0"
  }
}
```

These are optional because:
- Web applications won't need them
- Tauri v1 applications won't need them
- Only Tauri v2 applications require them

## Integration Guide

### For Web Applications

```javascript
import { initStorage } from '@promptcraft/ui';

// Initialize storage (uses localStorage in web mode)
await initStorage();

// Use the library normally - all Tauri-specific features will be disabled
```

### For Tauri v2 Applications

1. **Install Tauri v2 dependencies**:

```bash
npm install @tauri-apps/api@^2.0.0 @tauri-apps/plugin-store@^2.0.0
```

2. **Configure Tauri Store plugin** in `src-tauri/tauri.conf.json`:

```json
{
  "plugins": {
    "store": {
      "enabled": true
    }
  }
}
```

3. **Initialize storage in your app**:

```javascript
import { initStorage } from '@promptcraft/ui';

// Call this once at app startup
await initStorage();
```

4. **Grant necessary permissions** in `src-tauri/capabilities/default.json`:

```json
{
  "permissions": [
    "core:default",
    "store:default",
    "store:allow-get",
    "store:allow-set",
    "store:allow-save",
    "store:allow-keys",
    "store:allow-delete",
    "store:allow-clear"
  ]
}
```

### For Tauri v1 Applications

Tauri v1 is still supported! The library will automatically detect v1:

```javascript
import { initStorage } from '@promptcraft/ui';

// Initialize storage (falls back to localStorage in Tauri v1)
await initStorage();

// Library will use window.__TAURI__ for invoke calls
```

## Migration Checklist

If you're upgrading from an older version of this library:

- [ ] Update to the latest version of `@promptcraft/ui`
- [ ] Call `initStorage()` at your app's entry point
- [ ] Update any direct `localStorage` calls to use the storage API
- [ ] Update any `callEnhancementAPI` references to `callAI`
- [ ] Update any synchronous `loadAISettings()` calls to `await loadAISettings()`
- [ ] If using Tauri v2, install optional dependencies and configure the Store plugin
- [ ] Test in both web and desktop modes

## API Changes

### Breaking Changes

#### aiApi.js

- `loadAISettings()` is now async:
  ```javascript
  // Before
  const settings = loadAISettings();

  // After
  const settings = await loadAISettings();
  ```

- `saveAISettings()` is now async:
  ```javascript
  // Before
  saveAISettings(settings);

  // After
  await saveAISettings(settings);
  ```

### New Exports

The following utilities are now exported from the main package:

```javascript
// Storage utilities
export { initStorage, getItem, setItem, removeItem, clear, isDesktopMode, keys } from '@promptcraft/ui';

// Tauri utilities
export { invoke, isTauri, getTauriVersion } from '@promptcraft/ui';

// AI utilities (updated)
export { callAI, loadAISettings, saveAISettings } from '@promptcraft/ui';
```

## Architecture Benefits

1. **Platform Agnostic**: Same codebase works for web and desktop
2. **Backward Compatible**: Supports Tauri v1 without changes
3. **Forward Compatible**: Ready for Tauri v2
4. **Type Safety**: Consistent API across platforms
5. **Graceful Degradation**: Desktop features automatically disabled on web
6. **Single Source of Truth**: All storage goes through one abstraction layer

## Testing

### Test Web Mode

```bash
# Run in a web browser
npm run dev
```

### Test Tauri v1 Mode

```bash
# In a Tauri v1 project
npm run tauri dev
```

### Test Tauri v2 Mode

```bash
# In a Tauri v2 project with store plugin configured
npm run tauri dev
```

## Troubleshooting

### Storage not persisting in Tauri v2

**Problem**: Settings don't persist between app restarts

**Solution**:
1. Ensure `@tauri-apps/plugin-store` is installed
2. Verify the Store plugin is enabled in `tauri.conf.json`
3. Grant necessary permissions in capabilities
4. Call `initStorage()` before using storage

### Invoke calls failing

**Problem**: `invoke()` throws "Tauri API not available"

**Solution**:
1. For Tauri v2: Install `@tauri-apps/api`
2. For Tauri v1: Check that `window.__TAURI__` exists
3. For web: This is expected - use `isDesktop` to conditionally call invoke

### Platform detection incorrect

**Problem**: `isDesktop` is false in Tauri app

**Solution**:
1. Ensure optional dependencies are installed
2. Check browser console for import errors
3. Verify Tauri is properly configured

## Support

For issues or questions:
- Check the examples in this guide
- Review the source code in `utils/` directory
- Open an issue on GitHub with your environment details

## License

Same as the main PromptCraft UI library.
