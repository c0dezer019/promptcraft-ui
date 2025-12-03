import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// This is a source-based library
// The consuming apps (web/desktop) will bundle the source directly via their own vite builds
// No build step needed - this config is just for development/testing
export default defineConfig({
  plugins: [react()],
});
