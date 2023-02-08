<template>
  <el-dialog v-model="isShowDialog" title="修改记录" width="40%" class="updateReportTable" :before-close="onClose">
    <ReuseTable :isborder="true" class="updateTable" max-height="500" :table-data="tableData"
      :table-options="tableOptions" empty-text="暂无修改记录">
      <template #content="{ row }">
        <pre v-if="row.updateField === 1" :title="row.updateContent">{{ row.updateContent }}</pre>
        <div v-else>
          <div class="tableFiles" v-for="(item, index) in row.updateFileIdsList" :key="index" @click="onDownload(item)">
            {{ item.name }}
          </div>
        </div>
      </template>
    </ReuseTable>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import { CustomType } from "@/types";

interface Props {
  isShow: boolean;
  data?: CustomType;
}

const props = withDefaults(defineProps<Props>(), {
  isShow: true,
  data: {},
});

const emits = defineEmits<{
  (e: "onClose"): void;
}>();

// 表单数据
const isShowDialog = ref(false)
let tableData: CustomType = ref([]);
let tableOptions = ref([
  {
    label: "序号",
    type: "index",
    width: "80"
  },
  {
    label: "修改字段",
    type: "text",
    width: "90",
    props: "updateField	",
    formatter: (row: CustomType) => {
      return row.updateField === 1 ? "内容" : "附件"
    }
  },
  {
    label: "修改内容",
    type: "slot",
    slotName: "content",
  },
  {
    label: "修订者",
    type: "text",
    props: "userIdName",
    width: "100",
  },
  {
    label: "修改时间",
    type: "text",
    props: "updateTime",
    width: "160",
    formatter: (row: CustomType) => {
      return dayjs(row.updateTime).format("YYYY-MM-DD HH:mm:ss")
    }
  },
]);
// 取消按钮
const onClose = () => {
  emits("onClose");
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

watch(
  () => props.isShow,
  (newVal) => {
    isShowDialog.value = newVal
  }
);

watch(
  () => props.data,
  (newVal) => {
    let ddata = newVal.map((item: any) => {
      if (item.updateField === 2) {
        item.updateFileIdsList = item.updateFileIdsList || []
      }
      return item
    })
    tableData.value = JSON.parse(JSON.stringify(ddata));
  },
  { deep: true }
);

onMounted(() => { });
</script>
<style scoped lang="scss">
pre {
  white-space: break-spaces;
  word-break: break-all;
  line-height: 24px;
  text-align: left;
}

.tableFiles {
  cursor: pointer;
  text-align: left;

  &:hover {
    color: #1890ff;
  }
}

.updateTable {
  :deep(.el-table__inner-wrapper::before) {
    width: 0;
  }

  :deep(.el-table__empty-block) {
    border-bottom: 1px solid #ebeef5 !important;
  }

  :deep(.el-table__header) {
    th {
      border-right: 1px solid #ebeef5 !important;
    }
  }
}
</style>
<style lang="scss">
.updateReportTable {
  padding-right: 20px;
  max-width: 800px;
  min-width: 700px;
}
</style>
