<template>
    <my-container class="mt-20">
        <my-head text="基地级别数量"></my-head>

        <LevelNumChart :chart-data="chartData" />
    </my-container>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import MyContainer from './component/myContainer.vue';
import MyHead from './component/myHead.vue';
import LevelNumChart from '@/baseUI/levelNumChart/index.vue';
import { getBaseLevelNum } from '@/api/core/statistics';
import { storeToRefs } from 'pinia';
import useStore from '@/store'
let { userStore } = useStore();
let { userInfo } = storeToRefs(userStore)
let chartData = ref([
    {
        value: 80,
        itemStyle: {
            color: '#a9a9fe'
        }
    },
    {
        value: 60,
        itemStyle: {
            color: '#5ad8a6'
        }
    },
    {
        value: 50,
        itemStyle: {
            color: '#739ffa'
        }
    },
    {
        value: 70,
        itemStyle: {
            color: '#facc14'
        }
    },
    {
        value: 150,
        itemStyle: {
            color: '#f36d83'
        }
    },
    {
        value: 60,
        itemStyle: {
            color: '#aaa'
        }
    }
]);

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

// 获取基地等级数量
const onGetBaseLevelNum = async () => {
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

    let { data } = await getBaseLevelNum({ countyCode: userInfo.value.countyCode, time: formatTime })
    if (data.code !== 200) return;
    let { citiesNum, cityNum, districtNum, nationalNum, provincialNum, withoutNum } = data.data;
    chartData.value = [
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
}

onMounted(() => {
    onGetBaseLevelNum()
})
</script>

<style scoped lang="scss">

</style>