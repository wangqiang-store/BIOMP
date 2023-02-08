<template>
  <!-- 通知通告 - 布局页面 -->
  <el-container class="message-layout">
    <el-aside class="message-aside">
      <el-menu :default-active="commonStore.twoMenuActivePath || Route.path" class="message-menu" router>
        <template v-for="item of activityMenuOption" :key="item.index">
          <el-menu-item :index="item.index">
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-scrollbar class="w-100">
      <el-main>
        <RouterView />
      </el-main>
    </el-scrollbar>
  </el-container>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import useStore from "@/store/index";
const { commonStore } = useStore();
const Route = useRoute();
const activityMenuOption = ref([
  {
    index: "/notify/msg",
    title: "消息通知",
  },
  {
    index: "/notify/pending",
    title: "待办通知",
  },
]);


onMounted(() => {
  // 处理页面的内边距padding
  // let page: any = document.querySelector(".mainContent");
  // if (page) page.style.padding = "0";

  commonStore.$patch((state) => {
    state.menuActivePath = "/notify";
  });
});

watch(() => Route.path, (newVal) => {
  let type = Route.query.type;
  if (newVal.indexOf("/notify") > -1) {
    nextTick(() => {
      let page: any = document.querySelector(".mainContent");
      if (page) page.style.padding = "0";
    })

    if (type) {
      commonStore.$patch((state) => {
        state.twoMenuActivePath = Number(type) === 1 ? "/notify/msg" : "/notify/pending";
      });
    }
  }
}, { immediate: true })
onBeforeRouteLeave(() => {
  // 处理页面的padding
  // let page: any = document.querySelector(".mainContent");
  // if (page) page.style.padding = "50px";

  // 处理高亮显示
  commonStore.$patch({
    menuActivePath: "",
    twoMenuActivePath: ""
  });
});
</script>

<style scoped lang="scss">
.message-layout {
  width: 100%;
  height: 100%;

  .message-aside {
    width: 200px !important;
    background-color: #eaeef7;
    overflow: hidden;

    .message-menu {
      height: 100%;
      min-height: calc(100vh - 120px);
      overflow: auto;

      &::-webkit-scrollbar {
        width: 0;
      }

      .el-menu-item.is-active {
        background-color: #e6f7ff;
        border-right: 4px solid #1890ff;
      }
    }
  }

  .el-main {
    width: 100%;
    height: 100%;
  }
}
</style>
