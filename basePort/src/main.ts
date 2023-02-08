import { createApp } from "vue";
import App from "./App.vue";
// 引入路由
import router from "./route";
// 引入pinia
import { createPinia } from "pinia";
// 引入pinia状态持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// 引入element plus样式
import "element-plus/dist/index.css";
// 引入重置样式
import "@/styles/reset.scss";
// 引入基础样式
import "@/styles/index.scss";
// 引入全局样式
import "@/styles/global.scss";
import md5 from "js-md5";
// 引入dayjs
import * as dayjs from "dayjs";
// 引入注册全局图标方法
import registerIcons from "@/icon";
// 加载字体图标
import "@/icon/iconfont/iconfont.css";
// 加载全局路由守卫
import "./permission";
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from "echarts/components";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
const app = createApp(App);
const pinia = createPinia();
// 调用注册图标方法
registerIcons(app);
pinia.use(piniaPluginPersistedstate);
app.config.globalProperties.$md5 = md5;
app.config.globalProperties.$dayjs = dayjs;
app.use(pinia).use(router).mount("#app");
