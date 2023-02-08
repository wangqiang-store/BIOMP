<template>
    <my-container class="mt-20">
        <MyHead text="入孵创业实体相关统计" />

        <StatisticsChart :chart-data="chartData" :legend-option="legendOption" />
    </my-container>
</template>
<script lang="ts" setup>
import { shallowRef, toRefs } from 'vue';
import MyContainer from './component/myContainer.vue';
import MyHead from './component/myHead.vue';
import StatisticsChart from '@/baseUI/statisticsChart/index.vue';

interface Props {
    chartData: { addList: Array<number>; haveList: Array<number>; sumList: Array<number> }
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return {
            addList: [],
            haveList: [],
            sumList: []
        }
    }
})

let { chartData } = toRefs(props)


const legendOption = shallowRef({
    left: 'center',
    top: "10px",
    data: ['当季新增', '当前实有', '累计']
})
</script>

<style scoped lang="scss">

</style>