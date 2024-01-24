import react from '@vitejs/plugin-react-swc';
import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';
import envCompatiblePlugin from 'vite-plugin-env-compatible';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), envCompatiblePlugin()],
  define: {
    'process.env': process.env,
  },
  resolve: {
    alias: [
      { find: "src", replacement: "/src" },
    ],
  },
  build: {
    rollupOptions: {
      plugins: [
        copy({
          targets: [
            {
              src: "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
              dest: "dist"
            },
            {
              src: "node_modules/@ricky0123/vad-web/dist/*.onnx",
              dest: "dist"
            },
            {
              src: "node_modules/onnxruntime-web/dist/*.wasm",
              dest: "dist"
            },
          ],
        }),
      ],
    },
  },
  server: {
    port: 3000
  }
})
