import { AgenciasTypes, Chif } from "@/interfaces/agencias.interfaces";

export class AgenciasModel {
  id: number;
  code: string;
  name: string;
  chif: Chif | null;
  state: boolean;
  no_colaboradores: number;
  constructor(agencia: AgenciasTypes) {
    this.id = agencia.id;
    this.code = agencia.code;
    this.name = agencia.name;
    this.chif = agencia.chif;
    this.state = agencia.state;
    this.no_colaboradores = agencia.no_colaboradores;
  }
}
