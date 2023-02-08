<template>
    <el-row>
        <el-col :span="24">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>配置中心</el-breadcrumb-item>
                <el-breadcrumb-item>操作日志</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="10" class="d_flex d_flex_ac mt-20">
            <el-input style="width:200px" class="mr-10" v-model="searchContent" placeholder="请输入账户名/操作">
            </el-input>
            <el-date-picker style="height: 100%;" class="mr-10" v-model="timeHorizon" type="datetimerange"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            <el-button type="primary" @click="onSearch">
                <el-icon class="mr-5">
                    <Search />
                </el-icon>
                查询
            </el-button>
        </el-col>
        <el-col :span="24" class="mt-20" v-loading="logLoading">
            <ReuseTable :table-data="tableData" :table-options="tableOptions" />
            <ReusePagination :total="tableTotal" :page-size="pagingParams.limit" :current-page="pagingParams.page"
                @current-change="onCurrentChange" @size-change="onSizeChange" />
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import ReuseTable from "@/components/reuseTable/index.vue";
import ReusePagination from "@/components/reusePagination/index.vue";
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import dayjs from 'dayjs';
import { ArrowRight } from '@element-plus/icons-vue';
import { LogTableRow } from '../type'
import { getLog } from '@/api/core/sysLog';
import { CustomType } from '@/types'

interface pagingParmasType {
    startTime?: undefined | string;
    endTime?: undefined | string;
    content?: string;
    limit: number;
    page: number;
}
let tableTotal = ref(0);
let searchContent = ref('');
let timeHorizon = ref([]);
let logLoading = ref(false);
let pagingParams = reactive<pagingParmasType>({
    startTime: undefined,
    endTime: undefined,
    content: "",
    limit: 10,
    page: 1
});
let tableData = ref<Array<LogTableRow>>([]);
const tableOptions = ref([
    {
        label: "序号",
        type: "text",
        formatter: (row: LogTableRow, column: TableColumnCtx<CustomType>, cellValue: CustomType, index: number) => {
            return index + 1
        }
    },
    {
        label: "账号名",
        props: "userName",
        type: "text"
    },
    {
        label: "用户操作",
        props: "operation",
        type: "text"
    },
    {
        label: "用户ip",
        props: "ip",
        type: "text"
    },
    {
        label: "操作时间",
        props: "createTime",
        type: "text",
        formatter(row: LogTableRow) {
            return dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
        }
    },
]);
// 获取日志分页数据
const onGetPagingData = async (params: pagingParmasType) => {
    logLoading.value = true;
    let { data } = await getLog(params);
    if (data.code !== 200) { logLoading.value = false; return };
    logLoading.value = false;
    tableData.value = data.data?.records;
    tableTotal.value = data.data?.total;
};
const onSearch = () => {
    pagingParams.page = 1;
    pagingParams.content = searchContent.value;
    if (timeHorizon.value && timeHorizon.value.length > 0) {
        pagingParams.startTime = dayjs(timeHorizon.value[0]).format('YYYY/MM/DD HH:mm:ss');
        pagingParams.endTime = dayjs(timeHorizon.value[1]).format('YYYY/MM/DD HH:mm:ss');
    } else {
        pagingParams.startTime = undefined;
        pagingParams.endTime = undefined;
    }
    onGetPagingData(pagingParams);
}
const onCurrentChange = (page: number) => {
    pagingParams.page = page;
    onGetPagingData(pagingParams);
}
const onSizeChange = (size: number) => {
    pagingParams.page = 1;
    pagingParams.limit = size;
    onGetPagingData(pagingParams);
}
onMounted(() => {
    onGetPagingData(pagingParams);
})
</script>