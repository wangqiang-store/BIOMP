import { App } from "vue";
import {
  UserFilled,
  Lock,
  View,
  Hide,
  ArrowLeftBold,
  ArrowRightBold,
  Document,
  User,
  House,
  Search,
  Plus,
  DeleteFilled,
} from "@element-plus/icons-vue";
let icons = [
  {
    key: "UserFilled",
    component: UserFilled,
  },
  {
    key: "Lock",
    component: Lock,
  },
  {
    key: "View",
    component: View,
  },
  {
    key: "Hide",
    component: Hide,
  },
  {
    key: "ArrowLeftBold",
    component: ArrowLeftBold,
  },
  {
    key: "ArrowRightBold",
    component: ArrowRightBold,
  },
  {
    key: "Document",
    component: Document,
  },
  {
    key: "User",
    component: User,
  },
  {
    key: "House",
    component: House,
  },
  {
    key: "Search",
    component: Search,
  },
  {
    key: "Plus",
    component: Plus,
  },
  {
    key: "DeleteFilled",
    component: DeleteFilled,
  },
];

export default (app: App<Element>) => {
  icons.forEach(({ key, component }) => {
    app.component(key, component);
  });
};
