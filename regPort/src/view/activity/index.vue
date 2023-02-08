<template>
    <el-container class="activity-layout">
        <el-aside class="activity-aside">
            <el-menu :default-active="routePath" class="activity-menu" router>
                <template v-for="item of activityMenuOption" :key="item.index">
                    <el-menu-item :index="item.index">
                        <i class="iconfont mr-10 icon" :class="item.icon"></i>
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
const ROUTE = useRoute()
const activityMenuOption = ref([
    {
        index: "/activity/core",
        title: "活动中心",
        icon: "icon-huodongzhongxin"
    },
    {
        index: "/activity/mine",
        title: "我的活动",
        icon: "icon-wodehuodong"
    },
])
const routePath = computed(() => {
    let pagePath = ['/activity/core', '/activity/mine']
    if (ROUTE.query.index) {
        return pagePath[Number(ROUTE.query.index)]
    }

    if (ROUTE.path === '/activity/publish') return pagePath[1]
    return ROUTE.path
})
</script>

<style scoped lang="scss">
.activity-layout {
    width: 100%;
    height: 100%;

    .activity-aside {
        width: 200px !important;
        background-color: #eaeef7;
        overflow: hidden;

        .activity-menu {
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

    .icon {
        font-size: $iconFontSize;
    }
}
</style>