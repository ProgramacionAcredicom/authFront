import { KeyRound } from "lucide-react";

import { PageShell, PageIntro } from "@/components/layout/page-shell";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function MiAccesoPage() {
  return (
    <PageShell contentClassName="max-w-5xl gap-6">
      <PageIntro title={<h1 className="text-2xl font-semibold tracking-tight">MI ACCESO</h1>} description="Este módulo queda preparado como contenedor para futuras funcionalidades de acceso." />

      <Empty className="border bg-card py-16 shadow-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <KeyRound />
          </EmptyMedia>
          <EmptyTitle>Próximamente</EmptyTitle>
          <EmptyDescription>Aquí vamos a incorporar las opciones y configuraciones relacionadas con tu acceso.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageShell>
  );
}
