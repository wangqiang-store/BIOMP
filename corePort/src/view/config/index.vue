<template>
    <el-container class="config-layout">
        <el-aside class="config-aside">
            <el-menu :default-active="routePath" class="config-menu" :default-openeds="['/config/user']" router>
                <template v-for="item of configMenuOption" :key="item.index">
                    <el-sub-menu v-if="item.children" :index="item.index">
                        <template #title>
                            <i class="iconfont mr-10 icon" :class="item.icon"></i>
                            {{ item.title }}
                        </template>
                        <el-menu-item v-for="val of item.children" :key="val.index" :index="val.index">
                            {{ val.title }}
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item v-else :index="item.index">
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
const ROUTE = useRoute();
const configMenuOption = ref([
    {
        index: "/config/user",
        title: "用户中心",
        icon: "icon-yonghu",
        children: [
            {
                title: "中心账号",
                index: "/config/user/core"
            },
            {
                title: "区级账号",
                index: "/config/user/regional"
            },
            {
                title: "基地账号",
                index: "/config/user/base"
            }
        ]
    },
    {
        index: "/config/log",
        title: "操作日志",
        icon: "icon-caozuorizhi"
    },
]);
const routePath = computed(() => {
    return ROUTE.path
})
</script>

<style scoped lang="scss">
.config-layout {
    height: 100%;

    .config-aside {
        width: 200px !important;
        background-color: #eaeef7;
        overflow: hidden;

        .config-menu {
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