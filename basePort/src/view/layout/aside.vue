<template>
  <el-aside width="200px" ref="asideRef" class="asidePage">
    <div class="title">
      <h2 class="menuTitle">穗创汇</h2>
    </div>
    <el-menu active-text-color="#ffd04b" background-color="#00284d" class="el-menu-vertical-demo" unique-opened router
      :collapse="isCollapse" :default-active="menuActivePath || Route.path" text-color="#a5b3c0">
      <el-menu-item index="/main">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <template #title>首页</template>
      </el-menu-item>
      <el-menu-item index="/baseInfo">
        <el-icon>
          <Edit />
        </el-icon>
        <template #title>基地信息</template>
      </el-menu-item>
      <el-menu-item index="/company">
        <el-icon>
          <Collection />
        </el-icon>
        <template #title>入驻实体管理</template>
      </el-menu-item>
      <el-sub-menu index="/activity">
        <template #title>
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <span>活动沙龙</span>
        </template>
        <el-menu-item index="/activity">活动中心</el-menu-item>
        <el-menu-item index="/activity/my">我的活动</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/expert">
        <el-icon>
          <User />
        </el-icon>
        <template #title>创业专家导师库</template>
      </el-menu-item>
      <el-menu-item index="/notify">
        <el-icon>
          <Message />
        </el-icon>
        <template #title>通知通告</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { HomeFilled, Edit, Collection, OfficeBuilding, User, Message } from "@element-plus/icons-vue";
import useStore from "@/store";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
const { commonStore } = useStore();
const { isCollapse, menuActivePath } = storeToRefs(commonStore);
const Route = useRoute();



// 侧边栏收缩数据
const asideRef: any = ref("");
watch(isCollapse, (newVal, oldVal) => {
  asideRef.value.$el.style.transition = "width .5s";
  asideRef.value.$el.style.width = newVal ? "64px" : "200px";
  let menuTitle: any = document.querySelector(".menuTitle");
  menuTitle.style.left = newVal ? "-200px" : "0px";
});
onMounted(() => {
  asideRef.value.$el.style.width = isCollapse.value ? "64px" : "200px";
  let menuTitle: any = document.querySelector(".menuTitle");
  if (menuTitle) {
    menuTitle.style.left = isCollapse.value ? "-200px" : "0px";
  }
});
</script>
  
<style scoped lang="scss">
.asidePage {
  height: 100vh;
  box-sizing: border-box;
  background-color: #00284d;
  overflow: inherit;

  .title {
    height: 50px;
    line-height: 50px;
    text-align: center;

    h2 {
      font-size: 15px;
      color: #fff;
    }

    .menuTitle {
      width: 100%;
      position: absolute;
      text-align: center;
    }
  }

  .el-menu {
    border-right-width: 0;

    .el-menu-item {
      margin: 10px 0;
      // border-radius: 28px;
      height: 42px;

      &.is-active {
        color: #fff;
        font-weight: 700;
        background-color: #409eff;
      }
    }
  }
}
</style>