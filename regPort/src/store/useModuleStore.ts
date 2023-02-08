import { defineStore } from "pinia";
import { useModuleStoreState } from "./type";

const useModuleStore = defineStore("module", {
  state(): useModuleStoreState {
    return {
      currmentUserId: [],
    };
  },
});

export default useModuleStore;
