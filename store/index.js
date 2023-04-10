import {
  createBearSlice,
  createFishSlice,
  useAppPersistStore,
  useBearStore,
} from "./bearStore";
import {create} from "zustand";

const useZustandStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}));

export {useBearStore, useZustandStore, useAppPersistStore};
