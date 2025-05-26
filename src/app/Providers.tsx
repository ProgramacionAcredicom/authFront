import { ThemeProvider } from "@/components/theme /theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster richColors closeButton expand position="top-center" />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
