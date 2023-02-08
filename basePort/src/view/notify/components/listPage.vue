<template>
  <div class="listPage" v-loading="loading">
    <!-- 头部 -->
    <div class="header">
      <div class="headerTitle">{{ titleName }}</div>
      <div class="realTag" @click="onUpdateAllStatus
      ">全部标记为已读</div>
    </div>

    <!-- 列表 -->
    <div v-if="messageList.length > 0">
      <div class="messageList" @click="goToDetails(item.id)" v-for="(item, index) in messageList" :key="index">
        <p class="title text-ellipsis" :style="{ color: item.isRead ? '#333' : '#999' }">{{ item.title }}</p>
        <p class="text-ellipsis mt-5 mb-5" :title="item.content">{{ item.content }}</p>
        <p>
          <span class="mr-20">发布时间: {{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
          <span v-if="props.type !== 'msg'">上报期限: {{ dayjs(item.reportedTime).format("YYYY-MM-DD") }}</span>
        </p>
      </div>
    </div>
    <div v-else>
      <el-empty description="暂无通知" />
    </div>

    <!-- 分页 -->
    <ReusePagination :total="total" :current-page="pagingParams.page" :page-size="pagingParams.limit" :background="true"
      @size-change="onSizeChange" @current-change="onCurrentChange" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus'
import { CustomType } from "@/types";
import { getNoticeByPage, updateAllNoticeStatus } from "@/api/notifyApi/index"
import dayjs from "dayjs"
import useStore from "@/store/index"
import { storeToRefs } from "pinia"
const { commonStore } = useStore()
const { notifyTypeList } = storeToRefs(useStore().commonStore)
const Router = useRouter();
const Route = useRoute();

interface Props {
  type: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "msg",
});

const titleName = ref(props.type === "msg" ? "消息通知" : "待办通知");

// 分页参数数据
let pagingParams: CustomType = reactive({
  limit: 10,
  page: 1,
  type: undefined,
});
// 通知数据
const loading = ref(false)
let total = ref(0);
const messageList: any = ref([]);
const onSizeChange = (limit: number) => {
  pagingParams.limit = limit;
  getPageData();
};
const onCurrentChange = (page: number) => {
  pagingParams.page = page;
  getPageData();
};
// 获取页面数据
const getPageData = async () => {
  loading.value = true
  let { data } = await getNoticeByPage(pagingParams)
  if (data.code === 200) {
    messageList.value = data.data?.records
    total.value = data.data?.total
  }
  loading.value = false
};

// 进入详情页面
const goToDetails = (id: number) => {
  commonStore.$patch({
    twoMenuActivePath: Route.path
  })
  Router.push({
    path: "/notify/details",
    query: { id },
  });
};

//
const onUpdateAllStatus = () => {
  ElMessageBox.confirm(
    '是否将全部信息标记为已读?',
    '标记为已读提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let { data } = await updateAllNoticeStatus({ type: pagingParams.type })
      if (data.code === 200) {
        ElMessage({
          type: 'success',
          message: '已成功全部标记为已读',
        })
        getPageData()
      }
    })
    .catch(() => { })
}

onMounted(async () => {
  //处理获取的通知类型: 1通知 2任务
  pagingParams.type = Route.path === "/notify/msg" ? 1 : 2;

  // 获取数据
  getPageData()
});
</script>
<style scoped lang="scss">
.listPage {
  padding: 40px 40px 0 40px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .headerTitle {
      font-size: 18px;
      font-weight: 700;
    }

    .realTag {
      color: #1890ff;

      &:hover {
        cursor: pointer;
        font-weight: 700;
      }
    }
  }

  .messageList {
    color: #999;
    padding: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid $borderColor;
    cursor: pointer;

    p {
      line-height: 20px;
    }

    .title {
      font-weight: 700;
    }
  }
}
</style>
