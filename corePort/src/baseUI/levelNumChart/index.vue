<template>
    <!-- 等级数量 -->
    <ReuseEcharts charts-id="levelNum" :option="option" ref="charts" chartsRef="levelNumRef" />
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, watch } from 'vue';
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

interface Props {
    chartData: Array<any>,
    title?: string
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return []
    },
    title: ''
})

let { chartData, title } = toRefs(props);

const charts = ref();

let option = ref(
    {
        title: {
            text: title.value,
            left: "center"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            // formatter: "{b}(个) : {c}",
        },
        xAxis: {
            type: 'category',
            nameRotate: 45,
            data: ['国家级示范', '省级示范', '地市级示范', '地市级', '县(区、镇)级', '无'],
            axisLabel: {
                formatter: function (params: any) {
                    var newParamsName = "";
                    var paramsNameNumber = params.length;
                    var provideNumber = 3; //一行显示几个字
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
                data: chartData.value,
                type: 'bar'
            }
        ]
    }
);

const initCharts = () => {
    charts.value.initCharts();
};

const drawCharts = () => {
    // echarts赋值
    title.value !== '' && (option.value.title.text = title.value);
    option.value.series[0].data = chartData.value;
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