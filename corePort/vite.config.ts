import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import fullImportPlugin from "./build/plugins/fullImportPlugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      mode === "development"
        ? fullImportPlugin()
        : Components({
            resolvers: [ElementPlusResolver()],
          }),
      mode === "development" && Components(),
    ],
    resolve: {
      // 别名配置
      alias: {
        "@": path.join(__dirname, "src"),
        "@assets": path.join(__dirname, "src/assets"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/styles/variable.scss';`,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8080,
      open: true,
      cors: true,
      proxy: {
        "/api": {
          target: "http://47.112.167.239:8101",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      outDir: "dist",
      assetsDir: "static",
      cssCodeSplit: true,
      chunkSizeWarningLimit: 4500,
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split("/")
              : [];
            const fileName =
              facadeModuleId[facadeModuleId.length - 2] || "[name]";
            return `js/${fileName}/[name].[hash].js`;
          },
        },
      },
    },
  };
});
