<template>
    <!-- 实体状态统计 -->
    <ReuseEcharts charts-id="status" :option="option" ref="charts" charts-ref="statusRef" />
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, watch } from 'vue';
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

interface Props {
    chartData: {
        companyData: Array<number>;
        teamData: Array<number>
    },
    text?: string;
    legendOption?: {} | null
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return {
            companyData: [],
            teamData: []
        }
    },
    text: "",
    legendOption: () => {
        return {
            left: 'center',
            top: "30px"
        }
    }
})

let { chartData, text, legendOption } = toRefs(props);

const charts = ref();

let option = ref(
    {
        title: {
            text: text.value,
            left: "center"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: legendOption.value,
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['孵化中', '孵化成功', '已关闭']
            }
        ],
        yAxis: [
            {
                type: 'value',
                minInterval: 1
            }
        ],
        series: [
            {
                name: '企业',
                type: 'bar',
                stack: 'Ad',
                barWidth: "40",
                data: chartData.value.companyData
            },
            {
                name: '团队',
                type: 'bar',
                stack: 'Ad',
                barWidth: "40",
                data: chartData.value.teamData
            },
        ]
    }
);

const initCharts = () => {
    charts.value.initCharts();
};

const drawCharts = () => {
    // echarts赋值
    text.value && (option.value.title.text = text.value)
    legendOption.value && (option.value.legend = legendOption.value)
    option.value.series[0].data = chartData.value.companyData;
    option.value.series[1].data = chartData.value.teamData;
    charts.value.drawCharts();
}

watch(chartData, (newData) => {
    drawCharts()
});

onMounted(() => {
    initCharts()
    drawCharts()
})
</script>

<style scoped lang="scss">

</style>