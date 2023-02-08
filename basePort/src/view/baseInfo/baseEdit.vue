<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header d_flex d_flex_sb d_flex_ac">
        <span>编辑</span>
      </div>
    </template>

    <!--表单 -->
    <el-row>
      <el-col :span="14">
        <reuse-form ref="formRef" class="bpForm" form-size="large" :formData="formData" :formOption="formOption"
          :radios="radioOptions" :rules="rules" label-width="140px" labelPosition="right">
          <template #area>
            <el-input v-model="formData.area" @input="onAreaIpt">
              <template #append>m²</template>
            </el-input>
          </template>
          <template #regional>
            <div class="d_flex">
              <el-select v-model="formData.provinceCode" class="mr-10" placeholder="请选择省" @change="onChangeProvince">
                <el-option v-for="item in allProvinceList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
              <el-select v-model="formData.cityCode" class="mr-10" placeholder="请选择市" @change="onChangeCity">
                <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
              <el-select v-model="formData.countyCode" class="mr-10" placeholder="请选择区" @change="onChangeCounty">
                <el-option v-for="item in countyList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </div>
          </template>
          <template #address>
            <div class="w-100 d_flex d_flex_sb">
              <el-input style="width: 80%" @change="onAddressChange" v-model.trim="formData.address" />
              <el-button style="width: 18%" type="primary" @click="onPickLocation">选取坐标</el-button>
            </div>
          </template>
          <template #file>
            <el-upload v-model:file-list="fileLists" :headers="headerOption" multiple :action="fileUploaadUrl"
              list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleUploadSuccess"
              :on-error="onError" :on-remove="handleRemove" :before-upload="beforeUpload">
              <el-icon>
                <Plus />
              </el-icon>
              <el-dialog v-model="ImgVisible">
                <img w-full :src="dialogImageUrl" style="width:100%" alt="图片" />
              </el-dialog>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传jpg/png文件, 且单个文件不超过5MB
                </div>
              </template>
            </el-upload>
          </template>
        </reuse-form>
        <div class="editBtn">
          <el-button class="button mr-20" type="primary" @click="onSubmit">提交</el-button>
          <el-button class="button" @click="onGoBack">返回</el-button>
        </div>

        <!-- 地图 -->
        <position-map v-if="dialogVisible" :positon="formData.positon" @onClose="onClose" :address="formData.address"
          @onMapConfirm="onMapConfirm">
        </position-map>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import reuseForm from "@/components/reuseForm/index.vue";
import positionMap from "@/baseUI/positionMap/index.vue";
import { CustomType } from "@/types";
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import {
  getBasePortDetail,
  updateBase,
} from "@/api/basePortApi/index";
import {
  getAllProvince, getCityByProvinceCode, getCountyByCode, getCityByCode, getCountyByCityCode,
} from "@/api/commonApi/index";
import {
  verifyRelation,
  verifyPlus,
} from "@/utils/verify";
import { getToken } from "@/utils/auth";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import axios from "axios";
import { storeToRefs } from "pinia";
import useStore from "@/store/index";
const { commonStore } = useStore();
const { baseUserInfo } = storeToRefs(commonStore);
const Router = useRouter();

