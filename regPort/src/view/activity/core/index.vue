<template>
    <!-- 活动中心页面 -->
    <div v-loading="activityLoading">
        <center :total="total" :pagingParams="pagingParams" :listData="listData" @onSearch="onSearch"
            @onCurrentChange="onCurrentChange" @onSizeChange="onSizeChange" @onPickType="onPickType"></center>
    </div>
</template>
    
<script setup lang="ts">
import center from "../component/core.vue"
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { pagingActivityParams } from "@/api/type";
import { getPagingActivity } from "@/api/core/activity";
const Router = useRouter()

// 分页以及搜索参数
let total = ref(0)
let activityLoading = ref(false);
let pagingParams: pagingActivityParams = reactive({
    page: 1,
    limit: 8,
    content: "",
    activityType: undefined
})
let listData = ref([])
// 获取页面数据
const getData = async (params: pagingActivityParams) => {
    activityLoading.value = true;
    let { data } = await getPagingActivity(params);
    if (data.code !== 200) {
        activityLoading.value = false;
        return;
    }
    activityLoading.value = false;
    listData.value = data.data?.records;
    total.value = data.data?.total;
}

// 搜索
const onSearch = ({ content, type }: { content: string, type: number }) => {
    pagingParams.content = content;
    pagingParams.activityType = type;
    pagingParams.page = 1;
    getData(pagingParams)
}
const onCurrentChange = (page: number) => {
    pagingParams.page = page;
    getData(pagingParams)
}
const onSizeChange = (size: number) => {
    pagingParams.page = 1;
    pagingParams.limit = size;
    getData(pagingParams)
}
// 点击类型
const onPickType = (index: number | undefined) => {
    pagingParams.activityType = index;
    pagingParams.page = 1;
    getData(pagingParams)
}


onMounted(() => {
    getData(pagingParams)
})

</script>
    
<style scoped lang="scss">

</style>