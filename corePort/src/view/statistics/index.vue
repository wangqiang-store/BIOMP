<template>
    <el-row style="padding: 30px;padding-bottom: 50px;">
        <el-col :span="24">
            <div class="title d_felx d_flex_ac">
                <i class="iconfont icon-tongji mr-5"></i>
                <span>综合统计</span>
            </div>
        </el-col>
        <el-col :span="24" class="mt-20 mb-20 d_flex d_flex_end">
            <el-select v-model="regionCode" class="mr-10" placeholder="请选择区" @change="onChangeRegion">
                <el-option v-for="item in regionOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
            <QuarterSelect @on-change="onChangeQuarter" ref="quarterSelectRef" />
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
            <LevelNumChart :chart-data="levelNumData" title="基地级别数量" />
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
            <LevelPropportionChart :chart-data="levelProData" />
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
            <StatisticsChart :chart-data="statisticsData" :legend-option="statLegendOption" page-name="statistics"
                title="入孵创业实体相关统计" />
        </el-col>
        <el-col :span="24" class="mt-20">
            <h3>{{ yearText }}年第{{ quarterText }}季度广东省创业孵化基地汇总情况表</h3>
            <ReuseTable class="mt-20" :isborder="true" :table-data="topTableData" :table-options="topTableOption" />
            <ReuseTable class="mt-20" :isborder="true" :table-data="bottomTableData"
                :table-options="bottpmTableOption" />
            <div>
                <el-button type="primary" class="mt-20" @click="onExportExcel">导出汇总表</el-button>
            </div>
        </el-col>
        <el-col :span="24" class="mt-20">
            <div class="title d_felx d_flex_ac">
                <i class="iconfont icon-tongji mr-5"></i>
                <span>各基地统计</span>
            </div>
        </el-col>
        <el-col :span="24" class="mt-20 d_flex d_flex_ac d_flex_end">
            <el-cascader v-model="selectBaseData" style="width: 300px;" :props="cascaderProps" @change="onChangeBase" />
        </el-col>
        <el-col :span="24" class="mt-20">
            <h3>{{ seleceBaseName }}</h3>
        </el-col>
        <el-col class="mt-20" :span="8" :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
            <!-- 季度新增 实体数 -->
            <QuarterChart :chart-data="quarterlyData" />
            <p class="mt-10">当季新增入孵创业实体数（户）: {{ baseNumData.addInTheEntity }}</p>
            <p class="mt-10">当季新增入孵创业实体带动就业数（人次）: {{ baseNumData.addInTheEntityPeopleNum }}</p>
        </el-col>
        <el-col class="mt-20" :span="8" :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
            <!-- 实体类型 占比 -->
            <TypeProportionChart :chart-data="ratioData" />
            <p class="mt-10">当前实有入孵创业实体数（户）: {{ baseNumData.haveInTheEntity }}</p>
            <p class="mt-10">当前入孵创业实体带动就业实有数（人次）: {{ baseNumData.haveInTheEntityPeopleNum }}</p>
        </el-col>
        <el-col class="mt-20" :span="8" :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
            <!-- 实体状态 统计 -->
            <StatusStatChart :chart-data="statusStatData" />
            <p class="mt-10">累计入孵创业实体数（户）: {{ baseNumData.sumInTheEntity }}</p>
            <p class="mt-10">累计入孵创业实体带动就业数（人次）: {{ baseNumData.sumInTheEntityPeopleNum }}</p>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { ref, shallowRef } from 'vue';
import QuarterSelect from '@/baseUI/quarterSelect/index.vue';
import LevelNumChart from '@/baseUI/levelNumChart/index.vue';
import LevelPropportionChart from '@/baseUI/levelProportionChart/index.vue';
import StatisticsChart from '@/baseUI/statisticsChart/index.vue';
import ReuseTable from '@/components/reuseTable/index.vue';
import QuarterChart from '@/baseUI/quarterChart/index.vue';
import TypeProportionChart from '@/baseUI/typeProportionChart/index.vue';
import StatusStatChart from '@/baseUI/statusStatChart/index.vue';
import { getBaseStat, getRunBaseByCounty } from '@/api/core/hatchBase';
import { getEntityStat, getBaseLevelNum, getTotalAreaDto } from '@/api/core/statistics';
import { exportStatisticsExcel } from '@/api';
import useStore from '@/store';
import { CustomType } from '@/types'
import { storeToRefs } from 'pinia';

