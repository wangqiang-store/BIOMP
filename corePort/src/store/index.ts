import userStore from "./useUserStore";
import moduleStore from "./useModuleStore";
import pageStore from "./usePageStore";
import commonStore from "./useCommonStore";
const useStore = () => {
  return {
    userStore: userStore(),
    moduleStore: moduleStore(),
    pageStore: pageStore(),
    commonStore: commonStore(),
  };
};

export default useStore;
    