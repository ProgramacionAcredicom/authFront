import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { columns } from "../columns";

const nameColumn = columns.find((column) => column.accessorKey === "name");

describe("columns colaboradores", () => {
  it("muestra candado abierto cuando el usuario está desbloqueado", () => {
    const cell = nameColumn?.cell as (context: { row: { original: unknown } }) => ReactNode;

    render(
      <>
        {cell({
          row: {
            original: {
              name: "Ana Pérez",
              username: "aperez",
              is_active: true,
              is_blocked: false,
              is_staff: false,
              is_superuser: false,
            },
          },
        })}
      </>,
    );

    expect(screen.getByLabelText("Usuario desbloqueado")).toBeInTheDocument();
  });

  it("muestra candado cerrado cuando el usuario está bloqueado", () => {
    const cell = nameColumn?.cell as (context: { row: { original: unknown } }) => ReactNode;

    render(
      <>
        {cell({
          row: {
            original: {
              name: "Luis Gómez",
              username: "lgomez",
              is_active: true,
              is_blocked: true,
              is_staff: false,
              is_superuser: false,
            },
          },
        })}
      </>,
    );

    expect(screen.getByLabelText("Usuario bloqueado")).toBeInTheDocument();
  });
});
