import { Title } from "@/components/title/Title";
import { TypographyH2 } from "@/components/ui/typography";

export default function AdminPage() {
  return (
    <section>
      <Title />
      <article className="mt-10">
        <TypographyH2 text="Estadisticas" />
        <div className="mt-4 grid grid-cols-2 gap-10"></div>
      </article>
    </section>
  );
}
