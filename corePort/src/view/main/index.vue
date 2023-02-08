<template>
    <el-row>
        <el-col :span="18" :xl="18" :lg="16" :md="24" :sm="24" :xs="24">
            <!-- 入孵企业数据 -->
            <EntityData :entity-data="entityData" />
            <!-- 地图 -->
            <Amap />
            <!-- 专家名片 -->
            <Card />
            <!-- 活动沙龙 -->
            <Activity />
        </el-col>
        <el-col :span="6" :xl="6" :lg="8" :md="24" :sm="24" :xs="24" class="home-right">
            <!-- 通知公告 -->
            <Notice />
            <!-- 快速开始 / 便捷导航 -->
            <Nav />
            <!-- 基地级别数量图表 -->
            <LevelNum />
            <!-- 统计图表 -->
            <Statistics :chart-data="statData" />
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import EntityData from './entityData.vue';
import Notice from './notice.vue';
import Nav from './nav.vue';
import Amap from './amap.vue';
import Card from './card.vue';
import Activity from './activity.vue';
import LevelNum from './levelNum.vue';
import Statistics from './statistics.vue';
import { getEntityStat } from '@/api/core/statistics';

// 入驻企业数据
let entityData = ref();
// 统计数据
let statData = ref();

const onGetCurrentQuarter = () => {
    // 获取当前月份
    let currentMonth = new Date().getMonth() + 1;
    // 获取当前季度
    let quarterList = [
        { min: 1, max: 3, currentQuarter: 1 },
        { min: 4, max: 6, currentQuarter: 2 },
        { min: 7, max: 9, currentQuarter: 3 },
        { min: 10, max: 12, currentQuarter: 4 }
    ];
    let quarter = quarterList.filter(item => {
        return currentMonth >= item.min && currentMonth <= item.max
    })[0].currentQuarter;
    return quarter;
}

// 获取入孵企业相关统计数据
const onGetEntityStatData = async () => {
    let quarter = onGetCurrentQuarter();
    let formatTime = '';
    switch (quarter) {
        case 1:
            formatTime = `${new Date().getFullYear()}/03/31 23:59:59`
            break;
        case 2:
            formatTime = `${new Date().getFullYear()}/06/30 23:59:59`
            break;
        case 3:
            formatTime = `${new Date().getFullYear()}/09/30 23:59:59`
            break;
        case 4:
            formatTime = `${new Date().getFullYear()}/12/31 23:59:59`
            break;
        default:
            break;
    }

    let { data } = await getEntityStat({ countyCode: null, time: formatTime });
    if (data.code !== 200) return;
    let { addInTheEntity, haveInTheEntity, sumInTheEntity, addInTheEntityPeopleNum, haveInTheEntityPeopleNum, sumInTheEntityPeopleNum } = data.data;
    statData.value = {
        addList: [addInTheEntity || 0, addInTheEntityPeopleNum || 0],
        haveList: [haveInTheEntity || 0, haveInTheEntityPeopleNum || 0],
        sumList: [sumInTheEntity || 0, sumInTheEntityPeopleNum || 0]
    }
    entityData.value = [
        {
            text: "当季新增入孵创业实体数",
            count: addInTheEntity
        },
        {
            text: "当前实有入孵创业实体数",
            count: haveInTheEntity
        },
        {
            text: "累计入孵创业实体数",
            count: sumInTheEntity
        }
    ]
}

onMounted(() => {
    onGetEntityStatData()
})
</script>

<style scoped lang="scss">
.home-right {
    padding-left: 20px;
}

@media screen and (max-width:1200px) {
    .home-right {
        padding-left: 0;
        margin-top: 20px;
    }
}
</style>