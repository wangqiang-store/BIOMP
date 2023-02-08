<template>
    <my-container class="mt-20">
        <my-head text="基地级别数量"></my-head>

        <LevelNumChart :chart-data="chartData" />
    </my-container>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import MyContainer from './component/myContainer.vue';
import MyHead from './component/myHead.vue';
import LevelNumChart from '@/baseUI/levelNumChart/index.vue';

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
</script>

<style scoped lang="scss">

</style>