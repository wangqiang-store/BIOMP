<template>
  <!-- 通告管理 - 详情页面 -->

  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item>运营管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ name: 'notify' }">通知通告</el-breadcrumb-item>
    <el-breadcrumb-item>查看</el-breadcrumb-item>
  </el-breadcrumb>

  <div class="detailsPage" v-loading="loading">
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

    <!-- 详情内容 -->
    <div class="content">
      <div class="itemTitle">通知内容</div>
      <div class="textarea">
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

    <!-- 按钮 -->
    <div class="mt-20 mb-20">
      <el-button v-if="detailsData.type === 2 && !detailsData.reportedContent" type="primary" class="mb-20"
        @click="onClickReport('create', {})">上报
      </el-button>
      <el-button v-if="detailsData.allBaseOrAllArea !== 1" type="primary" class="mb-20" @click="onClickForward">转发
      </el-button>
    </div>

    <!-- 上报记录 -->
    <div class="report" v-if="detailsData.reportedContent">
      <div class="reportTitle">
        <div>
          <el-icon :size="24">
            <ChatLineSquare />
          </el-icon>
          <span class="ml-5">上报内容</span>
        </div>
        <div class="updateRecord" @click="onOpenUpdateReport(true, detailsData)">
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
        <div class="title">内容:</div>
        <pre class="mb-20">{{ detailsData.reportedContent }}</pre>
        <div class="title">附件:</div>
        <div class="download" v-for="(item, index) in detailsData.reportedFileIdsList" :key="index">
          <span class="mr-10 text-ellipsis" :title="item.name">{{ item.name }}</span>
          <span>
            <el-link type="primary" @click="onDownload(item)">下载</el-link>
          </span>
        </div>
      </div>
      <el-button type="primary" class="mt-20 mb-20" @click="onClickReport('update')">修改上报</el-button>
    </div>

    <!-- 来自基地上报记录 -->
    <div class="report"
      v-if="detailsData.type === 2 && detailsData.noticeBaseList && detailsData.noticeBaseList.length > 0">
      <div class="reportTitle">
        <div>
          <el-icon  :size="24">
            <ChatLineSquare />
          </el-icon>
          <span class="ml-5">来自基地上报记录</span>
        </div>

      </div>
      <div class="reportContent">
        <!-- 表格 -->
        <ReuseTable :table-data="tableData" rowKey="id" :table-options="tableOptions" @on-handle-row="onHandleRow">
          <template #files="{ row }">
            <div class="tableFiles" @click="onDownload(item)" v-for="(item, index) in row.fileLists" :key="index">
              {{ item.name }}
            </div>
          </template>
        </ReuseTable>
      </div>
    </div>
  </div>

  <!-- 上报对话框 -->
  <reportForm :is-show="reportdialogVisible" :data="reportData" @onClose="onCloseReport" @onConfirm="onConfirmReport">
  </reportForm>


  <!-- 上报修改记录历史数据对话框 -->
  <updateRecordHistory :data="updateReportData" :is-show="updateReportVisible" @onClose="onCloseUpdateReport">
  </updateRecordHistory>



  <!-- 转发对话框 -->
  <forwardForm :is-show="forwarddialogVisible" :data="forwardData" @onClose="onCloseForward"
    @onConfirm="onConfirmForward">
  </forwardForm>


  <!-- 表格数据详情查看 -->
  <el-dialog v-model="isShowTable" title="查看详情" width="40%" class="tableDetailDialog">
    <div class="headline">
      <div>
        <el-icon :size="24">
          <ChatLineSquare />
        </el-icon>
        <span class="ml-5">{{ tableDialogData.name }}</span>
      </div>
      <div class="updateRecord" @click="onOpenUpdateReport(false, tableDialogData)">
        修改记录
      </div>
    </div>
    <div class="mb-10">
      <span class="title">上报人: </span><span>{{ tableDialogData.reportedUserIdName }}</span>
    </div>
    <div class="mb-10">
      <span class="title">上报时间: </span><span>{{ dayjs(tableDialogData.updateTime).format("YYYY-MM-DD HH:mm:ss")
      }}</span>
    </div>
    <div class="title">内容:</div>
    <pre class="mb-10">{{ tableDialogData.content || "暂无数据" }}</pre>
    <div class="title">附件:</div>
    <div class="download" v-for="(item, index) in tableDialogData.fileLists" :key="index">
      <span class="mr-10 text-ellipsis" :title="item.name">{{ item.name }}</span>
      <span>
        <el-link type="primary"  @click="onDownload(item)">下载</el-link>
      </span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowTable = false">取消</el-button>
        <el-button type="primary" @click="isShowTable = false">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from "vue";
import { ChatLineSquare, ArrowRight } from "@element-plus/icons-vue";
import ReuseTable from '@/components/reuseTable/index.vue';
import reportForm from "./components/reportForm.vue";
import forwardForm from "./components/forwardForm.vue";
import updateRecordHistory from "./components/updateRecordHistory.vue";
import dayjs from "dayjs";
import { getNoticeDetailsById, noticeAreaReport, noticeAreaForwardingFn, updateNoticeAreaStatus, getNoticeAreaRecordById, getNoticeBaseRecordById } from "@/api/core/notify";
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from "vue-router";
import { CustomType } from "@/types";
import useStore from "@/store";
import { storeToRefs } from "pinia";
const { commonStore } = useStore();
let { allCountylist } = storeToRefs(useStore().commonStore);
const Route = useRoute()
const Router = useRouter()

const isShowTable = ref(false)
const tableDialogData: any = ref({})

