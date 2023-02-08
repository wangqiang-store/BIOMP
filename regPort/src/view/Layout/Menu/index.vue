<template>
    <el-aside class="aside">
        <el-menu class="el-menu-vertical" active-text-color="#ffd04b" :default-active="defaultActive"
            background-color="#092b60" text-color="#fff" router mode="horizontal">
            <template v-for="item of menuOption" :key="item.id">
                <el-menu-item :index="item.path">
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </el-aside>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const ROUTE = useRoute();
const menuOption = ref([
    {
        name: "首页",
        path: "/main"
    },
    {
        name: "运营管理",
        path: "/operations"
    },
    {
        name: "创业专家导师库",
        path: "/database"
    },
    {
        name: "活动沙龙",
        path: "/activity"
    },
    {
        name: "统计报表",
        path: "/statistics"
    },
    {
        name: "配置中心",
        path: "/config"
    }
]);

const defaultActive = computed(() => {
    let indexPaths = ['/main', '/operations', '/database', '/activity', '/statistics', '/config'];
    return indexPaths.filter(item => {
        return `/${ROUTE.path.split('/')[1]}` === item
    })[0]
})
</script>

<style scoped lang="scss">
.aside {
    width: auto !important;
    background-color: #eaeef7;
    overflow: hidden;

    .el-menu-vertical {
        width: 720px;
        min-width: 500px;
        height: 100%;
        border: none;
        overflow: auto;
        display: flex;
        justify-content: center;

        &::-webkit-scrollbar {
            width: 0;
        }

        .aside-top {
            width: 100%;
            height: 60px;
            background-color: $themeColor;
            border-bottom-right-radius: 24px;
            margin-bottom: 20px;
        }
    }
}
</style>