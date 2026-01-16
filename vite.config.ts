import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react(), tailwindcss()],
    base: process.env.VITE_BASE || "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Minificación y optimización
      minify: "esbuild",
      // Source maps: ocultos en producción para seguridad
      sourcemap: isProduction ? false : true,
      // Optimización de assets
      assetsInlineLimit: 4096, // Inline assets menores a 4kb
      // Chunk splitting strategy
      rollupOptions: {
        output: {
          // Separar vendor chunks
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes("node_modules")) {
              // React y React DOM juntos
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor-react";
              }
              // React Router
              if (id.includes("react-router")) {
                return "vendor-router";
              }
              // TanStack Query
              if (id.includes("@tanstack/react-query")) {
                return "vendor-query";
              }
              // Radix UI components
              if (id.includes("@radix-ui")) {
                return "vendor-radix";
              }
              // Axios
              if (id.includes("axios")) {
                return "vendor-axios";
              }
              // Otros vendors
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
