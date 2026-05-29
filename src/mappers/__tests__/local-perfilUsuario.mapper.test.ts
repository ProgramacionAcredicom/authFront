import { describe, expect, it } from "vitest";

import type { UsuarioType } from "@/interfaces/perfilUsuario.interfaces";
import { localPerfilUsuarioMapper } from "@/mappers/local-perfilUsuario.mapper";

const baseProfile: UsuarioType = {
  id: 555,
  dpi: "3121784681215",
  cif: "2171026",
  ejecutivo_principal: null,
  name: "DANILO ESTUARDO CALDERON BARRIOS",
  username: "MCDECALDERON",
  email: "decalderon@acredicom.com.gt",
  picture: "https://authdev.mcenlinea.com/media/user_photos/3121784681215.jpg",
  user_type: "Usuario",
  agency: {
    id: 26,
    name: "CORPORATIVO",
    code: "corp",
    state: true,
  },
  role: {
    id: 80,
    role: "PROGRAMADOR FRONTEND",
    state: true,
  },
  area: null as UsuarioType["area"],
  grupos: [],
  is_active: true,
  is_staff: true,
  is_superuser: true,
  otp_enabled: false,
  mfa_method: null,
};

describe("localPerfilUsuarioMapper", () => {
  it("conserva oauth_perms cuando viene del backend", () => {
    const result = localPerfilUsuarioMapper({
      ...baseProfile,
      oauth_perms: [
        "acceso_reporteria_movimientos",
        "acceso_movimientos",
        "listar_roles_oauth",
      ],
    });

    expect(result.oauth_perms).toEqual([
      "acceso_reporteria_movimientos",
      "acceso_movimientos",
      "listar_roles_oauth",
    ]);
    expect(result.is_staff).toBe(true);
    expect(result.agency.name).toBe("CORPORATIVO");
    expect(result.role.role).toBe("PROGRAMADOR FRONTEND");
  });

  it("normaliza oauth_perms a arreglo vacío cuando no viene", () => {
    const result = localPerfilUsuarioMapper(baseProfile);

    expect(result.oauth_perms).toEqual([]);
  });
});
