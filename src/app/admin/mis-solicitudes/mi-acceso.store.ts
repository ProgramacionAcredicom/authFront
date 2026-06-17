import { create } from "zustand";

import { getInitialMiAccesoRequests } from "./mi-acceso.mock";
import { buildMiAccesoRequestFromDraft } from "./mi-acceso.utils";
import type { MiAccesoRequest, MiAccesoRequestDraft } from "./mi-acceso.types";

interface MiAccesoStoreState {
  requests: MiAccesoRequest[];
  addRequest: (draft: MiAccesoRequestDraft) => MiAccesoRequest;
  reset: () => void;
  seed: (requests: MiAccesoRequest[]) => void;
}

const initialRequests = getInitialMiAccesoRequests();

export const useMiAccesoStore = create<MiAccesoStoreState>()((set, get) => ({
  requests: initialRequests,
  addRequest: (draft) => {
    const request = buildMiAccesoRequestFromDraft(draft, get().requests);

    set((state) => ({
      requests: [request, ...state.requests],
    }));

    return request;
  },
  reset: () => {
    set({ requests: getInitialMiAccesoRequests() });
  },
  seed: (requests) => {
    set({ requests });
  },
}));

export function resetMiAccesoStore() {
  useMiAccesoStore.getState().reset();
}
