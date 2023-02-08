<template>
    <my-container class="mt-20">
        <MyHead text="创孵基地" />
        <reuse-map class="homeMap" map-id="homeMap" address="广州市" :is-show-search="false" :base-list="baseList"
            :home-select-data="selectData" @on-go-to-base-details="onGoToBaseDetails"
            @on-click-home-marker="onClickHomeMarker">
            <el-select class="homeMap-select" popper-class="amap" v-model="showContent" @change="onChange" filterable
                value-key="label" placeholder="请搜索区域或基地">
                <el-option v-for="(item, index) of options" :key="item.id || item.code" :label="item.label"
                    :value="item" :class="item.selected && 'selected'" @click="onClickOption(index)">
                    <p class="text-ellipsis">{{ item.name }}</p>
                    <p style="font-size: 13px;" class="text-ellipsis">{{
                            item.address
                    }}</p>
                </el-option>
            </el-select>
        </reuse-map>
    </my-container>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import ReuseMap from '@/components/reuseMap/index.vue';
import MyContainer from './component/myContainer.vue';
import MyHead from './component/myHead.vue';
import useStore from '@/store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
let { commonStore, userStore } = useStore();
let { userInfo } = storeToRefs(userStore);
let { runCodeBaseList } = storeToRefs(commonStore);
const ROUTER = useRouter();
// 下拉框显示内容
let showContent = ref<any>();
// 下拉选中数据
let selectData = ref();

interface BaseListDataType {
    id: number; name: string; address: string; longitude: number; latitude: number; label: string
}

interface CountyListDataType {
    code: number;
    name: string;
    address: string;
    selected?: boolean
}

type OptionType = BaseListDataType & CountyListDataType;

const options = ref<Array<OptionType>>([]);


//孵化基地列表
let baseList = ref<Array<BaseListDataType>>([]);

// 所有区列表
let allCountyList = ref([
    {
        code: 440103,
        name: "荔湾区",
        address: "广州市荔湾区",
        label: "荔湾区广州市荔湾区"
    },
    {
        code: 440104,
        name: "越秀区",
        address: "广州市越秀区",
        label: "越秀区广州市越秀区"
    },
    {
        code: 440105,
        name: "海珠区",
        address: "广州市海珠区",
        label: "海珠区广州市海珠区"
    },
    {
        code: 440106,
        name: "天河区",
        address: "广州市天河区",
        label: "天河区广州市天河区"
    },
    {
        code: 440111,
        name: "白云区",
        address: "广州市白云区",
        label: "白云区广州市白云区"
    },
    {
        code: 440112,
        name: "黄埔区",
        address: "广州市黄埔区",
        label: "黄埔区广州市黄埔区"
    },
    {
        code: 440113,
        name: "番禺区",
        address: "广州市番禺区",
        label: "番禺区广州市番禺区"
    },
    {
        code: 440114,
        name: "花都区",
        address: "广州市花都区",
        label: "花都区广州市花都区"
    },
    {
        code: 440115,
        name: "南沙区",
        address: "广州市南沙区",
        label: "南沙区广州市南沙区"
    },
    {
        code: 440117,
        name: "从化区",
        address: "广州市从化区",
        label: "从化区广州市从化区"
    },
    {
        code: 440118,
        name: "增城区",
        address: "广州市增城区",
        label: "增城区广州市增城区"
    }
]);

// 区列表
let countyList = ref<Array<{
    code: number;
    name: string;
    address: string;
    label: string;
}>>([])

const onChange = () => {
    selectData.value = showContent.value;
    showContent.value = showContent.value.name;
}

const onClickOption = (index: number) => {
    options.value.forEach((item, i) => {
        if (i === index) item.selected = true
        else item.selected = false
    })
}

// 跳转基地详情页
const onGoToBaseDetails = ({ id }: { id: number }) => {
    ROUTER.push({ name: "hatchDetails", query: { id } });
}

// 点击首页地图标注
const onClickHomeMarker = () => {
    selectData.value = {}
    showContent.value = "";
    options.value.forEach((item) => {
        item.selected = false
    })
}

onMounted(async () => {
    await commonStore.onGetRunBaseData(userInfo.value.countyCode);
    (runCodeBaseList.value as Array<{ id: number; name: string; address?: string; longitude: number; latitude: number; label: string }>).forEach(item => {
        baseList.value.push({
            name: item.name,
            address: item.address as string,
            id: item.id,
            longitude: item.longitude,
            latitude: item.latitude,
            label: item.name + item.address as string
        })
    })

    // 获取当前区 数据
    countyList.value = allCountyList.value.filter(item => {
        return Number(`${item.code}000000`) === userInfo.value.countyCode
    })
    options.value = [...countyList.value, ...baseList.value] as Array<OptionType>
})
</script>

<style scoped lang="scss">
.homeMap {
    position: relative;
    min-height: 700px;
    padding: 20px;
    height: 700px;

    .homeMap-select {
        width: 350px;
        position: absolute;
        top: 30px;
        left: 30px;
    }
}
</style>