import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Every page (Home included) eagerly needs React and the Supabase
        // client, so per-route code-splitting alone can't shrink the main
        // chunk below ~500KB — React 19 + the full @supabase/supabase-js
        // SDK (which bundles its Realtime/Storage/Auth sub-clients even
        // though this app only uses Auth, for the admin login) make up
        // most of that weight on their own. Splitting them into their own
        // vendor chunks doesn't reduce total bytes shipped, but it clears
        // the single-chunk warning and lets browsers cache this rarely-
        // changing vendor code across deploys, re-downloading only the
        // much smaller app chunk each time.
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
        },
      },
    },
  },
})
