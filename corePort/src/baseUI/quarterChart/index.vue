<template>
    <!-- 季度新增 实体数 -->
    <ReuseEcharts charts-id="quarter" :option="option" ref="charts" chartsRef="quarterRef" />
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, watch } from 'vue';
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

interface Props {
    chartData: Array<number>
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return []
    }
})

let { chartData } = toRefs(props);

const charts = ref();

let option = ref({
    title: {
        text: "季度新增实体数",
        left: "center"
    },
    tooltip: {
        trigger: 'item',
        borderColor: "#e4e6ea",
        formatter: (params: any | Array<any>, ticket: string, callback: (ticket: string, html: string) => {}): string | HTMLElement | HTMLElement[] => {
            // console.log('params: ', params);
            let HTML = `
                <div>
                    <p>${params.seriesName}${params.name}</p>    
                    <p>
                       <span class="mr-5">当季新增:</span>
                       <span>${params.value}户</span>
                    </p>    
                </div>
            `
            return HTML
        }
    },
    legend: {
        bottom: '0%',
        left: 'center',
        data: [{
            name: `${new Date().getFullYear()}`,
            // 强制设置图形为圆。
            icon: 'none',
            // 设置文本为红色
            textStyle: {
                color: '#484848'
            }
        }]
    },
    xAxis: {
        type: 'category',
        data: ['第一季度', '第二季度', '第三季度', '第四季度']
    },
    yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
            show: true
        }
    },
    series: [
        {
            name: `${new Date().getFullYear()}`,
            data: chartData.value,
            type: 'line'
        }
    ]
});

const initCharts = () => {
    charts.value.initCharts();
};

const drawCharts = () => {
    // echarts赋值
    chartData.value.length === 0 ? ((option.value.yAxis as any).max = 100) : ((option.value.yAxis as any).max = null);
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