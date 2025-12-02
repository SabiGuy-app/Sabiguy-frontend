import { create } from "zustand";


export const useProviderStore = create ((set) => ({
    providers: [],
    selectedProvider: null,


    setProviders: (providers) => set({ providers }),
    addProvider: (provider) =>
        set((state) => ({ providers: [...state.providers, provider]})),

    setSelectedProvider: (provider) => set({ selectedProvider: provider }),
}))