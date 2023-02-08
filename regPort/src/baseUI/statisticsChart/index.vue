<template>
    <!-- 入孵创业实体相关统计-->
    <ReuseEcharts charts-id="statistics" :option="option" ref="charts" chartsRef="statisticsRef" />
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, watch } from 'vue';
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

interface Props {
    chartData: {
        addList: Array<number>;
        haveList: Array<number>;
        sumList: Array<number>;
    };
    title?: string;
    legendOption?: {} | null,
    pageName?: string
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return {
            addList: [],
            haveList: [],
            sumList: []
        }
    },
    title: "",
    legendOption: () => {
        return {
            orient: "vertical",
            left: 'right',
            data: ['当季新增', '当前实有', '累计']
        }
    },
    pageName: "home"
})

let { chartData, title, legendOption, pageName } = toRefs(props);

const charts = ref();

let option = ref(
    {
        title: {
            text: "",
            left: "center"
        },
        color: ["#73a0fa", "#5ad8a6", "#a9a9fe"],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            // formatter: "{b}(个) : {c}",
        },
        legend: legendOption.value,
        xAxis: {
            type: 'category',
            nameRotate: 45,
            data: ['入孵创业实体数', '入孵创业实体带动就业数'],
            axisLabel: {
                formatter: function (params: any) {
                    var newParamsName = "";
                    var paramsNameNumber = params.length;
                    var provideNumber = 4; //一行显示几个字
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                    if (paramsNameNumber > provideNumber) {
                        for (var p = 0; p < rowNumber; p++) {
                            var tempStr = "";
                            var start = p * provideNumber;
                            var end = start + provideNumber;
                            if (p == rowNumber - 1) {
                                tempStr = params.substring(start, paramsNameNumber);
                            } else {
                                tempStr = params.substring(start, end) + "\n";
                            }
                            newParamsName += tempStr;
                        }
                    } else {
                        newParamsName = params;
                    }
                    return newParamsName;
                }
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1
        },
        series: [
            {
                name: pageName.value === "statistics" ? '新增' : '当季新增',
                type: 'bar',
                barWidth: "40",
                data: chartData.value.addList
            },
            {
                name: pageName.value === "statistics" ? '实有' : '当前实有',
                type: 'bar',
                barWidth: "40",
                data: chartData.value.haveList
            },
            {
                name: '累计',
                type: 'bar',
                barWidth: "40",
                data: chartData.value.sumList
            },
        ]
    }
);

const initCharts = () => {
    charts.value.initCharts();
};

const drawCharts = () => {
    // echarts赋值
    legendOption.value && (option.value.legend = legendOption.value);
    option.value.series[0].data = chartData.value.addList;
    option.value.series[1].data = chartData.value.haveList;
    option.value.series[2].data = chartData.value.sumList;
    title.value !== '' && (option.value.title.text = title.value);
    charts.value.drawCharts();
}

watch(chartData, () => {
    drawCharts()
});

onMounted(() => {
    initCharts()
    drawCharts()
})
</script>

<style scoped lang="scss">

</style>