let { commonStore } = useStore();
let { allCountylist } = storeToRefs(commonStore);
let regionCode = ref<number | null>(0);
const quarterSelectRef = ref();
// 季度 文字显示
let quarterText = ref();
// 年 文字显示
let yearText = ref();
// 区下拉框数据
let regionOptions = ref([
    {
        code: 0,
        name: "全市",
    },
    {
        code: 440103000000,
        name: "荔湾区",
    },
    {
        code: 440104000000,
        name: "越秀区",
    },
    {
        code: 440105000000,
        name: "海珠区",
    },
    {
        code: 440106000000,
        name: "天河区",
    },
    {
        code: 440111000000,
        name: "白云区",
    },
    {
        code: 440112000000,
        name: "黄埔区",
    },
    {
        code: 440113000000,
        name: "番禺区",
    },
    {
        code: 440114000000,
        name: "花都区",
    },
    {
        code: 440115000000,
        name: "南沙区",
    },
    {
        code: 440117000000,
        name: "从化区",
    },
    {
        code: 440118000000,
        name: "增城区",
    }
]);
// 基地级别数量数据
let levelNumData = ref<CustomType>([]);
// 基地级别占比数据
let levelProData = ref<CustomType>([]);
// 实体统计数据
let statisticsData = ref<{ addList: Array<number>; haveList: Array<number>; sumList: Array<number> }>({
    addList: [],
    haveList: [],
    sumList: []
});
let statLegendOption = ref({
    left: 'center',
    top: "30px",
    data: ['新增', '实有', '累计']
});
// 基地汇总情况表
let topTableData = ref<Array<{
    sumBase: number,
    nationalNum: number,
    provincialNum: number,
    citiesNum: number,
    districtNum: number,
    restNum: number,
}>>([]);
// 表格数据
let bottomTableData = ref<Array<{
    regionalNum?: number;
    comingHomeNum?: number;
    sumArea?: number;
    addInTheEntity?: number;
    haveInTheEntity?: number;
    sumInTheEntity?: number;
    addInTheEntityPeopleNum?: number;
    haveInTheEntityPeopleNum?: number;
    sumInTheEntityPeopleNum?: number;
}>>([]);
let topTableOption = shallowRef([
    {
        label: "指标",
        type: "text",
        formatter: () => {
            return '总计'
        }
    },
    {
        label: "已建成创业孵化基地数(个)",
        type: "text",
        props: "sumBase",
    },
    {
        label: "国家级创业孵化基地(个)",
        type: "text",
        props: "nationalNum"
    },
    {
        label: "省级示范创业孵化基地(个)",
        type: "text",
        props: "provincialNum"
    },
    {
        label: "地市级(示范)创业孵化基地(个)",
        type: "text",
        props: "citiesNum"
    },
    {
        label: "县(区)级创业孵化基地(个)",
        type: "text",
        props: "districtNum"
    },
    {
        label: "其他 创业孵化基地(个)",
        type: "text",
        props: "restNum"
    },
]);
let bottpmTableOption = shallowRef([
    {
        label: "区域性(特色性)创业孵化基地(个)",
        type: "text",
        props: "regionalNum"
    },
    {
        label: "返乡创业孵化基地(个)",
        type: "text",
        props: "comingHomeNum"
    },
    {
        label: "基地孵化面积(㎡)",
        type: "text",
        props: "sumArea"
    },
    {
        label: "当期新增入孵创业实体数(户)",
        type: "text",
        props: "addInTheEntity"
    },
    {
        label: "期末实有入孵创业实体数(户)",
        type: "text",
        props: "haveInTheEntity"
    },
    {
        label: "累计入孵创业实体数(户)",
        type: "text",
        props: "sumInTheEntity"
    },
    {
        label: "当期新增入孵创业实体带动就业数(人次)",
        type: "text",
        props: "addInTheEntityPeopleNum"
    },
    {
        label: "期末入孵创业实体带动就业实有数(人次)",
        type: "text",
        props: "haveInTheEntityPeopleNum"
    },
    {
        label: "累计入孵创业实体带动就业数(人次)",
        type: "text",
        props: "sumInTheEntityPeopleNum"
    },
]);