// 表单数据
const loading = ref(false);
const formRef: CustomType = ref<FormInstance>();
let cityList = ref<Array<{ code: number; name: string }>>();
let countyList = ref<Array<{ code: number; name: string }>>();
const formData: CustomType = ref({});
const formOption = reactive([
  {
    type: "input",
    props: "name",
    label: "基地名称"
  },
  {
    type: "slot",
    props: "countyCode",
    label: "所在城市",
    slotName: "regional",
  },
  {
    type: "slot",
    slotName: "address",
    props: "address",
    label: "基地地址"
  },
  {
    type: "input",
    props: "operating",
    label: "运营机构"
  },
  {
    type: "input",
    props: "principal",
    label: "基地负责人"
  },
  {
    type: "input",
    props: "telephone",
    label: "负责人电话"
  },
  {
    type: "input",
    props: "contact",
    label: "基地联络人"
  },
  {
    type: "input",
    props: "contactTelephone",
    label: "联络人电话"
  },
  {
    type: "slot",
    slotName: "area",
    props: "area",
    label: "基地孵化面积"
  },
  {
    type: "input",
    props: "accommodatingNum",
    label: "可容纳经营数(户)"
  },
  {
    type: "radio",
    props: "level",
    label: "基地级别",
    value: "status",
    text: "statusName"
  },
  {
    type: "radio",
    props: "ownership",
    label: "基地权属",
    value: "status",
    text: "statusName"
  },
  {
    type: "radio",
    props: "baseType",
    label: "基地类型",
    value: "status",
    text: "statusName"
  },
  {
    type: "slot",
    slotName: "file",
    label: "照片墙上传"
  },
])
const radioOptions = ref<CustomType>({});
const validatePhone = (rule: any, value: any, callback: any) => {
  if (value) {
    if (verifyRelation.test(value)) {
      callback();
    } else {
      callback(new Error("请输入正确的手机或固话格式"));
    }
  } else {
    callback();
  }

};
const validateArea = (rule: any, value: any, callback: any) => {
  if (verifyPlus.test(value)) {
    callback();
  } else {
    callback(new Error("请输入正数"));
  }
};
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入基地名称', trigger: 'blur' },
  ],
  countyCode: [
    { required: true, message: '请选择所在城市', trigger: 'change' },
  ],
  address: [
    { required: true, message: '请输入基地地址', trigger: ['blur', 'change'] },
  ],
  operating: [
    { required: true, message: '请输入运营机构', trigger: 'blur' },
  ],
  telephone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  personphone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  contactTelephone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  area: [
    { required: true, message: '请输入基地孵化面积', trigger: 'blur' },
    { validator: validateArea, trigger: 'blur' }
  ],
  accommodatingNum: [
    { required: true, message: '请输入可容纳经营数', trigger: 'blur' },
    { pattern: /^[1-9]\d*$/, message: "数据为正整数", trigger: "blur" }
  ],
  level: [
    { required: true, message: '请输入基地等级', trigger: 'blur' },
  ],
  ownership: [
    { required: true, message: '请输入基地权属', trigger: 'blur' },
  ],
  baseType: [
    { required: true, message: '请输入基地类型', trigger: 'blur' },
  ],
});
// 面积精度处理
const onAreaIpt = (val: string) => {
  let part = val.split(".")[1];
  if (part && part.length > 2) {
    formData.value.area = val.slice(0, val.indexOf('.') + 3)
  }
};
// 根据地址获取经纬度
const onAddressChange = (val: string) => {
  if (val) {
    axios({
      method: "get",
      url: `https://restapi.amap.com/v3/geocode/geo?key=aabd87e173364ec736b3a708f8eec7ba&address=${val}`,
    }).then((res) => {
      const { data } = res;
      if (data.status === "1" && data.infocode === "10000") {
        let { location, adcode } = data.geocodes[0];
        const locationList = location.split(",");
        formData.value.longitude = locationList[0];
        formData.value.latitude = locationList[1];
        onGetCounty(Number(`${adcode}000000`))
      } else {
        ElMessage({
          showClose: true,
          message: "该基地地址暂未找到经纬度,请正确输入",
          type: "error",
        });
        formData.value.longitude = "";
        formData.value.latitude = ""
      }
    });
  }
};
// 获取用户的基地信息
const getBaseDetail = async (id: number) => {
  loading.value = true;
  const { data } = await getBasePortDetail({ id });
  if (data.code === 200) {
    formData.value = data.data;
    await onGetCityList(formData.value.provinceCode as number);
    await onGetCountyList(formData.value.cityCode as number);
    // 处理文件id
    let oldFileIds = data.data.fileIds
    fileIdss.value = typeof oldFileIds === "string" ? oldFileIds.split(",").map(item => +item) : []

    // 提取文件列表
    let oldFileList = data.data.fileList
    if (oldFileList && oldFileList.length > 0) {
      fileLists.value = oldFileList.map((item: any) => {
        item.id = item.id;
        item.name = item.name;
        item.url = import.meta.env.VITE_BASE_URL + item.path;
        return item;
      });
    }
  }
  loading.value = false;
};

// 获取所有省份
const allProvinceList = ref<Array<{ code: number; name: string }>>([])
const getAllProvinceFn = async () => {
  const { data } = await getAllProvince();
  if (data.code === 200) {
    allProvinceList.value = data.data;
  }
}

// 切换省
let onChangeProvince = async () => {
  // 清空市、区
  cityList.value = [];
  countyList.value = [];
  formData.value.countyCode = null;
  formData.value.cityCode = null;
  if (!formData.value.provinceCode) return;
  onGetCityList(formData.value.provinceCode)
}
// 切换市
const onChangeCity = async () => {
  formData.value.countyCode = null;
  countyList.value = [];
  if (!formData.value.cityCode) return;
  onGetCountyList(formData.value.cityCode);
}

// 切换区
const onChangeCounty = () => { }

// 根据省code 获取市列表
const onGetCityList = async (code: number) => {
  let { data } = await getCityByProvinceCode({ code });
  if (data.code !== 200) return
  cityList.value = data.data;
}
// 根据 市code 获取区列表
const onGetCountyList = async (code: number) => {
  let { data } = await getCountyByCityCode({ code });
  if (data.code !== 200) return
  countyList.value = data.data;
}

const onGetCounty = async (code: number) => {
  let { data } = await getCountyByCode({ code });
  if (data.code !== 200 || data.data === null) return
  formData.value.countyCode = data.data.code;
  formData.value.cityCode = data.data.cityCode;
  onGetCountyList(formData.value.cityCode)
  await onGetCity(formData.value.cityCode)
};
const onGetCity = async (code: number) => {
  let { data } = await getCityByCode({ code });
  if (data.code !== 200) return
  formData.value.provinceCode = data.data.provinceCode;
  onGetCityList(formData.value.provinceCode as number)
};


