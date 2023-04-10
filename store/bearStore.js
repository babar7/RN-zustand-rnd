import { create } from "zustand";
import { createStore } from "zustand/vanilla";
import { MMKV } from "react-native-mmkv";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";

let DEFAULT_STATE = { bears: 0 };
export const useBearStore = create((set, get) => ({
  bears: 0, //INITAIL_STATE
  test: "test",
  increasePopulation: (customParams) =>
    set((state) => ({ bears: state.bears + 1 })),
  decreasePopulation: (customParams) =>
    set((state) => ({ bears: state.bears - 1 })),
  setPopulation: (customParams) => set({ bears: customParams }),
  removeAllBears: (customParams) => set({ bears: 0 }),
  replaceAllBears: (customParams) => set((state) => DEFAULT_STATE, true), // clears the entire store, actions included
  // deleteTuna: () => set((state) => omit(state, ['tuna']), true),
  anyAction: () => {
    const bearsCount = get().bears;
    console.log("bearsCount", bearsCount);
  },
  changeText: () => set((state) => ({ test: "test" + state.bears })),
}));

export const useDogStore = create(
  subscribeWithSelector(() => ({ paw: true, snout: true, fur: true }))
);

// =============================================================================
// Using zustand without React
// =============================================================================

export const vanillaStore = createStore(() => ({ count: 0, text: "hello" }));
const { getState, setState, subscribe } = vanillaStore;

export const useVanillaStore = { getState, setState, subscribe };

// =============================================================================
// Slicing the store into smaller stores
// =============================================================================
export const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
});

export const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
});

// =============================================================================
// Zustand middleware-persist and React Native MMKV
// =============================================================================

const storageName = "app-persist-storage";
export const appPersistStorage = new MMKV({ id: storageName });

const zustandMMKVStorage = {
  setItem: (name, value) => {
    const stringValue = JSON.stringify(value);
    return appPersistStorage.set(name, stringValue);
  },
  getItem: (name) => {
    const value = appPersistStorage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  removeItem: (name) => {
    return appPersistStorage.delete(name);
  },
  clearAllData: (_) => appPersistStorage.clearAll(),
};

export const useAppPersistStore = create(
  persist(
    (set, get) => ({
      isDarkTheme: true,
      count: 0,
      // isHydrated: false,
      increaseCount: (customParams) =>
        set((state) => ({ count: state.count + 1 })),
      setIsDarkTheme: (preference) => set({ isDarkTheme: preference }),
      // setHydrated: () => set({isHydrated: true}),
    }),
    {
      name: storageName,
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({ count: state.count }),
      onRehydrateStorage: (state) => {
        // optional
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished");
            // for custom hydration logic
            // state.setHydrated();
          }
        };
      },
    }
  )
);
