export interface AgenciasTypes {
    id:               number;
    code:             string;
    name:             string;
    chif:             Chif;
    state:            boolean;
    no_colaboradores: number;
}


export interface AgenciasModelTypes {
    id:               number;
    code:             string;
    name:             string;
    chif:             Chif | null;
    state:            boolean;
    no_colaboradores: number;
}

export interface AgenciasCreateType {
    id:               number;
    code:             string;
    name:             string;
    chif:             Chif;
    state:            boolean;
    no_colaboradores: number;
}

export interface Chif {
    id:    number;
    name:  string;
    email: string;
    role:  string;
}