// 级联选择 数据
let selectBaseData = ref<Array<{ id: number; name: string }>>([]);
let seleceBaseName = ref('');
// 基地统计
const cascaderProps = {
    lazy: true,
    async lazyLoad(node: CustomType, resolve: CustomType) {
        const { level, value } = node;

        switch (level) {
            case 0:
                if (allCountylist.value.length === 0) await commonStore.onGetAllCounty()

                let countyData: Array<{ value: any; label: string; leaf: boolean }> = [];
                allCountylist.value.forEach(item => {
                    countyData.push({
                        value: item,
                        label: item.statusName,
                        leaf: level >= 1,
                    })
                })
                resolve(countyData)
                break;
            case 1:
                // 根据区获取基地
                let { data } = await getRunBaseByCounty({ countyCode: value.status })
                if (data.code !== 200) return;
                let baseList: Array<{ value: any; label: string; leaf: boolean }> = [];
                data.data.forEach((item: { id: number; name: string }) => {
                    baseList.push({
                        value: item,
                        label: item.name,
                        leaf: level >= 1,
                    })
                })
                resolve(baseList)
                break;
            default:
                break;
        }
    },
}
// 季度数据
let quarterlyData = ref<Array<number>>([]);
// 占比 数据
let ratioData = ref<Array<{ value: number, name: string }>>([]);
// 状态统计
let statusStatData = ref<{ companyData: Array<number>; teamData: Array<number> }>({
    companyData: [],
    teamData: []
});
// 文字显示 入孵数据
let baseNumData = ref({
    addInTheEntity: null,
    haveInTheEntity: null,
    sumInTheEntity: null,
    addInTheEntityPeopleNum: null,
    haveInTheEntityPeopleNum: null,
    sumInTheEntityPeopleNum: null,
});

// 获取入孵企业相关统计数据
const onGetEntityStatData = async (countyCode: number | null, time: string) => {
    let { data } = await getEntityStat({ countyCode, time });
    if (data.code !== 200) return;
    let { addInTheEntity, haveInTheEntity, sumInTheEntity, addInTheEntityPeopleNum, haveInTheEntityPeopleNum, sumInTheEntityPeopleNum } = data.data;
    statisticsData.value = {
        addList: [addInTheEntity || 0, addInTheEntityPeopleNum || 0],
        haveList: [haveInTheEntity || 0, haveInTheEntityPeopleNum || 0],
        sumList: [sumInTheEntity || 0, sumInTheEntityPeopleNum || 0]
    }
    bottomTableData.value = [
        {
            ...bottomTableData.value[0],
            addInTheEntity,
            haveInTheEntity,
            sumInTheEntity,
            addInTheEntityPeopleNum,
            haveInTheEntityPeopleNum,
            sumInTheEntityPeopleNum
        }
    ]
}

// 获取基地等级数量
const onGetBaseLevelNum = async (countyCode: number | null, time: string) => {
    let { data } = await getBaseLevelNum({ countyCode, time })
    if (data.code !== 200) return;
    let { citiesNum, cityNum, districtNum, nationalNum, provincialNum, withoutNum } = data.data;
    levelNumData.value = [
        {
            value: nationalNum || 0,
            itemStyle: {
                color: '#a9a9fe'
            }
        },
        {
            value: provincialNum || 0,
            itemStyle: {
                color: '#5ad8a6'
            }
        },
        {
            value: citiesNum || 0,
            itemStyle: {
                color: '#739ffa'
            }
        },
        {
            value: cityNum || 0,
            itemStyle: {
                color: '#facc14'
            }
        },
        {
            value: districtNum || 0,
            itemStyle: {
                color: '#f36d83'
            }
        },
        {
            value: withoutNum || 0,
            itemStyle: {
                color: '#aaa'
            }
        }
    ]
    levelProData.value = [
        { value: nationalNum || 0, name: "国家级示范" },
        { value: provincialNum || 0, name: "省级示范" },
        { value: citiesNum || 0, name: "地市级示范" },
        { value: cityNum || 0, name: "地市级" },
        { value: districtNum || 0, name: "县(区、镇)级" },
        { value: withoutNum || 0, name: "无" }
    ]
    topTableData.value = [
        {
            sumBase: citiesNum + cityNum + districtNum + nationalNum + provincialNum + withoutNum,
            nationalNum,
            provincialNum,
            citiesNum,
            districtNum,
            restNum: cityNum + withoutNum
        }
    ]
}

