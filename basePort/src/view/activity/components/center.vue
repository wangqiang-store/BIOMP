<template>
  <!-- 活动中心页面 -->
  <div class="activityPage">
    <div class="page">
      <!-- 搜索 -->
      <div class="search">
        <el-input v-model.trim="content" size="large" style="width: 400px;border-radius: 0"
          :placeholder="type === 'my' ? '请输入活动标题、简介' : '请输入活动标题、简介、发布来源'" />
        <el-button type="primary" class="searchBtn" @click="onSearch" size="large">搜索</el-button>
        <el-button type="primary" v-if="type === 'my'" size="large" @click="onCreate">发布活动</el-button>
      </div>
      <!-- 活动类型 -->
      <div class="activityType">
        <span class="mr-20" style="font-weight: 700;">活动类型 : </span>
        <div class="typeList">
          <span :class="{ active: !typeIndex }" @click="onPickType('')">全部</span>
          <span v-for="(item, index) in acTypeList" :key="index" :class="{ active: item.status === typeIndex }"
            @click="onPickType(item.status)">{{ item.statusName }}</span>
        </div>
      </div>
      <!-- 活动列表 -->
      <div class="activityContent">
        <el-row v-if="listData && listData.length > 0">
          <el-col v-for="(item, index) in listData" :key="index" @click="goToDetail(item.id)" :span="6" :xs="24"
            :sm="12" :md="6">
            <div class="box">
              <div class="box-item">
                <el-image style="width: 100%;height: 180px;"
                  :src="item.coverPath ? fileBaseUrl + item.coverPath : defaultImg" />
                <div class="bottomBox">
                  <div class="title text-ellipsis" :title="item.title">{{ item.title }}</div>
                  <div class="desc text-ellipsis" :title="item.introduction">{{ item.introduction }}</div>
                  <div class="text text-ellipsis" v-if="type !== 'my'">发布来源:{{ item.sourceName }}</div>
                  <div class="time">
                    <div class="activityTime text-ellipsis"
                      :title="dayjs(item.activityTime).format('YYYY-MM-DD HH:mm')">活动时间: {{
                          dayjs(item.activityTime).format("YYYY-MM-DD HH:mm")
                      }}</div>
                    <div class="type">{{ showTypeFn(item.activityType) }}</div>
                  </div>
                </div>
                <div class="btn" v-if="type === 'my'">
                  <div @click.stop="onEdit(item.id)">编辑</div>
                  <div @click.stop="onDelete(item.id)">删除</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-empty v-else description="暂无数据" />
      </div>
      <!-- 分页 -->
      <el-pagination v-model:currentPage="pagingParams.page" v-model:page-size="pagingParams.limit"
        :page-sizes="[8, 16, 24]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="onSizeChange" @current-change="onCurrentChange" class="d_flex d_flex_end mt-10" />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, computed } from "vue";
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import { CustomType } from "@/types"
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store/index"
import defaultImg from "@/assets/u0.svg";
const { commonStore } = useStore()

const Router = useRouter()
const Route = useRoute()
let fileBaseUrl = computed(() => {
  return `${import.meta.env.VITE_BASE_URL}`
})

interface Props {
  type?: string;
  // 列表数据
  listData: CustomType;
  total: number;
  pagingParams: CustomType;
}

const props = withDefaults(defineProps<Props>(), {
  type: "center",
  listData: () => [],
  total: 0,
  pagingParams: () => { return {} }
})
let { total, pagingParams } = toRefs(props)

const emits = defineEmits<{
  (e: 'onSearch', content: string): void
  (e: 'onCurrentChange', page: number): void
  (e: 'onSizeChange', size: number): void
  (e: 'onPickType', value: number | string): void
  (e: 'onDelete', value: number): void
}>()


const onCurrentChange = (page: number) => {
  emits("onCurrentChange", page)
}
const onSizeChange = (limit: number) => {
  emits("onSizeChange", limit)
}


// 搜索
const content = ref("")
const onSearch = () => {
  emits("onSearch", content.value)
}

// 发布活动按钮
const onCreate = () => {
  commonStore.$patch({
    menuActivePath: Route.path
  })
  Router.push({
    path: "/activity/create",
    query: {
      id: ""
    }
  })
}

// 编辑
const onEdit = (id: number) => {
  commonStore.$patch({
    menuActivePath: Route.path
  })
  Router.push({
    path: "/activity/edit",
    query: {
      id
    }
  })
}
// 查看详情
const goToDetail = (id: any) => {
  commonStore.$patch({
    menuActivePath: Route.path
  })
  Router.push({
    path: "/activity/detail",
    query: {
      id
    }
  })
}
// 删除
const onDelete = (id: number) => {
  ElMessageBox.confirm(
    '是否删除该活动记录?',
    '删除提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      emits("onDelete", id)
    })
    .catch(() => { })
}


// 活动分类数据
const typeIndex: CustomType = ref(0)
const acTypeList: CustomType = ref([
  { statusName: "全部", status: "" }
])
// 活动类型切换
const onPickType = (index: number | string) => {
  typeIndex.value = index || 0
  emits("onPickType", index)
}
// 显示类型
const showTypeFn = (status: number) => {
  return acTypeList.value.filter((item: any) => item.status === status)[0]?.statusName
}

onMounted(async () => {
  //获取活动类型列表
  if (commonStore.activityTypeList.length === 0) {
    await commonStore.getActivityTypeFn()
  }
  acTypeList.value = commonStore.activityTypeList
})

</script>
  
<style scoped lang="scss">
.activityPage {
  position: relative;

  .page {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .search {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    :deep(.el-input__wrapper) {
      border-radius: 5px 0 0 5px !important;
    }

    .searchBtn {
      border-radius: 0 5px 5px 0;
    }
  }

  .activityType {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-left: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid $borderColor;

    .typeList {
      display: flex;

      span {
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
      }
    }

    .active {
      background-color: #2494ff;
      color: #fff;
    }
  }

  .activityContent {
    padding: 10px 0;
    max-width: 1200px;

    .box {
      cursor: pointer;
      padding: 10px;

      .box-item {
        border: 1px solid $borderColor;
        box-shadow: $pageBoxShadow;
        border-radius: 4px;

        .el-image {
          width: 100%;
          height: 160px;
          border-bottom: 1px solid $borderColor;
        }

        .bottomBox {
          padding: 20px 20px 10px 20px;

          .title {
            height: 20px;
            line-height: 20px;
            font-weight: 700;
            font-size: 18px;
          }

          .desc {
            height: 40px;
            line-height: 40px;
            font-size: 18px;
            color: gray;
          }

          .text,
          .time {
            color: #b8b8b8;
            padding: 2px 0;
          }

          .time {
            display: flex;
            justify-content: space-between;

            .activityTime {
              flex: 1;
            }

            .type {
              width: 70px;
              color: #2494ff;
            }
          }
        }

        .btn {
          display: flex;
          align-items: center;
          border-top: 1px solid $borderColor;
          background-color: #f7f9fa;

          div {
            flex: 1;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: gray;

            &:first-child {
              border-right: 1px solid $borderColor;
            }

            &:hover {
              color: #2494ff;
            }
          }
        }
      }
    }

  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 10px;
  }
}
</style>