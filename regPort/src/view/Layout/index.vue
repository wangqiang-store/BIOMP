<template>
    <el-container class="layout">
        <el-container class="is-vertical layout-right">
            <Header />
            <el-scrollbar>
                <div class="layout-main">
                    <Main />
                </div>
            </el-scrollbar>
        </el-container>
    </el-container>
</template>
<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header/index.vue';
import Main from './Main/index.vue';
const ROUTE = useRoute()

onMounted(() => {
    watch(() => ROUTE.path, (newData) => {
        const element: HTMLDivElement | null = document.querySelector(".layout .el-main")
        if (newData === '/main') {
            (element as HTMLDivElement).style.backgroundColor = '#eaeef7';
            // (element as HTMLDivElement).style.borderRadius = "none";
            (element as HTMLDivElement).style.boxShadow = "none";
        } else {
            (element as HTMLDivElement).style.backgroundColor = '#fff';
            // (element as HTMLDivElement).style.borderRadius = "16px 16px 0 0";
            (element as HTMLDivElement).style.boxShadow = "4.7px 3.9px 5.9px rgba(0, 0, 0, 0.015),12px 10px 16px rgba(0, 0, 0, 0.03)";
        }
    }, { immediate: true })
})
</script>

<style scoped lang="scss">
.layout {
    height: 100vh;
    min-height: 100vh;

    .layout-right {
        padding: 0;

        .el-header {
            background-color: rgb(9, 43, 96);
            z-index: 2014;
            color: white;
        }

        .layout-main {
            padding: 20px 20px 0 20px;
            min-height: calc(100vh - 100px);
            margin-bottom: 20px;
        }

        .el-main {
            width: 100%;
            min-height: calc(100vh - 100px);
            padding: 0;
        }
    }

    .layout-aside {
        color: #fff;
    }
}
</style>