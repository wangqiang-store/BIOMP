<template>
  <div class="titleHeader">
    基地信息
    <!-- 编辑按钮 -->
    <el-button class="editBtn" type="primary" @click="onEdit">编辑</el-button>
  </div>
  <el-row v-if="baseDetails">
    <el-col :span="24" class="mt-20">
      <el-descriptions :column="1">
        <template #title>
          <div class="titleName">
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
                <el-descriptions-item label="所在城市"><span :title="provinceName + cityName + countyName">{{ provinceName +
                    cityName + countyName
                }}</span></el-descriptions-item>
                <el-descriptions-item label="基地地址"><span :title="baseDetails.address">{{ baseDetails.address }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="基地权属"><span :title="baseDetails.ownershipName">{{ baseDetails.ownershipName
                }}</span></el-descriptions-item>
                <el-descriptions-item label="基地类型"><span :title="baseDetails.baseTypeName">{{ baseDetails.baseTypeName
                }}</span></el-descriptions-item>
                <el-descriptions-item label="基地孵化面积(㎡)"><span :title="baseDetails.area ? baseDetails.area : '暂无数据'">{{
                    baseDetails.area ? baseDetails.area : '暂无数据'
                }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="可容纳经营数(户)"><span :title="baseDetails.accommodatingNum">{{
                    baseDetails.accommodatingNum
                }}</span></el-descriptions-item>
                <el-descriptions-item label="基地状态">
                  <el-tag>{{ baseStatusName }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
                <el-descriptions-item label="照片墙">
                  <template v-if="previewList.length > 0">
                    <div>
                      <el-image class="mr-10" v-for="(item, index) of previewList" :key="item"
                        style="width: 100px; height: 100px" :preview-src-list="previewList" :src="item"
                        :initial-index="index" fit="cover" />
                    </div>
                  </template>
                  <el-tag v-else type="info">暂无照片</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="6" :xl="6" :lg="5" :md="24" :sm="24" :xs="24">
              <div style="width: 100%;height: 300px">
                <h3 class="title mb-20">基地位置</h3>
                <reuse-map map-id="baseDetailsMap" v-if="baseDetails.address" ref="mapRef"
                  :address="baseDetails.address" :banAddress="baseDetails.address" :isShowSearch="false"
                  @on-share="changeShowShareDialog">
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
                <el-descriptions-item label="运营机构"><span :title="baseDetails.operating">{{ baseDetails.operating
                }}</span></el-descriptions-item>
                <el-descriptions-item label="基地负责人"><span :title="baseDetails.principal">{{ baseDetails.principal
                }}</span></el-descriptions-item>
                <el-descriptions-item label="负责人电话"><span :title="baseDetails.telephone">{{ baseDetails.telephone
                }}</span></el-descriptions-item>
                <el-descriptions-item label="基地联络人"><span :title="baseDetails.contact">{{ baseDetails.contact }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="联络人电话"><span :title="baseDetails.contactTelephone">{{
                    baseDetails.contactTelephone
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
            <el-descriptions-item label="当季新增入孵创业实体数(户)">{{ statData.addInTheEntity }}</el-descriptions-item>
            <el-descriptions-item label="当前实有入孵创业实体数(户)">{{ statData.haveInTheEntity }}</el-descriptions-item>
            <el-descriptions-item label="累计入孵创业实体数(户)">{{ statData.sumInTheEntity }}</el-descriptions-item>
            <el-descriptions-item label="当季新增入孵创业实体带动就业数(人次)">{{ statData.addInTheEntityPeopleNum }}
            </el-descriptions-item>
            <el-descriptions-item label="当前实有入孵创业实体带动就业数(人次)">{{ statData.haveInTheEntityPeopleNum }}
            </el-descriptions-item>
            <el-descriptions-item label="累计入孵创业实体带动就业数(人次)">{{ statData.sumInTheEntityPeopleNum }}
            </el-descriptions-item>
          </el-descriptions>
        </el-descriptions-item>
      </el-descriptions>
    </el-col>
    <!-- 数据统计图 -->
    <el-col :span="8" :lg="8" :md="24" :sm="24" :xs="24" class="mt-20">
      <!-- 季度新增 实体数 -->
      <QuarterChart :chart-data="quarterlyData" />
    </el-col>
    <el-col :span="8" :lg="8" :md="24" :sm="24" :xs="24" class="mt-20">
      <!-- 实体类型 占比 -->
      <TypeProportionChart :chart-data="ratioData" text="在孵实体类型占比" />
    </el-col>
    <el-col :span="8" :lg="8" :md="24" :sm="24" :xs="24" class="mt-20">
      <!-- 状态数据  -->
      <StatusStatChart :chart-data="statusStatData" text="实体状态统计" />
    </el-col>
    <el-col :span="24">
      <el-dialog title="分享" v-model="shareVisible" width="750px">
        <Share :linkURL="linkURL" @close="changeShowShareDialog" />
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, Ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBasePortDetail } from "@/api/basePortApi/index";
import { getCityByCode, getProvinceByCode, getCountyByCode } from "@/api/commonApi";
import TypeProportionChart from '@/baseUI/typeProportionChart/index.vue';
import QuarterChart from "@/baseUI/quarterChart/index.vue";
import StatusStatChart from '@/baseUI/statusStatChart/index.vue'
import ReuseMap from '@/components/reuseMap/index.vue';
import Share from "@/baseUI/share/index.vue";
import { useWindowSize } from '@vueuse/core';

import { storeToRefs } from 'pinia';
import useStore from '@/store';
import axios from 'axios';
const { commonStore } = useStore();
let { baseUserInfo } = storeToRefs(commonStore);
const Router = useRouter();
const Route = useRoute();
// 基本信息列数
let baseInfoColumn = ref(3);
//基地信息
let baseDetails: Ref<any> = ref({});
let previewList = ref<Array<string>>([]); //照片预览列表
const statusList: Ref<Array<any>> = ref([]); //基地状态列表
const levelList: Ref<Array<any>> = ref([]); //基地等级列表
// 分享
let shareVisible = ref(false);
let linkURL = ref('');
// 统计数据
let statusStatData = ref<{ companyData: Array<number>; teamData: Array<number> }>({
  companyData: [],
  teamData: []
});
// 获取基地详情
const onGetBaseDetails = async (id: number) => {
  const { data } = await getBasePortDetail({ id });
  if (data.code === 200) {
    baseDetails.value = data.data;
    await getProvince(data.data.provinceCode)
    await getCity(data.data.cityCode)
    await getCounty(data.data.countyCode)

    // 处理照片文件列表
    if (data.data.fileList && data.data.fileList.length > 0) {
      let files: Array<any> = data.data.fileList;
      for (let i = 0; i < files.length; i++) {
        let { data } = await axios.get(import.meta.env.VITE_BASE_URL + files[i].path, {
          responseType: "blob",
        });
        let index = (files[i].path as string).lastIndexOf(".");
        const type = files[i].path.slice(index + 1);
        let blob = new Blob([data], {
          type: `image/${type}`
        });
        let blobUrl = URL.createObjectURL(blob);
        previewList.value[i] = blobUrl
      }
    }

    // 统计数据
    statData.value = data.data.baseStatDto

    let { addQuarterDto, typeAccountedDto, entityStateDto } = data.data.baseStatDto;
    // 季度新增实体数
    if (addQuarterDto) {
      let { firstQuarter, twoQuarter, threeQuarter, fourQuarter, } = addQuarterDto;
      quarterlyData.value = [
        firstQuarter || 0,
        twoQuarter || 0,
        threeQuarter || 0,
        fourQuarter || 0];
    }


    //实体类型占比
    if (typeAccountedDto) {
      let { companyNum, teamNum } = typeAccountedDto
      ratioData.value = [
        { value: teamNum, name: "团队" },
        { value: companyNum, name: "企业" },
      ]
    }

    if (entityStateDto) {
      let {
        companyCloseNum,
        companyIngNum,
        companySuccessNum,
        teamCloseNum,
        teamIngNum,
        teamSuccessNum
      } = entityStateDto;
      statusStatData.value = {
        companyData: [companyIngNum, companySuccessNum, companyCloseNum],
        teamData: [teamIngNum, teamSuccessNum, teamCloseNum]
      }
    }
  }
};
// 获取所在城市
const provinceName = ref('');
const cityName = ref("")
const countyName = ref("")
// 获取省
const getProvince = async (code: number) => {
  let { data } = await getProvinceByCode({ code })
  if (data.code !== 200) return
  provinceName.value = data.data.name
}
// 获取市
const getCity = async (code: number) => {
  let { data } = await getCityByCode({ code })
  if (data.code === 200) {
    cityName.value = data.data?.name
  }
}
// 获取区
const getCounty = async (code: number) => {
  let { data } = await getCountyByCode({ code })
  if (data.code === 200) {
    countyName.value = data.data?.name
  }
}

// 统计数据
let statData: Ref<any> = ref({});
// 季度新增实体数的配置
let quarterlyData = ref<Array<number>>([]);  //季度数据
let statusData = ref([]);//状态数据
// 占比数据
let ratioData = ref<Array<{ value: number, name: string }>>(
  [
    { value: 0, name: "团队" },
    { value: 0, name: "企业" },
  ]
);

// tag配置
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
    if (levelList.value.length > 0) {
      return levelList.value.filter((item: any) => {
        return item.status === baseDetails.value.level
      })[0]?.statusName
    }
  }
})
const baseStatusName = computed(() => {
  if (baseDetails.value !== null) {
    if (statusList.value.length > 0) {
      return statusList.value.filter((item: any) => {
        return item.status === baseDetails.value.status
      })[0]?.statusName
    }
  }
})

// 分享显示隐藏
const changeShowShareDialog = ({ isShow, position }: { isShow: boolean, position?: Array<number> }) => {
  if (position) {
    let [lng, lat] = position;
    linkURL.value = `https://uri.amap.com/marker?position=${lng},${lat}`
  }
  shareVisible.value = isShow;
}

// 编辑按钮
const onEdit = () => {
  commonStore.$patch({
    menuActivePath: Route.path,
  })
  Router.push("/baseEdit");
}

// 响应式布局
const { width } = useWindowSize();

watchEffect(() => {
  if (width.value > 1500) baseInfoColumn.value = 3;
  if (width.value < 1400) baseInfoColumn.value = 2;
  if (width.value < 956) baseInfoColumn.value = 1;
})


onMounted(async () => {
  // 获取基地等级列表
  if (commonStore.basesLevelList.length === 0) {
    await commonStore.getBaseLevelFn()
  }
  levelList.value = commonStore.basesLevelList
  // 获取基地状态列表
  if (commonStore.baseStatusList.length === 0) {
    await commonStore.getBaseStatusFn()
  }
  statusList.value = commonStore.baseStatusList

  // 获取数据
  const incubationBaseId = baseUserInfo.value.incubationBaseId;
  if (incubationBaseId) {
    await onGetBaseDetails(incubationBaseId);
  }
})
</script>

<style scoped lang="scss">
.titleHeader {
  position: relative;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

.titleName {
  display: flex;
  align-items: center;

  h3 {
    font-size: 32px;
    font-weight: 700;
    color: gray;
  }

}

.title {
  font-weight: bold;
  font-size: 18px;
  border-left: 5px solid #1890ff;
  padding-left: 10px;
}

.editBtn {
  position: absolute;
  top: 0;
  right: 0;
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