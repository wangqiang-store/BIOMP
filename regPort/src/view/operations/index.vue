<template>
    <el-container class="hatch-layout">
        <el-aside class="hatch-aside">
            <el-menu :default-active="routePath" class="hatch-menu" router>
                <template v-for="item of hatchMenuOption" :key="item.index">
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
const hatchMenuOption = ref([
    {
        index: "/operations/hatch",
        title: "孵化基地管理",
        icon: "icon-icon_xinyong_xianxing_jijin-206"
    },
    {
        index: "/operations/company",
        title: "入驻创业实体管理",
        icon: "icon-qiyexinxi"
    },
    {
        index: "/operations/notify",
        title: "通告管理",
        icon: "icon-tonggao"
    }
])
const routePath = computed(() => {
    let path = ["/operations/hatch", "/operations/company", "/operations/notify"];
    return path.filter(item => {
        return ROUTE.path.indexOf(item) !== -1
    })[0]
})
</script>

<style scoped lang="scss">
.hatch-layout {
    height: 100%;

    .hatch-aside {
        width: 200px !important;
        background-color: #eaeef7;
        overflow: hidden;

        .hatch-menu {
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