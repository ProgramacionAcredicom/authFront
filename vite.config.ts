import { defineConfig, loadEnv, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";

  const pluginsConfig: PluginOption[] = [react(), tailwindcss()];

  if (process.env.ANALYZE) {
    pluginsConfig.push(
      visualizer({
        open: true,
        filename: "bundle-analysis.html",
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption
    );
  }

  return {
    plugins: pluginsConfig,
    base: env.VITE_BASE || "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Activar transpilation coherente
      target: "es2022",
      // Minificación y optimización
      minify: "esbuild",
      // Source maps: ocultos en producción para seguridad
      sourcemap: isProduction ? false : true,
      // Optimización de assets
      assetsInlineLimit: 4096, // Inline assets menores a 4kb
      // Chunk splitting strategy
      rollupOptions: {
        output: {
          // Separar vendor chunks inteligentemente
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("@tanstack")) {
                return "vendor-tanstack";
              }
              if (id.includes("@uiw/react-codemirror") || id.includes("@codemirror")) {
                return "vendor-codemirror";
              }
              if (id.includes("filepond") || id.includes("react-filepond")) {
                return "vendor-filepond";
              }
              if (id.includes("react-icons") || id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("@radix-ui")) {
                return "vendor-radix";
              }
              if (id.includes("react-router-dom") || id.includes("react-router")) {
                return "vendor-router";
              }
              if (id.includes("react-dom") || id.includes("react")) {
                return "vendor-react";
              }
              if (id.includes("axios")) {
                return "vendor-axios";
              }
              // Vendors restantes caen acá
              return "vendor";
            }
          },
          // Nombres de archivos con hash para cache busting
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split(".") || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
              return "assets/img/[name]-[hash][extname]";
            }
            if (/woff2?|eot|ttf|otf/i.test(ext || "")) {
              return "assets/fonts/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
      },
      // Tamaño de chunk warning (500kb)
      chunkSizeWarningLimit: 500,
      // Tree shaking está habilitado por defecto con esbuild
      // Optimización de CSS
      cssCodeSplit: true,
      // Compresión
      reportCompressedSize: true,
    },
    // Optimización de dependencias
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});
