<template>
  <el-dialog v-model="isShowDialog" title="通知转发" width="40%" class="reportForm" :before-close="onClose">
    <reuse-form ref="formRef" class="formClass" :formData="formData" :formOption="formOption" :rules="rules"
      labelWidth="80px" labelPosition="right">
      <template #baseIds>
        <el-select v-model="formData.baseIds" placeholder="请选择通知基地" multiple collapse-tags filterable
          @change="onSelectChange">
          <el-option v-for="item in forwardList" :key="item.id" :label="item.name" :value="item.id"
            :disabled="item.disabled" />
        </el-select>
      </template>
      <!-- 附件 -->
      <template #file>
        <ReuseUpload :file-list="fileLists" :multiple="true" hint-text="可上传多个文件, 单个文件大小且不超过200m"
          @on-remove="handleRemove" :beforeUpload="beforeUpload" @on-upload-success="handleUploadSuccess" />
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
import { onMounted, reactive, ref, computed, watch, nextTick } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { getToken } from "@/utils/auth";
import { CustomType } from "@/types";
import { getNoticeAreaForwarding, getRunIncubationBaseByCode } from "@/api/core/notify";
import { useRoute } from "vue-router";
import { tr } from "element-plus/es/locale";
const Route = useRoute()

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
    data: { id: number; content: string; fileIds: string }
  ): void;
}>();

// 表单数据
const isShowDialog = ref(false)
const formRef: CustomType = ref<FormInstance>();
let formData: CustomType = ref({});
const formOption = reactive([
  { type: "slot", slotName: "baseIds", props: "baseIds", label: "通知基地" },
  { type: "textarea", props: "content", label: "内容", placeholder: "请输入内容" },
  { type: "slot", slotName: "file", label: "附件" },
]);
const rules = reactive<FormRules>({
  baseIds: [{ required: true, message: "请选择通知基地", trigger: "blur" },],
});


//转发对象列表
const forwardList: any = ref([])
const alreadyForwardList: any = ref([])
const getForwardListFn = async (countyCode: number) => {
  let { data } = await getRunIncubationBaseByCode({ countyCode })
  if (data.code === 200) {
    forwardList.value = data.data
  }
}
// 转发对象change
const onSelectChange = (val: Array<any>) => {
  let value = val[val.length - 1]
  if (value === 100000) {
    let ids = forwardList.value.map((item: any) => item.id)
    formData.value.baseIds = [100000, ...ids]
  } else {
    formData.value.baseIds = val.filter((item) => item !== 100000)
  }
}



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

//确认按钮
const onConfirm = () => {
  formRef.value
    .ruleFormRef()
    .validate()
    .then((res: any) => {
      formData.value.fileIds = fileIdss.value.join(",")
      // 通知基地id处理
      let baseIds = formData.value.baseIds.filter((item: any) => item !== 100000 && !alreadyForwardList.value.includes(item))
      if (baseIds && baseIds.length === 0) {
        ElMessage.warning("基地已经全部转发, 无需再转发");
        emits("onClose");
        return
      }
      emits("onConfirm", { ...formData.value, baseIds });
    })
    .catch(() => { });
};
// 取消按钮
const onClose = () => {
  emits("onClose");
};

const isDisable = computed(() => {
  return forwardList.every((item: any) => item.disabled)
})



watch(
  () => props.isShow,
  (newVal) => {
    isShowDialog.value = newVal
    newVal && formRef.value?.ruleFormRef().resetFields();
  }
);

watch(
  () => props.data,
  async (newVal) => {
    //获取区级的未关闭的基地列表(即转发对象)
    await getForwardListFn(newVal.countyCode)

    //获取区级通知已转发的基地列表
    let noticeAreaId = Number(Route.query.id)
    let { data } = await getNoticeAreaForwarding({ noticeAreaId })
    if (data.code === 200) {
      alreadyForwardList.value = data.data.map((item: any) => {
        return item.id
      })
    }



    // 添加选项 - 全部
    if (forwardList.value.length > 0) {
      // 已经全部转发
      if (forwardList.value.length === alreadyForwardList.value.length) {
        let newArray = [{ id: 100000, name: "全部", disabled: true }, ...forwardList.value]
        forwardList.value = newArray.map((item: any) => {
          item.disabled = true
          return item
        })
        alreadyForwardList.value.push(100000)
      } else {
        let newArray = forwardList.value.map((item: any) => {
          item.disabled = alreadyForwardList.value.includes(item.id)
          return item
        })
        forwardList.value = [{ id: 100000, name: "全部", disabled: false }, ...newArray]
      }
    }

    formData.value = { ...newVal, baseIds: alreadyForwardList.value };
    fileIdss.value = newVal.fileIds ? newVal.fileIds.split(",").map((item: any) => +item) : []
    fileLists.value = newVal.fileIdsList || []
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
