<template>
  <el-button round class="goBack" @click="onGoBack">返回</el-button>
  <div class="detailsPage" v-loading="loading">
    <div class="headerTitle">通知详情</div>
    <!-- 详情标题 -->
    <div class="detailHeader">
      <div class="title">{{ detailsData.title }}</div>
      <div class="info">
        <span>发布时间:{{ dayjs(detailsData.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        <span class="mr-10 ml-10">发布来源:广州市青年就业创业协会 ( {{ detailsData.createUserName }} )</span>
        <span>类型:
          <el-tag :color="tagColor" :style="{ color: tagTextColor }">{{ tagName }}</el-tag>
        </span>
      </div>
    </div>
    <div class="content">
      <div class="itemTitle">通知内容</div>
      <div class="textarea">
        <div v-if="detailsData.isCountySend && detailsData.countyCode">
          <div class="mt-10 mb-5">{{ countyName }}就业活动指导中心转发:</div>
          <pre>{{ detailsData.countyContent }}</pre>

          <div class="mt-20 mb-5">附件:</div>
          <div class="download" v-for="(item, index) in detailsData.countyFileIdsList" :key="index">
            <span class="mr-10 text-ellipsis" :title="item.name">{{ item.name }}</span>
            <span>
              <el-link type="primary" @click="onDownload(item)">下载</el-link>
            </span>
          </div>
          <el-divider />
        </div>

        <div>
          <div class="mt-10 mb-5">中心通知发布:</div>
          <pre>{{ detailsData.content }}</pre>

          <div class="mt-20 mb-5">附件:</div>
          <div class="download" v-for="(item, index) in detailsData.noticeCenterFileIdsList" :key="index">
            <span class="mr-10 text-ellipsis" :title="item.name">{{ item.name }}</span>
            <span>
              <el-link type="primary" @click="onDownload(item)">下载</el-link>
            </span>
          </div>
        </div>

      </div>
    </div>

    <!-- 上报记录 -->
    <div class="report" v-if="detailsData.type === 2">
      <el-button v-if="!detailsData.reported" type="primary" @click="onClickReport('create', {})">
        上报
      </el-button>

      <div v-else>
        <div class="reportTitle">
          <div>
            <el-icon  :size="24">
              <ChatLineSquare />
            </el-icon>
            <span class="ml-5">上报内容</span>
          </div>
          <div class="updateRecord" @click="onOpenUpdateReport">
            修改记录
          </div>
        </div>
        <div class="reportContent">
          <div class="mb-10">
            <span class="title">上报人: </span><span>{{ detailsData.reportedUserIdName }}</span>
          </div>
          <div class="mb-10">
            <span class="title">上报时间: </span><span>{{ dayjs(detailsData.updateTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </div>
          <div class="title ">内容:</div>
          <pre>{{ detailsData.reportedContent }}</pre>

          <div class="title mt-20">附件:</div>
          <div class="download" v-for="(item, index) in detailsData.reportedFileIdsList" :key="index">
            <span class="mr-10 text-ellipsis" :title="item.name">{{ item.name }}</span>
            <span>
              <el-link type="primary" @click="onDownload(item)">下载</el-link>
            </span>
          </div>
        </div>
        <el-button type="primary" class="mt-20 mb-20" @click="onClickReport('update')">修改上报</el-button>
      </div>
    </div>
  </div>

  <!-- 上报对话框 -->
  <reportForm :is-show="reportdialogVisible" :data="reportData" @onClose="onCloseReport" @onConfirm="onConfirmReport">
  </reportForm>


  <!-- 上报修改记录对话框 -->
  <updateRecordHistory :is-show="updateReportVisible" :data="updateReportData" @onClose="onCloseUpdateReport">
  </updateRecordHistory>


</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from "vue";
import { ChatLineSquare } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { getNoticeDetailById, noticeBaseReport, updateNoticeStatus, getNoticeBaseRecordById } from "@/api/notifyApi/index";
import { getCountyByCode } from "@/api/commonApi";
import dayjs from "dayjs"
import reportForm from "./components/reportForm.vue";
import updateRecordHistory from "./components/updateRecordHistory.vue";
import { CustomType } from "@/types";
import useStore from "@/store/index";
const { commonStore } = useStore();
const Route = useRoute()
const Router = useRouter()

// 详情数据
const loading = ref(false)
const detailsData: CustomType = ref({})
// 获取数据
const getDetailsData = async () => {
  loading.value = true
  let id = Number(Route.query.id)
  let { data } = await getNoticeDetailById({ noticeBaseId: id })
  if (data.code === 200) {
    detailsData.value = data.data
    //获取区级信息
    if (data.data.countyCode) {
      getCounty(data.data.countyCode)
    }
    //是否已读
    if (!data.data?.isRead) {
      updateNoticeStatus({ id })
    }
  }
  loading.value = false
}
//获取区级name
const countyName = ref("")
const getCounty = async (code: number) => {
  let { data } = await getCountyByCode({ code })
  if (data.code === 200) {
    countyName.value = data.data?.name
  }
}

// 附件下载
const onDownload = (item: any) => {
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = import.meta.env.VITE_BASE_URL + item.path;
  link.setAttribute("download", item.name);
  document.body.appendChild(link);
  link.click();
}
//返回按钮
const onGoBack = () => {
  Router.go(-1)
}


// 上报框数据
const reportdialogVisible = ref(false);
const reportData = ref({});
const onCloseReport = () => {
  reportdialogVisible.value = false;
};
const onConfirmReport = async ({ content, fileIds }: CustomType) => {
  // 参数梳理
  let obj: any = {
    incubationBaseId: detailsData.value.incubationBaseId,
    id: Number(Route.query.id),
    reportedContent: content,
    reportedFileIds: fileIds
  }

  let { data } = await noticeBaseReport(obj)
  if (data.code === 200) {
    let message = detailsData.value.reported ? "修改上报成功" : "上报成功"
    ElMessage({
      message,
      type: 'success',
    })
    onCloseReport()
    getDetailsData()
  }
};
const onClickReport = (type: string, obj?: CustomType) => {
  if (type === "create") {
    reportData.value = {}
  } else {
    reportData.value = {
      content: detailsData.value.reportedContent,
      fileIds: detailsData.value.reportedFileIds,
      fileIdsList: detailsData.value.reportedFileIdsList
    }
  }
  reportdialogVisible.value = true;
};


//修改记录框数据
const updateReportVisible = ref(false);
const updateReportData: any = ref([]);
const onCloseUpdateReport = () => {
  updateReportVisible.value = false;
};
const onOpenUpdateReport = async () => {
  let { data } = await getNoticeBaseRecordById({ noticeBaseId: detailsData.value.id })
  if (data.code === 200) {
    updateReportData.value = data.data || []
    updateReportVisible.value = true
  }
}




// 处理通知类型显示
const tagColor = computed(() => {
  let colorOption = ["#ffe1b3", "#b3f0e1"];
  return detailsData.value.type === 1 ? colorOption[0] : colorOption[1]
});
const tagTextColor = computed(() => {
  let colorOption = ["#ffaa2c", "#00cc66"];
  return detailsData.value.type === 1 ? colorOption[0] : colorOption[1]
})
const tagName = computed(() => {
  return detailsData.value.type === 1 ? "通知" : "任务"
})



onMounted(() => {
  // 获取数据
  getDetailsData()
});

onBeforeRouteLeave(() => {
  commonStore.$patch({
    twoMenuActivePath: "",
  });
});
</script>
<style scoped lang="scss">
pre {
  white-space: break-spaces;
  word-break: break-all;
  line-height: 24px;
}

.detailsPage {
  padding: 20px 60px;

  .headerTitle {
    font-size: 18px;
    font-weight: 700;
  }

  .detailHeader {
    text-align: center;
    margin-bottom: 20px;

    .title {
      font-size: 20px;
      font-weight: 700;
      padding: 16px;
    }

    .info {
      font-size: 16px;
      color: #999;
    }
  }

  .content {
    border: 1px solid $borderColor;
    font-size: 16px;

    .itemTitle {
      font-weight: 700;
      padding: 5px 10px;
      background-color: #ecf5ff;
      border-bottom: 1px solid $borderColor;
    }

    .textarea {
      min-height: 200px;
      padding: 10px 15px;
      border-bottom: 1px solid $borderColor;
      word-break: break-all;

      pre {
        font-size: 14px;
      }
    }
  }

  .report {
    margin: 30px 0 10px 0;

    .reportTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: 700;
      color: #1890ff;
      border-bottom: 1px solid #1890ff;
      .el-icon,span{
        vertical-align: middle;
      }

      .updateRecord {
        font-size: 14px;
        color: #999;

        &:hover {
          cursor: pointer;
          color: #1890ff;
        }
      }
    }

    .reportContent {
      // padding: 10px 0 20px 0;

      .title {
        font-weight: 700;
      }
    }
  }

  .download {
    display: flex;
    align-items: center;
    margin-top: 5px;
    font-size: 14px;

    span {
      &:first-child {
        max-width: 400px;
      }
    }

    .el-link {
      font-size: 12px;
    }
  }
}
</style>