// 详情数据
const loading = ref(false)
const detailsData: any = ref({})
const allCountylists: any = ref([]) //全区列表
// 获取详情数据
const getDetailsData = async () => {
  loading.value = true
  let noticeAreaId = Number(Route.query.id)
  let { data } = await getNoticeDetailsById({ noticeAreaId })
  if (data.code === 200) {
    detailsData.value = data.data

    // 处理基地上报记录数据
    if (data.data.noticeBaseList) {
      tableData.value = data.data.noticeBaseList.map((item: any) => {
        item.name = item.incubationBaseName
        item.fileLists = item.reportedFileIdsList
        item.content = item.reportedContent
        return item
      })
    }


    //是否已读
    if (!data.data?.isRead) {
      updateNoticeAreaStatus({ id: noticeAreaId })
    }
  }
  setTimeout(() => {
    loading.value = false
  }, 100);
};
// 附件下载
const onDownload = (item: any) => {
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = import.meta.env.VITE_BASE_URL + item.path;
  link.setAttribute("download", item.name);
  document.body.appendChild(link);
  link.click();
}


//转发数据
const forwarddialogVisible = ref(false);
const forwardData = ref({});
const onCloseForward = () => {
  forwarddialogVisible.value = false;
};
const onConfirmForward = async (formData: any) => {
  let { content, fileIds, baseIds } = formData
  // let objIds = 
  // 参数梳理
  let obj: any = {
    noticeAreaId: Number(Route.query.id),
    content,
    fileIds,
    incubationBaseIdList: baseIds
  }
  let { data } = await noticeAreaForwardingFn(obj)
  if (data.code === 200) {
    ElMessage({
      message: "转发成功",
      type: 'success',
    })
    onCloseForward()
    getDetailsData()
  }
};
const onClickForward = async () => {
  forwarddialogVisible.value = true;
  forwardData.value = { countyCode: detailsData.value.countyCode }
}


// 上报记录数据
const reportdialogVisible = ref(false);
const reportData = ref({});
const onCloseReport = () => {
  reportdialogVisible.value = false;
};
const onConfirmReport = async ({ content, fileIds }: CustomType) => {
  // 参数梳理
  let obj: any = {
    countyCode: detailsData.value.countyCode,
    id: Number(Route.query.id),
    reportedContent: content,
    reportedFileIds: fileIds
  }

  let { data } = await noticeAreaReport(obj)
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
  reportdialogVisible.value = true;
  if (type === "create") {
    reportData.value = {}
  } else {
    reportData.value = {
      content: detailsData.value.reportedContent,
      fileIds: detailsData.value.reportedFileIds,
      fileIdsList: detailsData.value.reportedFileIdsList
    }
  }
}



//修改记录框数据
const updateReportVisible = ref(false);
const updateReportData: any = ref([]);
const onCloseUpdateReport = () => {
  updateReportVisible.value = false;
  updateReportData.value = []
};
const onOpenUpdateReport = async (isArea: boolean, row: any) => {
  if (isArea) {
    let { data } = await getNoticeAreaRecordById({ noticeAreaId: row.id })
    if (data.code === 200) {
      updateReportData.value = data.data || []
      updateReportVisible.value = true
    }
  } else {
    let { data } = await getNoticeBaseRecordById({ noticeBaseId: row.id })
    if (data.code === 200) {
      updateReportData.value = data.data || []
      updateReportVisible.value = true
    }
  }
}





//来自基地上报记录数据
let tableData = ref([]);
let tableOptions = ref([
  {
    label: "通知对象",
    type: "text",
    props: "name"
  },
  {
    label: "上报内容",
    type: "text",
    props: "content"
  },
  {
    label: "附件",
    type: "slot",
    slotName: "files",
    props: "files"
  },
  {
    label: "处理状态",
    type: "styleText",
    props: "reported",
    style(row: CustomType) {
      return {
        color: row.reported ? '#1890ff' : '#bdbdc6'
      }
    },
    formatter(row: CustomType) {
      return row.reported ? '已回复' : '未回复'
    }
  },
  {
    label: "上报时间",
    type: "text",
    props: "updateTime",
    sortable: true,
    formatter: (row: CustomType) => {
      if (row.reported) {
        return row.updateTime ? dayjs(row.updateTime).format("YYYY-MM-DD HH:mm:ss") : ''
      } else {
        return ""
      }
    }
  },
  {
    label: "操作",
    type: "handle",
    width: 120,
    btns: [
      {
        text: "查看",
        textBtn: true,
        type: "primary",
        handleType: "details"
      },
    ]
  }
]);
// 表格操作
const onHandleRow = async ({ rowData, type }: { rowData: CustomType, type: string }) => {
  switch (type) {
    case 'details':
      isShowTable.value = true
      tableDialogData.value = rowData
      break;
    default:
      break;
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



onMounted(async () => {
  // 获取全区列表
  if (allCountylist.value.length === 0) await commonStore.onGetAllCounty();
  allCountylists.value = allCountylist.value;

  // 获取详情数据
  getDetailsData()
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

    .tableFiles {
      cursor: pointer;

      &:hover {
        color: #1890ff;
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

:deep(.el-table__header) {
  height: 60px;

  th {
    background-color: #fafafa !important;

  }
}
</style>
<style lang="scss">
pre {
  white-space: break-spaces;
  word-break: break-all;
}

.tableDetailDialog {
  .headline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
    color: #5a5a5a;
    border-bottom: 1px solid #1890ff;
    .el-icon,span{
        vertical-align: middle;
      }

    .el-icon {
      color: #1890ff;
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

  .title {
    font-weight: 700;
  }
}
</style>
