<template>
    <el-row>
        <el-col :span="24">
            <!-- 入孵企业数据 -->
            <EntityData :entity-data="entityData" />
        </el-col>
        <el-col :span="18" :xl="18" :lg="16" :md="24" :sm="24" :xs="24">
            <!-- 专家名片 -->
            <Card />
            <!-- 活动沙龙 -->
            <Activity />
        </el-col>
        <el-col :span="6" :xl="6" :lg="8" :md="24" :sm="24" :xs="24" class="home-right">
            <!-- 通知公告 -->
            <Notice />
            <!-- 实体状态统计 -->
            <Statistics :chart-data="statusStatData" />
            <!-- 统计图表 -->
            <TypeProporton :chart-data="ratioData" />
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import EntityData from './entityData.vue';
import Notice from './notice.vue';
import Card from './card.vue';
import Activity from './activity.vue';
import Statistics from './statistics.vue';
import TypeProporton from "./typeProportion.vue";
import { getBasePortDetail } from "@/api/basePortApi/index";
import { storeToRefs } from 'pinia';
import useStore from '@/store';
const { commonStore } = useStore();
let { baseUserInfo } = storeToRefs(commonStore);

// 入孵企业数据 
let entityData = ref<Array<{ text: string; count: number }>>([]);

// 统计数据
let statusStatData = ref<{ companyData: Array<number>; teamData: Array<number> }>({
    companyData: [],
    teamData: []
});

// 占比统计数据
let ratioData = ref<Array<{ value: number; name: string }>>([]);

// 获取基地详情
const onGetBaseDetails = async (id: number) => {
    const { data } = await getBasePortDetail({ id });
    if (data.code !== 200) return;

    let {
        addInTheEntity,
        haveInTheEntity,
        sumInTheEntity,
        entityStateDto,
        typeAccountedDto
    } = data.data.baseStatDto;

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

    if (entityStateDto) {
        let { companyCloseNum, companyIngNum, companySuccessNum, teamCloseNum, teamIngNum, teamSuccessNum } = entityStateDto;
        statusStatData.value = {
            companyData: [companyIngNum, companySuccessNum, companyCloseNum],
            teamData: [teamIngNum, teamSuccessNum, teamCloseNum]
        }
    }

    //实体类型占比
    if (typeAccountedDto) {
        let { companyNum, teamNum } = typeAccountedDto
        ratioData.value = [
            { value: teamNum, name: "团队" },
            { value: companyNum, name: "企业" },
        ]
    }
};

onMounted(async () => {
    // 获取数据
    await onGetBaseDetails(baseUserInfo.value.incubationBaseId);
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