//上传数据
const ImgVisible = ref(false);
const dialogImageUrl = ref("");
const fileLists: CustomType = ref([]); //文件显示
let fileIdss = ref<Array<number>>([]);
// 上传前的判断
const beforeUpload = (file: any) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt5M = file.size / 1024 / 1024 > 5;
  if (!isJPG) {
    ElMessage.error("上传的图片文件只能是 JPG/PNG 格式!");
    return false;
  }
  if (isLt5M) {
    ElMessage.error("上传的图片文件大小不能超过 5MB!");
    return false;
  }
};
// 上传失败
const handleErrpr = (error: any) => {
  ElMessage.error('上传失败')
}
// 预览图片
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  ImgVisible.value = true;
};
//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: any) => {
  if (res.code !== 200) {
    ElMessage.error('上传失败')
    return
  }
  fileIdss.value.push(res.data.id)
};
//上传失败
const onError = () => {
  ElMessage.error('上传失败')
}
// 移除
const handleRemove = (res: any, fileList: any) => {
  //获取要删除的文件id
  let deleteId = res.response ? res.response.data.id : res.id;
  // 获取剩余的文件
  fileIdss.value = fileIdss.value.filter((item: any) => item !== deleteId);
};

// 地图操作
const dialogVisible = ref(false); // 地图显示隐藏
// 选取位置按钮
const onPickLocation = () => {
  dialogVisible.value = true;
  formRef.value.ruleFormRef().clearValidate(["address", "longitude"]);
};
//关闭
const onClose = () => {
  dialogVisible.value = false;
};
//确认
const onMapConfirm = ({ address, position, adcode }: CustomType) => {
  formData.value.address = address;
  formData.value.longitude = position[0];
  formData.value.latitude = position[1];
  onGetCounty(Number(`${adcode}000000`))
};


// 编辑提交按钮
const onSubmit = () => {
  //判断是否有经纬度
  if (!formData.value.longitude) {
    ElMessage({
      showClose: true,
      message: "该基地地址暂未找到经纬度,请正确输入",
      type: "error",
    });
    return
  }
  let imgFileIds = fileIdss.value.join(',');
  formRef.value
    .ruleFormRef()
    .validate()
    .then(async (res: CustomType) => {
      if (formData.value.id) {
        loading.value = true;
        // 编辑
        let {
          id,
          address,
          area,
          companyNum,
          latitude,
          longitude,
          level,
          name,
          principal,
          status,
          telephone,
          countyCode,
          cityCode,
          provinceCode,
          accommodatingNum,
          baseType,
          contact,
          contactTelephone,
          operating,
          ownership,
        } = formData.value;
        let { data } = await updateBase({
          id,
          address,
          area,
          companyNum,
          latitude,
          longitude,
          level,
          name,
          principal,
          status,
          telephone,
          countyCode,
          cityCode,
          provinceCode,
          accommodatingNum,
          baseType,
          contact,
          contactTelephone,
          operating,
          ownership,
          fileIds: imgFileIds ||  "",
        });
        if (data.code === 200) {
          ElMessage({
            message: "基地信息修改成功",
            type: "success",
          });
          setTimeout(() => {
            Router.push("/baseInfo");
          }, 500);
        }
        loading.value = false;
      }
    })
    .catch((err: CustomType) => { });
};
// 返回按钮
const onGoBack = () => {
  Router.go(-1)
}


//获取token
const headerOption = computed(() => {
  return {
    Authorization: getToken()
  }
});
//获取上传url
const fileUploaadUrl = computed(() => {
  return `${import.meta.env.VITE_BASE_URL}/file/upload`
})
onMounted(async () => {
  const incubationBaseId = baseUserInfo.value.incubationBaseId;
  if (incubationBaseId) {
    getBaseDetail(incubationBaseId); //获取用户的基地信息
  }
  // 获取省列表
  await getAllProvinceFn()
  // 获取基地等级列表
  if (commonStore.basesLevelList.length === 0) {
    await commonStore.getBaseLevelFn()
  }
  radioOptions.value.level = commonStore.basesLevelList

  // 获取基地权属列表
  if (commonStore.baseOwnershipList.length === 0) {
    await commonStore.getBaseOwnershipFn()
  }
  radioOptions.value.ownership = commonStore.baseOwnershipList

  // 获取基地类型列表
  if (commonStore.baseTypeList.length === 0) {
    await commonStore.getBaseTypeFn()
  }
  radioOptions.value.baseType = commonStore.baseTypeList

});

onBeforeRouteLeave(() => {
  commonStore.$patch({
    menuActivePath: ""
  })
})
</script>

<style scoped lang="scss">
.editBtn {
  text-align: center;
}
</style>
