import { AgenciasModelTypes } from "@/interfaces/agencias.interfaces";
import { AgenciasModel } from "@/models/agencias.model";

export const localAgenciasMapper = (agencias: AgenciasModelTypes)=>{
    return new AgenciasModel({
        id: agencias.id,
        code: agencias.code,
        name: agencias.name,
        chif: agencias.chif,
        state: agencias.state,
        no_colaboradores: agencias.no_colaboradores
    })
}