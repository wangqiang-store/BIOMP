<template>
    <el-row v-if="baseDetails">
        <el-col :span="24">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'hatch' }">孵化基地管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ baseDetails.name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="mt-20">
            <el-descriptions :column="1">
                <template #title>
                    <div class="d_flex">
                        <h3 class="mr-10">{{ baseDetails.name }}</h3>
                        <el-tag :color="tagColor" :style="{ color: tagTextColor }">{{ levelName }}</el-tag>
                    </div>
                </template>
                <!-- 基本信息 -->
                <el-descriptions-item>
                    <el-row>
                        <el-col :span="18" :xl="18" :lg="19" :md="24" :sm="24" :xs="24">
                            <el-descriptions :column="baseInfoColumn">
                                <template #title>
                                    <h3 class="title">基本信息</h3>
                                </template>
                                <el-descriptions-item label="所在城市"><span
                                        :title="provinceName + cityName + countyName">{{ provinceName + cityName +
                                                countyName
                                        }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="基本地址"><span :title="baseDetails.address">{{
                                        baseDetails.address
                                }}</span></el-descriptions-item>
                                <el-descriptions-item label="基本权属"><span :title="baseDetails.ownershipName">{{
                                        baseDetails.ownershipName
                                }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="基本类型"><span :title="baseDetails.baseTypeName">{{
                                        baseDetails.baseTypeName
                                }}</span></el-descriptions-item>
                                <el-descriptions-item label="基地孵化面积(㎡)"><span
                                        :title="baseDetails.area ? baseDetails.area : '暂无数据'">{{ baseDetails.area ?
                                                baseDetails.area : '暂无数据'
                                        }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="可容纳经营数(户)"><span :title="baseDetails.accommodatingNum">{{
                                        baseDetails.accommodatingNum
                                }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="负责人"><span :title="baseDetails.principal">{{
                                        baseDetails.principal
                                }}</span></el-descriptions-item>
                                <el-descriptions-item label="基地状态">
                                    <el-tag>{{ baseStatusName }}</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item></el-descriptions-item>
                                <el-descriptions-item label="照片">
                                    <el-descriptions direction="vertical" :column="1">
                                        <el-descriptions-item>
                                            <template v-if="previewList.length > 0">
                                                <el-image class="mr-10" v-for="(item, index) of previewList" :key="item"
                                                    style="width: 100px; height: 100px" :preview-src-list="previewList"
                                                    :initial-index="index" :src="item" fit="cover" />
                                            </template>
                                            <el-tag v-else type="info">暂无照片</el-tag>
                                        </el-descriptions-item>
                                    </el-descriptions>
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-col>
                        <el-col :span="6" :xl="6" :lg="5" :md="24" :sm="24" :xs="24">
                            <div style="width: 100%;height: 300px">
                                <h3 class="title mb-20">基地位置</h3>
                                <reuse-map map-id="baseDetailsMap" ref="mapRef" :address="baseDetails.address"
                                    :isShowSearch="false" @on-share="changeShowShareDialog">
                                </reuse-map>
                            </div>
                        </el-col>
                    </el-row>
                </el-descriptions-item>
                <!-- 运营信息 -->
                <el-descriptions-item>
                    <el-row>
                        <el-col :span="18" :xl="18" :lg="19" :md="24" :sm="24" :xs="24">
                            <el-descriptions :column="baseInfoColumn">
                                <template #title>
                                    <h3 class="title">运营信息</h3>
                                </template>
                                <el-descriptions-item label="运营机构"><span :title="baseDetails.operating">{{
                                        baseDetails.operating
                                }}</span></el-descriptions-item>
                                <el-descriptions-item label="基地负责人"><span :title="baseDetails.principal || '暂无数据'">{{
                                        baseDetails.principal || '暂无数据'
                                }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="负责人电话"><span :title="baseDetails.telephone || '暂无数据'">{{
                                        baseDetails.telephone || '暂无数据'
                                }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="基地联络人"><span :title="baseDetails.contact || '暂无数据'">{{
                                        baseDetails.contact || '暂无数据'
                                }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item label="联络人电话"><span
                                        :title="baseDetails.contactTelephone || '暂无数据'">{{ baseDetails.contactTelephone
                                                || '暂无数据'
                                        }}</span>
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-col>
                        <el-col :span="6" :xl="6" :lg="5" :md="24" :sm="24" :xs="24"></el-col>
                    </el-row>
                </el-descriptions-item>
                <!-- 统计数据 -->
                <el-descriptions-item>
                    <el-descriptions>
                        <template #title>
                            <h3 class="title">统计数据</h3>
                        </template>
                        <el-descriptions-item label="当季新增入孵创业实体数(户)">{{ baseDetails.baseStatDto.addInTheEntity }}
                        </el-descriptions-item>
                        <el-descriptions-item label="当前实有入孵创业实体数(户)">{{ baseDetails.baseStatDto.haveInTheEntity }}
                        </el-descriptions-item>
                        <el-descriptions-item label="累计入孵创业实体数(户)">{{ baseDetails.baseStatDto.sumInTheEntity }}
                        </el-descriptions-item>
                        <el-descriptions-item label="当季新增入孵创业实体带动就业数(人次)">
                            {{ baseDetails.baseStatDto.addInTheEntityPeopleNum }}</el-descriptions-item>
                        <el-descriptions-item label="当前实有入孵创业实体带动就业数(人次)">
                            {{ baseDetails.baseStatDto.haveInTheEntityPeopleNum }}</el-descriptions-item>
                        <el-descriptions-item label="累计入孵创业实体带动就业数(人次)">
                            {{ baseDetails.baseStatDto.sumInTheEntityPeopleNum }}</el-descriptions-item>
                    </el-descriptions>
                </el-descriptions-item>
            </el-descriptions>
        </el-col>
        <!-- 数据统计图 -->
        <el-col :xs="24" :sm="24" :md="8" class="mt-20">
            <!-- 季度新增 实体数 -->
            <QuarterChart :chart-data="quarterlyData" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" class="mt-20">
            <!-- 实体类型 占比 -->
            <TypeProportionChart :chart-data="ratioData" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" class="mt-20">
            <!-- 实体状态 统计 -->
            <StatusStatChart :chart-data="statusStatData" />
        </el-col>
        <el-col :span="24">
            <el-dialog title="分享" v-model="shareVisible" width="750px">
                <Share :linkURL="linkURL" @close="changeShowShareDialog" />
            </el-dialog>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import useStore from '@/store';
import { storeToRefs } from 'pinia';
import { ArrowRight } from '@element-plus/icons-vue';
import { computed, onMounted, ref, Ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { getBaseDetails } from '@/api/core/hatchBase';
import { useWindowSize } from '@vueuse/core'
import QuarterChart from '@/baseUI/quarterChart/index.vue';
import TypeProportionChart from '@/baseUI/typeProportionChart/index.vue';
import StatusStatChart from '@/baseUI/statusStatChart/index.vue';
import ReuseMap from '@/components/reuseMap/index.vue';
import Share from "@/baseUI/share/index.vue";

import { getByProvinceCode, getByCityCode, getByCountyCode } from '@/api/enum';
import axios from 'axios';
const { commonStore } = useStore();
const ROUTE = useRoute();
let baseDetails: Ref<any> = ref(null);
let { baseLevel, baseStatus } = storeToRefs(commonStore);
let baseLevelList = ref<Array<any>>([]);
let baseStatusList = ref<Array<any>>([]);
let previewList = ref<Array<string>>([]);
// 基本信息列数
let baseInfoColumn = ref(3);
// 分享
let shareVisible = ref(false);
let linkURL = ref('');
// 所在城市
let provinceName = ref('');
let cityName = ref('');
let countyName = ref('');
// 季度数据
let quarterlyData = ref<Array<number>>([]);
// 占比 数据
let ratioData = ref<Array<{ value: number, name: string }>>([]);
// 企业状态统计
let statusStatData = ref<{ companyData: Array<number>; teamData: Array<number> }>({
    companyData: [],
    teamData: []
});

// 获取基地详情
const onGetBaseDetails = async () => {
    let id = Number(ROUTE.query.id);
    if (!id) {
        baseDetails.value = null;
        return
    }
    let { data } = await getBaseDetails({ id });
    if (data.code !== 200) return;
    baseDetails.value = data.data;
    await getProvince(baseDetails.value.provinceCode)
    await getCity(baseDetails.value.cityCode)
    await getCounty(baseDetails.value.countyCode)

    let { addQuarterDto, typeAccountedDto, entityStateDto } = baseDetails.value.baseStatDto;
    if (addQuarterDto) {
        let {
            firstQuarter,
            twoQuarter,
            threeQuarter,
            fourQuarter
        } = addQuarterDto;
        quarterlyData.value = [
            firstQuarter || 0,
            twoQuarter || 0,
            threeQuarter || 0,
            fourQuarter || 0
        ]
    }
    if (typeAccountedDto) {
        let { companyNum, teamNum } = typeAccountedDto;
        ratioData.value = [
            { value: teamNum, name: `团队` },
            { value: companyNum, name: "企业" }
        ];
    }
    if (entityStateDto) {
        let { companyCloseNum, companyIngNum, companySuccessNum, teamCloseNum, teamIngNum, teamSuccessNum } = entityStateDto;
        statusStatData.value = {
            companyData: [companyIngNum, companySuccessNum, companyCloseNum],
            teamData: [teamIngNum, teamSuccessNum, teamCloseNum]
        }
    }
};

// 分享显示隐藏
const changeShowShareDialog = ({ isShow, position }: { isShow: boolean, position?: Array<number> }) => {
    if (position) {
        let [lng, lat] = position;
        linkURL.value = `https://uri.amap.com/marker?position=${lng},${lat}`
    }
    shareVisible.value = isShow;
}

const tagColor = computed(() => {
    if (baseDetails.value !== null) {
        let colorOption = ["#e1e1ff", "#b3f0e1", "#c2ffff", "#ffe1b3", "#ffd2d2", "#f0f0f0"];
        return colorOption[`${baseDetails.value.level - 1}`]
    }
});
const tagTextColor = computed(() => {
    if (baseDetails.value !== null) {
        let colorOption = ["#9999ff", "#00cc66", "#0099ff", "#ff9900", "#ff6633", "#666666"];
        return colorOption[`${baseDetails.value.level - 1}`]
    }
})
const levelName = computed(() => {
    if (baseDetails.value !== null) {
        if (baseLevelList.value.length > 0) {
            return baseLevelList.value.filter((item: any) => {
                return item.status === baseDetails.value.level
            })[0].statusName
        }
    }
})
const baseStatusName = computed(() => {
    if (baseDetails.value !== null) {
        if (baseStatusList.value.length > 0) {
            return baseStatusList.value.filter((item: any) => {
                return item.status === baseDetails.value.status
            })[0].statusName
        }
    }
})
// 获取省
const getProvince = async (code: number) => {
    let { data } = await getByProvinceCode({ code })
    if (data.code !== 200) return
    provinceName.value = data.data.name
}
// 获取市
const getCity = async (code: number) => {
    let { data } = await getByCityCode({ code })
    if (data.code !== 200) return
    cityName.value = data.data.name
}
// 获取区
const getCounty = async (code: number) => {
    let { data } = await getByCountyCode({ code })
    if (data.code !== 200) return
    countyName.value = data.data.name
}

// 响应式布局
const { width } = useWindowSize();

watchEffect(() => {
    if (width.value > 1500) baseInfoColumn.value = 3;
    if (width.value < 1400) baseInfoColumn.value = 2;
    if (width.value < 956) baseInfoColumn.value = 1;
})

onMounted(async () => {
    await onGetBaseDetails();
    // 获取基地等级
    if (baseLevel.value.length === 0) await commonStore.onGetBaseLevel()
    baseLevelList.value = baseLevel.value;
    // 获取基地状态
    if (baseStatus.value.length === 0) await commonStore.onGetBaseStatus()
    baseStatusList.value = baseStatus.value;

    if (baseDetails.value && baseDetails.value.fileList) {
        baseDetails.value.fileList.forEach(async (item: { id: number, name: string, path: string }, index: number) => {
            let { data } = await axios.get(import.meta.env.VITE_BASE_URL + item.path, {
                responseType: "blob",
            });
            let i = (item.path as string).lastIndexOf(".");
            const type = item.path.slice(i + 1);
            let blob = new Blob([data], {
                type: `image/${type}`
            });
            let blobUrl = URL.createObjectURL(blob);
            previewList.value[index] = blobUrl
            // previewList.value[index] = import.meta.env.VITE_BASE_URL + item.path
        })
    }
})
</script>

<style scoped lang="scss">
.title {
    font-weight: bold;
    font-size: 18px;
    border-left: 5px solid #1890ff;
    padding-left: 10px;
}

:deep(td.el-descriptions__cell) {
    max-width: 200px !important;
    width: calc(100% / v-bind(baseInfoColumn));
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 20px;
}
</style>