<template>
  <!-- 通告管理 - 表格页面 -->

  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item>运营管理</el-breadcrumb-item>
    <el-breadcrumb-item>通告管理</el-breadcrumb-item>
  </el-breadcrumb>

  <el-row class="p-20">
    <!-- 搜索 -->
    <el-col :span="24" class="d_flex d_flex_ac mt-20">
      <el-input style="width: 200px" class="mr-10" v-model.trim="content" placeholder="请输入标题"></el-input>
      <el-select class="mr-10" v-model="searchType" clearable placeholder="请选择类型">
        <el-option v-for="item in typeList" :key="item.status" :label="item.statusName" :value="item.status" />
      </el-select>
      <el-button type="primary" @click="onSearch">
        <el-icon class="mr-5">
          <Search />
        </el-icon>
        查询
      </el-button>
    </el-col>

    <!-- 表格 -->
    <el-col :span="24" class="mt-20" v-loading="tableLoading">
      <ReuseTable :table-data="tableData" :table-options="tableOptions" @on-handle-row="onHandleRow" />
      <ReusePagination :total="tableTotal" :current-page="pagingParams.page" :page-size="pagingParams.limit"
        :background="true" @size-change="onSizeChange" @current-change="onCurrentChange" />
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ArrowRight } from '@element-plus/icons-vue';
import ReuseTable from "@/components/reuseTable/index.vue";
import { CustomType } from "@/types";
import ReusePagination from "@/components/reusePagination/index.vue";
import { useRoute, useRouter } from "vue-router";
import useStore from "@/store";
import dayjs from "dayjs";
import { getNoticeByPage } from "@/api/core/notify";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const { commonStore } = useStore();
let { notifyType } = storeToRefs(commonStore);
const Router = useRouter();
const Route = useRoute();

// 搜索以及分页参数
let content = ref(); //标题内容
let searchType = ref(); //通知类型
let typeList: any = ref([]);
let pagingParams: CustomType = reactive({
  limit: 10,
  page: 1,
  content: "",
  type: undefined,
});
// 切换个数
const onSizeChange = (size: number) => {
  pagingParams.limit = size;
  onGetPagingData();
};
// 切换页数
const onCurrentChange = (page: number) => {
  pagingParams.page = page;
  onGetPagingData();
};
// 搜索
const onSearch = () => {
  pagingParams.page = 1;
  pagingParams.content = content.value;
  pagingParams.type = searchType.value;
  onGetPagingData();
};
// 分页获取表格数据
const onGetPagingData = async () => {
  tableLoading.value = true;
  let { data } = await getNoticeByPage(pagingParams);

  if (data.code !== 200) {
    tableLoading.value = false;
    return;
  }
  tableData.value = data.data?.records;
  tableTotal.value = data.data?.total;
  tableLoading.value = false;
};

//表格数据
let tableLoading = ref(false);
let tableTotal = ref(3);
let tableData: CustomType = ref([]);
let tableOptions = ref([
  {
    label: "序号",
    type: "text",
    formatter: (row: CustomType, column: CustomType, cellValue: CustomType, index: number) => {
      return index + 1
    }
  },
  {
    label: "标题",
    type: "text",
    props: "title",
  },
  {
    label: "通知内容",
    type: "text",
    props: "content",
  },
  {
    label: "类型",
    type: "tag",
    props: "type",
    color(row: CustomType) {
      let colorOption = ["#ffe1b3", "#b3f0e1"];
      return colorOption[`${row.type - 1}`];
    },
    textColor(row: CustomType) {
      let colorOption = ["#ffaa2c", "#00cc66"];
      return colorOption[`${row.type - 1}`];
    },
    formatter(row: CustomType) {
      if (typeList.value.length > 0) {
        return typeList.value?.filter((item: any) => {
          return item.status === row.type;
        })[0]?.statusName;
      }
    },
  },
  {
    label: "基地上报率",
    type: "text",
    props: "reportedRate",
    sortable: true,
    formatter: (row: CustomType) => {
      if (row.type === 1) {
        return "-"
      } else {
        return row.reportedRate || "0%"
      }
    },
  },
  {
    label: "上报期限",
    type: "text",
    props: "reportedTime",
    sortable: true,
    formatter: (row: CustomType) => {
      if (row.type === 1) {
        return "-"
      } else {
        return dayjs(row.reportedTime).format("YYYY-MM-DD")
      }
    },
  },
  {
    label: "已通知数",
    type: "text",
    props: "noticeNumBase",
    formatter: (row: CustomType) => {
      return `基地: ${row.noticeNumBase}`;
    },
  },
  {
    label: "发布时间",
    type: "text",
    props: "createTime",
    sortable: true,
    formatter: (row: CustomType) => {
      return dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss");
    },
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
        handleType: "details",
      },
    ],
  },
]);
// 表格操作
const onHandleRow = async ({
  rowData,
  type,
}: {
  rowData: CustomType<CustomType>;
  type: string;
}) => {
  switch (type) {
    case "details":
      Router.push({
        name: "notifyDetails",
        query: {
          id: rowData.id
        },
      });
      break;
    default:
      break;
  }
};

onMounted(async () => {
  //获取通告类型
  if (notifyType.value.length === 0) await commonStore.onGetNotifyType();
  typeList.value = notifyType.value;

  onGetPagingData();
});
</script>

<style scoped lang="scss">

</style>
