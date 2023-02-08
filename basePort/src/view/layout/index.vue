<template>
    <div class="layoutPage">
        <el-container class="layout">
            <el-scrollbar>
                <Aside class="layoutAside left"></Aside>
            </el-scrollbar>
            <el-container class="right">
                <Header class="layoutHeader"></Header>
                <div class="layoutMain">
                    <el-scrollbar class="layout-scrollbar">
                        <div class="mainContent">
                            <router-view></router-view>
                        </div>
                    </el-scrollbar>
                </div>
            </el-container>
        </el-container>
    </div>
</template>
  
  
<script setup lang="ts">
import Aside from "./aside.vue"
import Header from "./header.vue"
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
const ROUTE = useRoute()

onMounted(() => {
    watch(() => ROUTE.path, (newData) => {
        const element: HTMLDivElement | null = document.querySelector(".layout .mainContent")
        if (newData === '/main') {
            (element as HTMLDivElement).style.backgroundColor = '#f0f2f5';
            // (element as HTMLDivElement).style.borderRadius = "none";
            (element as HTMLDivElement).style.padding = "0";
        } else {
            (element as HTMLDivElement).style.backgroundColor = '#fff';
            // (element as HTMLDivElement).style.borderRadius = "16px 16px 0 0";
            (element as HTMLDivElement).style.padding = "50px";
            // (element as HTMLDivElement).style.boxShadow = "4.7px 3.9px 5.9px rgba(0, 0, 0, 0.015),12px 10px 16px rgba(0, 0, 0, 0.03)";
        }
    }, { immediate: true })
})
</script>
  
<style scoped lang="scss">
.layoutPage {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    background-color: #f0f2f5;

    .layout {
        display: flex;

        .right {
            flex: 1;
            display: block;

            .layoutHeader {
                width: 100%;
                background-color: #fff;
            }

            .layoutMain {
                width: 100%;
                height: auto;
                max-height: calc(100vh - 61px);
                padding: 20px;
                box-sizing: border-box;
                background-color: #f0f2f5;

                .mainContent {
                    min-height: calc(100vh - 90px);
                    // overflow-y: auto;
                }

                &:deep(.layout-scrollbar) {
                    height: calc(100vh - 90px);
                }
            }
        }


    }

}
</style>