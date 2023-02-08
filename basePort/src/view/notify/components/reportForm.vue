<template>
  <el-dialog v-model="isShowDialog" title="上报回复" width="40%" class="reportForm" :before-close="onClose">
    <reuse-form ref="formRef" class="formClass" :formData="formData" :formOption="formOption" :rules="rules"
      labelWidth="50px" labelPosition="left">
      <!-- 附件 -->
      <template #file>
        <el-upload v-model:file-list="fileLists" multiple :action="fileUploaadUrl" :headers="headerOption"
          :on-success="handleUploadSuccess" :on-remove="handleRemove" :before-upload="beforeUpload">
          <el-button type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              可上传多个文件, 且单个文件不超过200MB
            </div>
          </template>
        </el-upload>
      </template>
    </reuse-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { getToken } from "@/utils/auth";
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
  (
    e: "onConfirm",
    data: { content: string; fileIds: string }
  ): void;
}>();

// 表单数据
const isShowDialog = ref(false)
const formRef: CustomType = ref<FormInstance>();
let formData: CustomType = ref({});
const formOption = reactive([
  { type: "textarea", props: "content", label: "内容" },
  { type: "slot", slotName: "file", label: "附件" },
]);
const rules = reactive<FormRules>({
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
});

//文件数据
let fileIdss: any = ref<Array<number>>([]); //文件ids
const fileLists: CustomType = ref([]); //文件列表
// 上传前的判断
const beforeUpload = (file: any, type: string) => {
  const isLt200M = file.size / 1024 / 1024 > 200;
  if (isLt200M) {
    ElMessage.error("上传的附件文件大小不能超过 200MB!");
    return false;
  }
};
//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: any) => {
  if (res.code !== 200) {
    ElMessage.error("上传失败");
    return;
  }
  fileIdss.value.push(res.data.id);
};
// 移除
const handleRemove = (res: any, fileList: any) => {
  //获取要删除的文件id
  let deleteId = res.response ? res.response.data.id : res.id;
  // 获取剩余的文件
  fileIdss.value = fileIdss.value.filter((item: any) => item !== deleteId);
};
const fileUploaadUrl = computed(() => {
  return `${import.meta.env.VITE_BASE_URL}/file/upload`;
});
const headerOption = computed(() => {
  return {
    Authorization: getToken(),
  };
});

//确认按钮
const onConfirm = () => {
  formRef.value
    .ruleFormRef()
    .validate()
    .then((res: any) => {
      let fileIds = fileIdss.value.join(",")
      emits("onConfirm", { ...formData.value, fileIds });
    })
    .catch(() => { });
};
// 取消按钮
const onClose = () => {
  emits("onClose");
};

watch(
  () => props.isShow,
  (newVal) => {
    isShowDialog.value = newVal
    newVal && formRef.value?.ruleFormRef().resetFields();
  }
);

watch(
  () => props.data,
  (newVal) => {
    formData.value = JSON.parse(JSON.stringify(newVal));
    fileIdss.value = newVal.fileIds ? newVal.fileIds.split(",").map((item: any) => +item) : []
    fileLists.value = newVal.fileIdsList ? JSON.parse(JSON.stringify(newVal.fileIdsList)) : []
  },
  { deep: true }
);

onMounted(() => { });
</script>
<style scoped lang="scss">
.listPage {
  padding: 20px 60px;

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
    color: #999999;
    padding: 10px;
    border-bottom: 1px solid $borderColor;

    p {
      line-height: 20px;
    }

    .title {
      font-weight: 700;
      color: #333;
    }
  }
}
</style>
<style lang="scss">
.reportForm {
  padding-right: 20px;
  max-width: 800px;
  min-width: 500px;
}
</style>
