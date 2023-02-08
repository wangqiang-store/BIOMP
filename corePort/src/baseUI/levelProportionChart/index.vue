<template>
    <!-- 基地级别占比 -->
    <ReuseEcharts charts-id="levelProportion" :option="option" ref="charts" charts-ref="levelProportionRef" />
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, watch } from 'vue';
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

interface Props {
    chartData: Array<{ value: number, name: string }>
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return []
    }
})

let { chartData } = toRefs(props);

const charts = ref();

let option = ref(
    {
        title: {
            text: "基地级别占比",
            left: "center"
        },
        color: ["#a9a9fe", "#5ad8a6", "#73a0fa", "#facc14", "#f04864", "#999999"],
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: "vertical",
            left: 'right',
            // data: ["国家级示范", "省级示范", "地市级示范", "地市级", "县(区、镇)级", "无"]
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    formatter: (params: { name: string; percent: number }) => {
                        let { name, percent } = params;
                        return `${name}:${percent ? percent % 1 === 0 ? percent : percent.toFixed(1) : 0}%`
                    },
                },
                labelLine: {
                    show: true
                },
                data: chartData.value
            }
        ]
    }
);

const initCharts = () => {
    charts.value.initCharts();
};

const drawCharts = () => {
    // echarts赋值
    option.value.series[0].data = chartData.value;
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