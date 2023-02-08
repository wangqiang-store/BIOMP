<template>
    <my-container class="mt-20">
        <my-head text="在孵实体占比类型"></my-head>

        <TypeProportionChart :chart-data="chartData" :legend-option="legendOption" />
    </my-container>
</template>
<script lang="ts" setup>
import { toRefs, shallowRef } from 'vue';
import MyContainer from './component/myContainer.vue';
import MyHead from './component/myHead.vue';
import TypeProportionChart from '@/baseUI/typeProportionChart/index.vue';

interface Props {
    chartData: Array<{
        name: string;
        value: number
    }>
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => []
})

let { chartData } = toRefs(props)

const legendOption = shallowRef(null)
</script>

<style scoped lang="scss">

</style>