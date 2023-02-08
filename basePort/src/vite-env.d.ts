/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "js-md5";
declare module "nprogress";
declare module "animejs";
declare interface Window { onShare: any; }