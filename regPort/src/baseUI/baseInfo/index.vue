<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header d_flex d_flex_sb d_flex_ac">
                <span>{{ formData.id ? '编辑' : '新建' }}</span>
            </div>
        </template>
        <el-row>
            <el-col :span="14">
                <reuse-form ref="formRef" class="bpForm" :formData="formData" :formOption="formOption"
                    :radios="radioOptions" :rules="rules" label-width="140px" labelPosition="right">
                    <template #area>
                        <el-input v-model="formData.area" @input="onAreaIpt">
                            <template #append>m²</template>
                        </el-input>
                    </template>
                    <template #regional>
                        <div class="d_flex">
                            <el-select v-model="formData.provinceCode" class="mr-10" placeholder="请选择省"
                                @change="onChangeProvince">
                                <el-option v-for="item in allProvinceList" :key="item.code" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                            <el-select v-model="formData.cityCode" class="mr-10" placeholder="请选择市"
                                @change="onChangeCity">
                                <el-option v-for="item in cityList" :key="item.code" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                            <el-select v-model="formData.countyCode" class="mr-10" placeholder="请选择区"
                                @change="onChangeCounty">
                                <el-option v-for="item in countyList" :key="item.code" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </div>
                    </template>
                    <template #address>
                        <div class="w-100 d_flex d_flex_sb">
                            <el-input style="width: 80%" @change="onAddressChange" v-model.trim="formData.address" />
                            <el-button style="width: 18%" type="primary" @click="onPickLocation">选取坐标</el-button>
                        </div>
                    </template>
                    <template #lng>
                        <div class="w-100 d_flex d_flex_sb">
                            <el-input style="width: 49%" placeholder="经度" v-model="formData.longitude" />
                            <el-input style="width: 49%" placeholder="纬度" v-model="formData.latitude" />
                        </div>

                    </template>
                    <template #file>
                        <ReuseUpload :file-list="fileList" :multiple="true" list-type="picture-card"
                            hint-text="只能上传jpg/png文件,且单个文件不超过5MB" @on-remove="handleRemove" :beforeUpload="beforeUpload"
                            @on-upload-success="handleUploadSuccess" />
                    </template>
                </reuse-form>

                <div class="btn">
                    <el-button class="button mr-20" type="primary" @click="onSubmit">提交</el-button>
                    <el-button class="button" @click="onGoBack">返回</el-button>
                </div>

                <!-- 地图 -->
                <position-map v-if="dialogVisible" :positon="position" @onClose="onClose" :address="formData.address"
                    @onMapConfirm="onMapConfirm">
                </position-map>
            </el-col>
        </el-row>
    </el-card>
</template>
   
<script setup lang="ts">
import reuseForm from "@/components/reuseForm/index.vue"
import ReuseUpload from '@/components/reuseUpload/index.vue'
import { ref, reactive, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { verifyRelation, verifyPositive } from "@/utils/verify"
import { CustomType } from "@/types";
import { createBase, updateBase } from '@/api/core/hatchBase';
import positionMap from "@/baseUI/positionMap/index.vue";
import { baseData } from '@/api/type';
import useStore from '@/store';
import axios from "axios";
import { storeToRefs } from "pinia";
import { getByCity, getByCounty, getByCountyCode, getByCityCode } from "@/api/enum";
const ROUTER = useRouter();
const { commonStore } = useStore();
let { baseLevel, baseOwnership, baseType, allProvinceList } = storeToRefs(commonStore)

interface Props {
    formData: baseData, // 表单数据
}
const props = withDefaults(defineProps<Props>(), {
    formData: () => {
        return {}
    }
})

let { formData } = toRefs(props);

let fileIds = ref<Array<number>>([]);
let cityList = ref<Array<{ code: number; name: string }>>();
let countyList = ref<Array<{ code: number; name: string }>>();
let position = ref<null | Array<number>>(null);
const formRef: CustomType = ref<FormInstance>();
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
    if (!value) {
        callback()
    } else {
        if (verifyRelation.test(value)) {
            callback()
        } else {
            callback(new Error("请输入正确的手机或固话格式"))
        }
    }
}
const validateArea = (rule: any, value: any, callback: any) => {
    if (verifyPositive.test(value)) {
        callback()
    } else {
        callback(new Error("请输入正数,最多精确2位小数点"))
    }
}
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
        { required: true, message: '请选择基地等级', trigger: 'blur' },
    ],
    ownership: [
        { required: true, message: '请选择基地权属', trigger: 'blur' },
    ],
    baseType: [
        { required: true, message: '请选择基地类型', trigger: 'blur' },
    ],
});

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
const onChangeCounty = () => {
}

const onAreaIpt = (val: string) => {
    let part = val.split(".")[1]
    if (part && part.length > 2) {
        formData.value.area = val.slice(0, val.indexOf('.') + 3)
    }
}
const onAddressChange = (val: string) => {
    if (val) {
        axios({
            method: "get",
            url: `https://restapi.amap.com/v3/geocode/geo?key=aabd87e173364ec736b3a708f8eec7ba&address=${val}`
        }).then((res) => {
            const { data } = res
            if (data.status === "1" && data.infocode === "10000") {
                let { location, adcode } = data.geocodes[0];
                const locationList = location.split(",");
                formData.value.longitude = locationList[0];
                formData.value.latitude = locationList[1];
                onGetCounty(Number(`${adcode}000000`))
            } else {
                ElMessage({
                    showClose: true,
                    message: '该地址暂未找到经纬度,请正确输入',
                    type: 'error',
                })
            }
        })
    }
}