// 获取基地数量统计与面积
const onGetBaseStatOrArea = async (countyCode: number | null, time: string) => {
    let { data } = await getTotalAreaDto({ countyCode, time })
    if (data.code !== 200) return;
    let { comingHomeNum, regionalNum, sumArea } = data.data;
    bottomTableData.value = [
        {
            ...bottomTableData.value[0],
            comingHomeNum,
            regionalNum,
            sumArea
        }
    ]
}

const initStatData = (quarter: number | string, year: number | string) => {
    let formatTime: string = '', code: number | null = null;
    switch (quarter) {
        case 1:
            formatTime = `${year}/03/31 23:59:59`
            break;
        case 2:
            formatTime = `${year}/06/30 23:59:59`
            break;
        case 3:
            formatTime = `${year}/09/30 23:59:59`
            break;
        case 4:
            formatTime = `${year}/12/31 23:59:59`
            break;
        default:
            break;
    }

    code = regionCode.value
    if (regionCode.value === 0) code = null;
    onGetEntityStatData(code, formatTime);
    onGetBaseLevelNum(code, formatTime);
    onGetBaseStatOrArea(code, formatTime)
}

// 切换地区
const onChangeRegion = () => {
    let quarter = quarterSelectRef.value.selectQuarter;
    let year = quarterSelectRef.value.quarterYear;
    initStatData(quarter, year)
}

// 切换季度
const onChangeQuarter = ({ year, quarter }: { year: number | string; quarter: number | string }) => {
    initStatData(quarter, year)
    quarterText.value = quarter;
    yearText.value = year;
}

// 切换级联下拉框 基地
const onChangeBase = async () => {
    if (!selectBaseData || selectBaseData.value.length === 0) return
    seleceBaseName.value = selectBaseData.value[1].name;
    //  获取基地入孵数据
    let { data } = await getBaseStat({ incubationBaseId: selectBaseData.value[1].id })
    if (data.code !== 200) return;
    let {
        addInTheEntity,
        haveInTheEntity,
        sumInTheEntity,
        addInTheEntityPeopleNum,
        haveInTheEntityPeopleNum,
        sumInTheEntityPeopleNum,
        addQuarterDto,
        entityStateDto,
        typeAccountedDto
    } = data.data;

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
    } else {
        quarterlyData.value = []
    }
    if (typeAccountedDto) {
        let { companyNum, teamNum } = typeAccountedDto;
        ratioData.value = [
            { value: teamNum, name: `团队` },
            { value: companyNum, name: "企业" }
        ];
    } else {
        ratioData.value = []
    }
    if (entityStateDto) {
        let { companyCloseNum, companyIngNum, companySuccessNum, teamCloseNum, teamIngNum, teamSuccessNum } = entityStateDto;
        statusStatData.value = {
            companyData: [companyIngNum, companySuccessNum, companyCloseNum],
            teamData: [teamIngNum, teamSuccessNum, teamCloseNum]
        }
    } else {
        statusStatData.value = {
            companyData: [],
            teamData: []
        }
    }
    baseNumData.value = {
        addInTheEntity,
        haveInTheEntity,
        sumInTheEntity,
        addInTheEntityPeopleNum,
        haveInTheEntityPeopleNum,
        sumInTheEntityPeopleNum,
    }
}

// 导出excel
const onExportExcel = async () => {
    let quarter = quarterSelectRef.value.selectQuarter;
    let year = quarterSelectRef.value.quarterYear;
    let formatTime: string = '', code: number | null = null;
    switch (quarter) {
        case 1:
            formatTime = `${year}/03/31 23:59:59`
            break;
        case 2:
            formatTime = `${year}/06/30 23:59:59`
            break;
        case 3:
            formatTime = `${year}/09/30 23:59:59`
            break;
        case 4:
            formatTime = `${year}/12/31 23:59:59`
            break;
        default:
            break;
    }

    code = regionCode.value
    if (regionCode.value === 0) code = null;

    let { data } = await exportStatisticsExcel({ countyCode: code, time: formatTime });
    let blob = new Blob([data], {
        type: "application/vnd.ms-excel"
    });
    let blobURL = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = blobURL;
    a.download = `${yearText.value}年第${quarterText.value}季度广东省创业孵化基地汇总情况表`;
    a.click()
}
</script>

<style scoped lang="scss">
.title {
    width: 100%;
    height: 40px;
    color: #5499ff;
    font-size: 16px;
    border-bottom: 1px solid #5499ff;

    & span {
        font-weight: 700;
    }

    & i {
        font-size: 22px;
    }
}
</style>