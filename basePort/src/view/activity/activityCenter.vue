<template>
  <!-- 活动中心页面 -->
  <center :total="total" :pagingParams="pagingParams" :listData="listData" @onSearch="onSearch"
    @onCurrentChange="onCurrentChange" @onSizeChange="onSizeChange" @onPickType="onPickType"></center>
</template>
  
<script setup lang="ts">
import center from "./components/center.vue"

import { onMounted, reactive, ref } from "vue";
import { getActivityByPage } from "@/api/activityApi/index"
import { CustomType } from "@/types"
import { useRouter } from "vue-router";
const Router = useRouter()

// 分页以及搜索参数
const total = ref(0)
const pagingParams: CustomType = ref({
  page: 1,
  limit: 8,
  content: "",
  activityType: ""
})
const listData = ref([])
// 获取页面数据
const getData = async () => {
  let { data } = await getActivityByPage(pagingParams.value)
  if (data.code === 200) {
    listData.value = data.data.records
    total.value = data.data.total
  }
}

// 搜索
const onSearch = (content: string) => {
  pagingParams.value.page = 1
  pagingParams.value.content = content
  getData()
}
const onCurrentChange = (page: number) => {
  pagingParams.value.page = page
  getData()
}
const onSizeChange = (limit: number) => {
  pagingParams.value.limit = limit
  getData()
}
// 点击类型
const onPickType = (index: number | string) => {
  pagingParams.value.activityType = index
  getData()
}


onMounted(() => {
  getData()
})

</script>
  
<style scoped lang="scss">

</style>