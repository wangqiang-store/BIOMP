<template>
    <my-container class="mt-20">
        <MyHead text="实体状态统计" />

        <StatusStatChart :chart-data="chartData" :legend-option="legendOption" />
    </my-container>
</template>
<script lang="ts" setup>
import { shallowRef, toRefs } from 'vue';
import MyContainer from './component/myContainer.vue';
import MyHead from './component/myHead.vue';
import StatusStatChart from '@/baseUI/statusStatChart/index.vue'

interface Props {
    chartData: { companyData: Array<number>; teamData: Array<number> }
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return {
            companyData: [],
            teamData: []
        }
    }
})

let { chartData } = toRefs(props);

const legendOption = shallowRef({
    left: 'center',
    top: "10px"
})
</script>

<style scoped lang="scss">

</style>