import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { downloadMiAccesoRequestPdf } from "@/services/mi-acceso/mi-acceso.services";

type MiAccesoPdfApiError = AxiosError<{ message?: string; error?: string; detail?: string }>;

function getFilenameFromContentDisposition(contentDisposition?: string) {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const fallbackMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return fallbackMatch?.[1] ?? null;
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const useMutationDownloadMiAccesoPdf = () => {
  return useMutation({
    mutationFn: async ({ id, code }: { id: number; code: string }) => {
      const response = await downloadMiAccesoRequestPdf(id);
      const filename = getFilenameFromContentDisposition(response.contentDisposition) ?? `${code}.pdf`;

      triggerBrowserDownload(response.blob, filename);
    },
    onError: (error: MiAccesoPdfApiError) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "No se pudo descargar el PDF de la solicitud.";

      toast.error(errorMessage);
    },
  });
};
