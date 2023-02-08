<template>
    <my-container class="mt-20">
        <my-head text="快速开始 / 便捷导航"></my-head>

        <div class="nav-main p-20 tac">
            <router-link class="mr-10" style="color: #1890ff;" :to="{ name: item.path }" v-for="item of navList"
                :key="item.path">{{ item.text }}
            </router-link>
        </div>
    </my-container>
</template> 
<script lang="ts" setup>
import { ref } from 'vue';
import myContainer from './component/myContainer.vue';
import myHead from './component/myHead.vue';
let navList = ref([
    {
        text: "基地管理",
        path: "operations"
    },
    {
        text: "实体管理",
        path: "company"
    },
    {
        text: "发布活动",
        path: "activityPublish"
    },
])
</script>

<style scoped lang="scss">

</style>