//上传数据
let fileList = ref<Array<{ id?: number, name: string, url: string }>>([]);
// 上传前的判断
const beforeUpload = (file: any) => {
    const isJPG =
        file.type === "image/jpeg" || file.type === "image/png";
    const isLt5M = file.size / 1024 / 1024 > 5;
    if (!isJPG) {
        ElMessage.error("上传的图片文件只能是 JPG/PNG 格式!");
        return false;
    }
    if (isLt5M) {
        ElMessage.error("上传的图片文件大小不能超过 5MB!");
        return false;
    }
}
//上传成功
const handleUploadSuccess = (res: any, file: any, fileList: Array<any> = []) => {
    if (res.code !== 200) {
        ElMessage({
            message: "上传失败",
            type: "error"
        })
        return
    }
    let result: Array<number> = [];
    fileList.forEach(item => {
        if (item.status === 'success') {
            if (item.response) {
                result.push(item.response.data.id);
            } else {
                if (props.formData.fileList && props.formData.fileList.length > 0) {
                    props.formData.fileList.forEach((val: { id: number, path: string }) => {
                        if (item.url === import.meta.env.VITE_BASE_URL + val.path) {
                            result.push(val.id)
                        }
                    })
                }
            }
        }
    })
    fileIds.value = result;
}
// 移除
const handleRemove = (res: any, fileList: Array<any>) => {
    let result: Array<number> = [];
    fileList.forEach(item => {
        if (item.status === 'success') {
            if (item.response) {
                result.push(item.response.data.id)
            } else {
                if (props.formData.fileList && props.formData.fileList.length > 0) {
                    props.formData.fileList.forEach((val: { id: number, path: string }) => {
                        if (item.url === import.meta.env.VITE_BASE_URL + val.path) {
                            result.push(val.id)
                        }
                    })
                }
            }
        }
    })
    fileIds.value = result;
}

const onGetCityList = async (code: number) => {
    let { data } = await getByCity({ code });
    if (data.code !== 200) return;
    cityList.value = data.data;
}

const onGetCountyList = async (code: number) => {
    let { data } = await getByCounty({ code });
    if (data.code !== 200) return
    countyList.value = data.data;
}

const onGetCounty = async (code: number) => {
    let { data } = await getByCountyCode({ code });
    if (data.code !== 200 || data.data === null) return
    formData.value.countyCode = data.data.code;
    formData.value.cityCode = data.data.cityCode;
    onGetCountyList(formData.value.cityCode as number);
    await onGetCity(formData.value.cityCode)
};
const onGetCity = async (code: number) => {
    let { data } = await getByCityCode({ code });
    if (data.code !== 200) return
    formData.value.provinceCode = data.data.provinceCode;
    onGetCityList(formData.value.provinceCode as number)
};

// 提交按钮
const onSubmit = () => {
    formRef.value.ruleFormRef().validate().then(async (res: CustomType) => {
        if (res) {
            formData.value.fileIds = fileIds.value.length > 0 ? fileIds.value.join(',') : '';
            if (formData.value.id) {
                // 编辑
                let { id,
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
                    baseType,
                    accommodatingNum,
                    countyCode,
                    cityCode,
                    provinceCode,
                    contact,
                    contactTelephone,
                    operating,
                    ownership,
                    fileIds
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
                    baseType,
                    accommodatingNum,
                    countyCode,
                    cityCode,
                    provinceCode,
                    contact,
                    contactTelephone,
                    operating,
                    ownership,
                    fileIds
                });
                if (data.code !== 200) return;
                ROUTER.push({ name: "hatch" });
                ElMessage({
                    message: '基地信息修改成功',
                    type: 'success',
                })
            } else {
                // 添加
                let { data } = await createBase(formData.value);
                if (data.code !== 200) return;
                ROUTER.push({ name: "hatch" });
                ElMessage({
                    message: '基地数据新建成功',
                    type: 'success',
                })
            }
        }
    }).catch((err: CustomType) => { })
}

// 返回按钮
const onGoBack = () => {
    ROUTER.go(-1)
}

// 地图操作
const dialogVisible = ref(false) // 地图显示隐藏
// 选取位置按钮
const onPickLocation = () => {
    dialogVisible.value = true
}
//关闭
const onClose = () => {
    dialogVisible.value = false
}
//确认
const onMapConfirm = ({ address, position, adcode }: CustomType) => {
    formData.value.address = address;
    formData.value.longitude = position[0];
    formData.value.latitude = position[1];
    onGetCounty(Number(`${adcode}000000`))
}

// 初始化数据
let initData = async () => {
    if (formData.value.longitude && formData.value.latitude) position.value = [formData.value.longitude, formData.value.latitude];
    await onGetCityList(formData.value.provinceCode as number || 440000000000);
    await onGetCountyList(formData.value.cityCode as number || 440100000000);
    if (formData.value.fileList !== null && formData.value.fileList !== undefined) {
        formData.value.fileList.forEach((item: { id: number, name: string, path: string }, index: number) => {
            fileList.value[index] = {
                name: item.name,
                url: import.meta.env.VITE_BASE_URL + item.path
            }
            fileIds.value.push(item.id)
        })
    }
}

onMounted(async () => {
    initData()
    // 获取省列表
    if (allProvinceList.value.length === 0) await commonStore.onGetAllProvince()
    // 获取基地等级 
    if (baseLevel.value.length === 0) await commonStore.onGetBaseLevel()
    radioOptions.value.level = baseLevel.value;
    // 获取基地权属
    if (baseOwnership.value.length === 0) await commonStore.onGetBaseOwnership()
    radioOptions.value.ownership = baseOwnership.value;
    // 获取基地等级 
    if (baseType.value.length === 0) await commonStore.onGetBaseType()
    radioOptions.value.baseType = baseType.value;
});
</script>
   
<style scoped lang="scss">
.btn {
    text-align: center;
}
</style>