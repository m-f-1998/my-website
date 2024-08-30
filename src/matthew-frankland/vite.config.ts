import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    fs: {
      allow: [
        '/Users/matthew-mac/GitHub/revive-scotland/client/node_modules',
        '/Users/matthew-mac/GitHub/website/src/matthew-frankland', // Add this path to the allow list
        // Other paths that need to be allowed
      ]
    }
  }
});