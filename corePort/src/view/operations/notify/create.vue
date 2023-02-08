<template>
  <!-- 通告管理 - 创建发布页面 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item>运营管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ name: 'notify' }">通知通告</el-breadcrumb-item>
    <el-breadcrumb-item>发布</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card mt-20">
    <template #header>
      <div class="card-header d_flex d_flex_sb d_flex_ac">
        <span>新建</span>
      </div>
    </template>
    <el-row>
      <el-col :span="14">
        <reuse-form ref="formRef" class="bpForm" @onSelectChange="onSelectChange" :formData="formData"
          :formOption="formOption" :formItemOption="selectOptions" :radios="radioOptions" :rules="rules"
          label-width="140px" labelPosition="right">
          <!-- 上报期限 -->
          <template #date>
            <el-date-picker v-model="formData.reportedTime" type="date" placeholder="请选择时间" />
          </template>
          <!-- 附件 -->
          <template #file>
            <ReuseUpload :file-list="fileLists" :multiple="true" hint-text="可上传多个文件, 单个文件大小且不超过200m"
              @on-remove="handleRemove" :beforeUpload="beforeUpload" @on-upload-success="handleUploadSuccess" />
          </template>
        </reuse-form>
        <div class="btn">
          <el-button class="button mr-20" type="primary" @click="onSubmit">发布</el-button>
          <el-button class="button" @click="onGoBack">返回</el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <el-row class="p-20">
    <!-- 表单 -->
    <el-col :span="24" class="mt-20">

    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { ArrowRight } from '@element-plus/icons-vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { CustomType } from "@/types";
import ReuseForm from "@/components/reuseForm/index.vue"
import ReuseUpload from "@/components/reuseUpload/index.vue"
import { createNotice } from "@/api/core/notify"
import { useRoute, useRouter } from "vue-router";
import useStore from "@/store";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
const { commonStore } = useStore();
let { notifyType, allCountylist } = storeToRefs(useStore().commonStore);
const Router = useRouter();
const Route = useRoute();

// 表单数据
const formRef: CustomType = ref<FormInstance>();
let formData: CustomType = ref({
  noticeObject: [],
  type: "",
  reportedTime: undefined
});
const formOption: any = reactive([
  {
    type: "input",
    props: "title",
    label: "标题",
  },
  {
    type: "textarea",
    props: "content",
    label: "内容",
    placeholder: "请输入内容",
  },
  {
    type: "radio",
    props: "type",
    label: "类型",
    value: "status",
    text: "statusName",
  },
  {
    type: "slot",
    slotName: "file",
    label: "附件",
  },
  {
    type: "select",
    props: "noticeObject",
    label: "通知对象",
    placeholder: "请选择通知对象",
    value: "status",
    optionLabel: "statusName",
    multiple: true,
    collapseTags: true,
    clearable: true,
    filterable: true
  },
  {
    type: "slot",
    slotName: "btn",
    label: "",
  },
])
const radioOptions: any = ref<CustomType>({
  type: []
});
const selectOptions = ref<CustomType>({
  noticeObject: []
});
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' },
  ],
  reportedTime: [
    { required: true, message: '请选择上报期限', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
  noticeObject: [
    { required: true, message: '请选择通知对象', trigger: 'change' },
  ],
});

// 文件数据
let fileIdss = ref<Array<number>>([]);
let fileLists = ref<Array<{ id?: number, name: string, url: string }>>([]);
// 上传前的判断
const beforeUpload = (file: any) => {
  const isLt200M = file.size / 1024 / 1024 > 200;
  if (isLt200M) {
    ElMessage.error("上传的文件大小不能超过 200MB!");
    return false;
  }
};
//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: Array<any>) => {
  if (res.code !== 200) {
    ElMessage.error('上传失败')
    return
  }
  fileIdss.value.push(res.data.id)
}
// 移除
const handleRemove = (res: any, fileList: Array<any>) => {
  //获取要删除的文件id
  let deleteId = res.response ? res.response.data.id : res.id;
  // 获取剩余的文件
  fileIdss.value = fileIdss.value.filter((item: any) => item !== deleteId);
}


//发布提交
const onSubmit = async () => {
  await formRef.value.ruleFormRef().validate().then(async () => {
    formData.value.fileIds = fileIdss.value.join(',');
    if (formData.value.reportedTime) {
      formData.value.reportedTime = dayjs(formData.value.reportedTime).format("YYYY/MM/DD HH:mm:ss")
    }
    // 处理通知对象
    let noticeObj = formData.value.noticeObject
    let array = [1, 2]
    let code: any = ""
    let bool: any = false
    if (noticeObj.length === 1 && array.indexOf(noticeObj[0]) > -1) {
      code = Number(noticeObj[0])
      bool = true
    } else {
      code = noticeObj.join(",")
    }

    let {
      id,
      title,
      content,
      type,
      reportedTime,
      fileIds,
      allBaseOrAllArea,
      noticeObject
    } = formData.value;
    let obj = {
      id,
      title,
      content,
      type,
      reportedTime,
      fileIds,
      allBaseOrAllArea: bool ? code : undefined,
      noticeObject: bool ? undefined : code,
    }


    let { data } = await createNotice(obj);
    if (data.code === 200) {
      ElMessage({
        message: '发布成功',
        type: 'success',
      })
      // setTimeout(() => {
        Router.go(-1);
      // }, 500);
    };
  }).catch(() => { })
}
//返回
const onGoBack = () => {
  Router.go(-1)
}

// 通知对象change
const onSelectChange = (val: CustomType) => {
  let value = val[val.length - 1]
  let array = [1, 2]
  if (array.indexOf(value) > -1) {
    formData.value.noticeObject = [value]
  } else {
    formData.value.noticeObject = val.filter((item: any) => !array.includes(item))
  }
}

// 监听类型切换
watch(() => formData.value.type, (newVal) => {
  let val = Number(newVal)
  if (val === 2) {
    formOption.splice(3, 0, {
      props: "reportedTime",
      type: "slot",
      slotName: "date",
      label: "上报期限",
    })
  }
  if (val === 1 && formOption[3]?.label === "上报期限") {
    formOption.splice(3, 1)
  }
  formData.value.reportedTime = undefined
})


onMounted(async () => {
  // 获取通告类型
  if (notifyType.value.length === 0) await commonStore.onGetNotifyType();
  radioOptions.value.type = notifyType.value;

  // 获取全区列表
  if (allCountylist.value.length === 0) await commonStore.onGetAllCounty();
  let array = [{ status: 1, statusName: "全部基地" }, { status: 2, statusName: "全市就业活动指导中心" }]
  selectOptions.value.noticeObject = [...array, ...allCountylist.value];
});
</script>

<style scoped lang="scss">
.btn {
  text-align: center;
}
</style>
