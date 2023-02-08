<template>
  <!-- 我的活动页面 -->
  <center type="my" :total="total" :pagingParams="pagingParams" :listData="listData" @onSearch="onSearch"
    @onCurrentChange="onCurrentChange" @onSizeChange="onSizeChange" @onPickType="onPickType" @onDelete="onDelete">
  </center>
</template>
    
<script setup lang="ts">
import center from "./components/center.vue"
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from "vue";
import { CustomType } from "@/types"
import { getActivityByMyPage, deleteActivity } from "@/api/activityApi/index"
import { useRouter } from "vue-router";
const Router = useRouter()

// 分页以及搜索参数
const total = ref(0)
const pagingParams: CustomType = ref({
  page: 1,
  limit: 8,
  content: "",
  type: 1
})
const listData = ref([])
// 获取页面数据
const getData = async () => {
  let { data } = await getActivityByMyPage(pagingParams.value)
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

// 删除
const onDelete = async (id: number) => {
  let { data } = await deleteActivity({ id })
  if (data.code === 200) {
    ElMessage({
      type: 'success',
      message: '活动记录已删除',
    })
    getData()
  }

}


onMounted(() => {
  getData()
})

</script>
    
<style scoped lang="scss">

</style>