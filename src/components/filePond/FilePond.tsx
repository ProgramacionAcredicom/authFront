// FilePondComponent.tsx
import React, { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import type { FilePondFile } from "filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import type { ControllerRenderProps } from "react-hook-form";
import type { ColaboradorSchema } from "@/schemas/colaboradores/colaborador.schema";

// Registra los plugins de EXIF y preview
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

type InitialPondFile =
  | File
  | {
      source: string;
      options: {
        type: "local";
        file?: {
          name: string;
          size?: number;
          type?: string;
        };
      };
    };

interface Props {
  field: ControllerRenderProps<ColaboradorSchema, "picture">;
}

export function FilePondComponent({ field }: Props) {
  // Convierte el valor recibido (URL o File) en el formato que FilePond entiende
  const toPondFiles = (value: unknown): InitialPondFile[] => {
    if (!value) return [];
    if (value instanceof File) {
      // Usuario acaba de elegir un archivo
      return [value];
    }
    if (typeof value === "string" && value) {
      // Viene de la BD como URL
      const name = value.split("/").pop() || "imagen.jpg";
      return [
        {
          source: value,
          options: {
            type: "local",
            file: { name },
          },
        },
      ];
    }
    return [];
  };

  // Estado interno de FilePond
  const [pondFiles, setPondFiles] = useState<InitialPondFile[]>(toPondFiles(field.value));

  // Sincroniza con el valor externo (react-hook-form → FilePond)
  useEffect(() => {
    setPondFiles(toPondFiles(field.value));
  }, [field.value]);

  // Cuando el usuario añade/quita archivos
  const handleUpdateFiles = (items: FilePondFile[]) => {
    // Extrae los File puros
    const chosenFiles = items.map((item) => item.file as File | null).filter((f): f is File => !!f);

    // Actualiza el estado de FilePond
    setPondFiles(items as unknown as InitialPondFile[]);

    // Notifica a React Hook Form (solo un archivo)
    field.onChange(chosenFiles.length > 0 ? chosenFiles[0] : null);
  };

  return (
    <div className="mx-auto w-1/2">
      <FilePond
        files={pondFiles}
        onupdatefiles={handleUpdateFiles}
        allowMultiple={false}
        maxFiles={1}
        name={field.name}
        imagePreviewHeight={170}
        labelIdle="Arrastra tu imagen aquí o haz clic para seleccionar"
        credits={false}
        stylePanelLayout="compact circle"
        styleButtonRemoveItemPosition="center top"
        server={{
          // Permite precargar desde URL
          load: (source, load, error, progress, abort) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", source, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                load(xhr.response);
              } else {
                error("No se pudo cargar la imagen");
              }
            };
            xhr.onerror = () => error("Error de red al cargar la imagen");
            xhr.onprogress = (e) => progress(e.lengthComputable, e.loaded, e.total);
            xhr.send();

            return {
              abort: () => {
                xhr.abort();
                abort();
              },
            };
          },
        }}
      />
    </div>
  );
}
