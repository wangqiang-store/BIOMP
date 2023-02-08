import commonStore from "./useCommonStore";
import moduleStore from "./useModuleStore";
const useStore = () => {
  return {
    commonStore: commonStore(),
    moduleStore: moduleStore()
  };
};

export default useStore;
