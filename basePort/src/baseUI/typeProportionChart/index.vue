<template>
    <!-- 类型占比 -->
    <ReuseEcharts charts-id="typeProportion" :option="option" ref="charts" charts-ref="typeProportionRef" />
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, watch } from 'vue';
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

interface Props {
    chartData: Array<{ value: number, name: string }>;
    text?: string;
    legendOption?: {} | null
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return []
    },
    text: '',
    legendOption: () => {
        return {
            orient: "vertical",
            left: 'right',
            selectedMode: false
        }
    }
})

let { chartData, text, legendOption } = toRefs(props);

const charts = ref();

let option = ref(
    {
        title: {
            text: text?.value,
            left: "center"
        },
        color: ["#3ba1ff", "#a9a9fe"],
        tooltip: { // 提示框浮层
            show: true, // 是否显示提示框组件。
            trigger: "item", // 触发类型;可选：'item', 'axis', 'none'. 
            axisPointer: { // 坐标轴指示器配置项。
                type: 'line', // 指示器类型。可选 'line','shadow','none','cross'; 
                axis: 'auto', // 指示器的坐标轴。可以是 'x', 'y', 'radius', 'angle'。
                snap: true, // 坐标轴指示器是否自动吸附到点上。默认自动判断
            },
            textStyle: { // 提示框浮层的文本样式。
                color: "#415058", // 文字的颜色。
                fontStyle: 'normal', // 文字字体的风格, 可选 'normal', 'italic', 'oblique'
            },
            showDelay: 0, // 浮层显示的延迟，单位为 ms，默认没有延迟
            padding: 0, // 提示框浮层内边距
            backgroundColor: "#fff", // 提示框浮层的背景颜色
            // 重写tooltip
            formatter: (params: any) => {
                let str =
                    "<span style='padding: 5px 10px;border-radius:5px;'>" +
                    params.marker +
                    params.data.name +
                    " : " +
                    params.data.value +
                    "户</span>";
                return str;
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);',// 额外附加到浮层的 css 样式
        },
        legend: legendOption.value,
        series: [
            {
                name: "企业",
                type: "pie",
                radius: ['35%', '55%'],
                center: ["50%", "50%"],
                avoidLabelOverlap: false,
                label: {
                    // formatter: "{b}\n{d}%",
                    formatter: (params: { name: string; percent: number }) => {
                        let { name, percent } = params;
                        return `${name}:${percent ? percent % 1 === 0 ? percent : percent.toFixed(1) : 0}%`
                    },
                    fontSize: 13,
                },
                labelLine: {
                    length: 5,
                    length2: 5
                },
                data: chartData.value
            },
            {
                name: "团队", // 系列名称
                type: "pie", // 类型 是 pie
                radius: ['35%', '55%'],  // 饼图的半径。
                center: ["50%", "50%"], // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
                // 支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
                avoidLabelOverlap: false,
                label: { // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
                    show: false,
                    position: "center",
                },
                emphasis: { // 高亮状态的扇区和标签样式。
                    label: { // 标签内容
                        show: true,
                        fontSize: "40",
                        fontWeight: "bold",
                        formatter: "{total|" + "{b}" + "}" + "\n\r" + "{active|{c}户}",
                        rich: {
                            total: {
                                fontSize: 14,
                                fontFamily: "微软雅黑",
                                color: "#454c5c",
                                align: 'center',
                                lineHeight: 20,
                            },
                            active: {
                                fontFamily: "微软雅黑",
                                fontSize: 32,
                                color: "#6c7a89",
                                align: 'center',
                                lineHeight: 30,
                            },
                        },
                    },
                },
                labelLine: {
                    show: false,
                },
                data: chartData.value
            },
        ],
    }
);

const initCharts = () => {
    charts.value.initCharts();
};

const drawCharts = () => {
    // echarts赋值
    text.value && (option.value.title.text = text.value);
    legendOption.value && (option.value.legend = legendOption.value);
    option.value.series[0].data = chartData.value;
    option.value.series[1].data = chartData.value;
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