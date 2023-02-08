<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>孵化基地管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="p-20">
        <el-col :span="24" class="d_flex d_flex_ac mt-20">
            <div class="d_flex d_flex_ac mr-10">
                <el-autocomplete v-model="baseName" :fetch-suggestions="querySearch" class="inline-input w-50"
                    placeholder="孵化基地名称" />
            </div>
            <div class="d_flex d_flex_ac mr-10">
                <el-select v-model="selectBaseLevel" clearable placeholder="请选择">
                    <el-option v-for="item in levelOptions" :key="item.status" :label="item.statusName"
                        :value="item.status" />
                </el-select>
            </div>
            <el-button type="primary" @click="onSearch">
                <el-icon class="mr-5">
                    <Search />
                </el-icon>
                查询
            </el-button>
            <el-button type="primary" @click="onCreate">
                <el-icon class="mr-5">
                    <Plus />
                </el-icon>
                新建
            </el-button>
            <el-button @click="onBatchClosed">
                <el-icon class="mr-5">
                    <DeleteFilled />
                </el-icon>
                批量退出
            </el-button>
        </el-col>
        <el-col :span="24" class="mt-20" v-loading="baseLoading">
            <ReuseTable :table-data="tableData" :table-options="tableOptions" :table-row-class-name="tableRowClassName"
                @on-handle-row="onHandleRow" @on-sort-change="onSortChange" />
            <ReusePagination :total="tableTotal" :current-page="pagingParams.page" :page-size="pagingParams.limit"
                :background="true" @size-change="onSizeChange" @current-change="onCurrentChange" />
        </el-col>
        <el-col :span="24">
            <!-- 批量退出-->
            <el-dialog class="custom-class" v-model="closedDialogVisible" title="批量退出" width="30%" destroy-on-close>
                <div>
                    <h4 class="mb-10">选择:</h4>
                    <el-select class="w-100 mb-20" v-model="selectCloseBase" multiple filterable placeholder="输入基地名称关键词"
                        collapse-tags collapse-tags-tooltip value-key="id">
                        <el-option v-for="item in runBaseList" :key="item.id" :label="item.name" :value="item" />
                    </el-select>
                    <h4 class="mb-10">已选择:</h4>
                    <el-scrollbar max-height="400px">
                        <template v-for="item of selectCloseBase" :key="item.id">
                            <el-alert :title="item.name" class="mb-10" @close="onCloseAlert(item)" />
                        </template>
                    </el-scrollbar>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="closedDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="onSubmitClose" :disabled="selectCloseBase.length === 0">确定
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';
import ReuseTable from '@/components/reuseTable/index.vue';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { CustomType } from '@/types';
import { HatchTableRow } from "../type"
import ReusePagination from '@/components/reusePagination/index.vue';
import { findByPageBase, closeBase, batchCloseBase, getBaseDetails } from '@/api/core/hatchBase'
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { storeToRefs } from 'pinia';
import { pagingSearchBaseParams } from '@/api/type'
import dayjs from "dayjs";
import { ElMessage } from 'element-plus';
import { baseListType } from '@/store/type';
const ROUTER = useRouter();
const { pageStore, commonStore } = useStore();
let { baseLevel, runBaseList, allBaseList } = storeToRefs(commonStore)

let baseName = ref('');
let selectBaseLevel = ref();
let baseLoading = ref(false);
let pagingParams: pagingSearchBaseParams = reactive({
    content: "",
    level: undefined,
    limit: 10,
    page: 1
});
let levelOptions = ref<Array<{ status?: number, statusName?: string }>>([]);
let tableTotal = ref(0);
let tableData = ref<Array<HatchTableRow>>([]);
let retainTableData = ref<Array<HatchTableRow>>([]); //保留原有数据 排序
let tableOptions = ref([
    {
        label: "序号",
        type: "text",
        formatter: (row: HatchTableRow, column: TableColumnCtx<CustomType>, cellValue: CustomType, index: number) => {
            return index + 1
        }
    },
    {
        label: "孵化基地名称",
        type: "text",
        props: "name"
    },
    {
        label: "地址",
        type: "text",
        props: "address"
    },
    {
        label: "运营机构",
        type: "text",
        props: "operating"
    },
    {
        label: "基地级别",
        type: "tag",
        width: 160,
        color(row: HatchTableRow) {
            let colorOption = ["#e1e1ff", "#b3f0e1", "#c2ffff", "#ffe1b3", "#ffd2d2", "#f0f0f0"];
            return colorOption[`${row.level - 1}`]
        },
        textColor(row: HatchTableRow) {
            let colorOption = ["#9999ff", "#00cc66", "#0099ff", "#ff9900", "#ff6633", "#666666"];
            return colorOption[`${row.level - 1}`]
        },
        formatter(row: HatchTableRow) {
            if (levelOptions.value.length > 0 && row.level) {
                return levelOptions?.value.filter(item => {
                    return item.status === row.level
                })[0].statusName;
            }
        }
    },
    {
        label: "基地孵化面积(m²)",
        type: "text",
        props: "area"
    },
    {
        label: "入孵创业实体数(户)",
        type: "text",
        props: "companyNum",
        width: 150
    },
    {
        label: "基地状态",
        type: "styleText",
        props: "statusName",
        style(row: HatchTableRow) {
            return {
                color: row.status === 1 ? '#1890ff' : '#bdbdc6'
            }
        },
    },
    {
        label: "创建时间",
        type: "text",
        props: "createTime",
        sortable: true,
        formatter: (row: HatchTableRow) => {
            return row.createTime ? dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss") : ''
        },
    },
    {
        label: "操作",
        type: "handle",
        width: 280,
        btns: [
            {
                text: "详情",
                textBtn: true,
                type: "primary",
                handleType: "details"
            },
            {
                text: "编辑",
                textBtn: true,
                type: "primary",
                handleType: "edit",
                isShow(row: HatchTableRow) {
                    return row.status === 1
                }
            },
            {
                text: "退出",
                textBtn: true,
                type: "primary",
                handleType: "close",
                isPopConfirm: true,
                width: 200,
                title: "该基地是否退出？基地退出后，基地数据将无法操作，基地账户将无法登录。",
                isShow(row: HatchTableRow) {
                    return row.status === 1
                }
            },
        ]
    }
]);

const tableRowClassName = ({
    row,
}: {
    row: HatchTableRow
    rowIndex: number
}) => {
    if (row.status === 2) {
        return 'info-row'
    }
}
// 批量退出
let closedDialogVisible = ref(false);
let selectCloseBase = ref<Array<baseListType>>([]);
// 搜索基地名称
const querySearch = (queryString: string, cb: any) => {
    if (allBaseList.value === null) return;
    let allBaseData = allBaseList.value.map(item => {
        return { value: item.name }
    })
    const results = queryString
        ? allBaseData.filter(createFilter(queryString))
        : allBaseData
    cb(results)
}
const createFilter = (queryString: string) => {
    return (restaurant: { value: string }) => {
        return restaurant.value.indexOf(queryString) !== -1
    }
}

// 分页获取基地数据
const onGetPagingData = async (params: pagingSearchBaseParams) => {
    baseLoading.value = true;
    let { data } = await findByPageBase(params);
    if (data.code !== 200) { baseLoading.value = false; return };
    baseLoading.value = false;
    tableData.value = data.data?.records;
    retainTableData.value = data.data?.records;
    tableTotal.value = data.data?.total;
};
// 搜索
const onSearch = () => {
    pagingParams.page = 1;
    pagingParams.content = baseName.value;
    pagingParams.level = selectBaseLevel.value;
    onGetPagingData(pagingParams);
};
// 新建按钮
const onCreate = () => {
    ROUTER.push({ name: "hatchCreate" });
    pageStore.$patch((state) => {
        state.baseDetails = {}
    })
}
// 点击批量退出
const onBatchClosed = () => {
    closedDialogVisible.value = true;
    selectCloseBase.value = []
    commonStore.onGetRunBaseData();
};
// 切换表格显示个数
const onSizeChange = (size: number) => {
    pagingParams.page = 1;
    pagingParams.limit = size;
    onGetPagingData(pagingParams);
};
// 切换表格当前页数
const onCurrentChange = (page: number) => {
    pagingParams.page = page;
    onGetPagingData(pagingParams);
}
const onCloseAlert = (data: baseListType) => {
    let index = selectCloseBase.value.findIndex(item => {
        return item.id === data.id
    });
    selectCloseBase.value.splice(index, 1);
};
// 表格排序
const onSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
    let closeList: HatchTableRow[] = [];
    let runList: HatchTableRow[] = [];
    tableData.value.forEach(item => {
        if (item.status === 2) closeList.push(item)
        else runList.push(item)
    })

    switch (order) {
        case "ascending":
            closeList.sort((a, b) => {
                return new Date(a[prop]).getTime() - new Date(b[prop]).getTime()
            });
            runList.sort((a, b) => {
                return new Date(a[prop]).getTime() - new Date(b[prop]).getTime()
            });
            tableData.value = [...runList, ...closeList]
            break;
        case "descending":
            closeList.sort((a, b) => {
                return new Date(b[prop]).getTime() - new Date(a[prop]).getTime()
            });
            runList.sort((a, b) => {
                return new Date(b[prop]).getTime() - new Date(a[prop]).getTime()
            });
            tableData.value = [...runList, ...closeList]
            break;
        case null:
            tableData.value = retainTableData.value;
            break
        default:
            break;
    }

}
// 确认退出
const onSubmitClose = async () => {
    let ids: Array<number> = [];
    selectCloseBase.value.forEach((item) => {
        ids.push(item.id)
    })
    let { data } = await batchCloseBase({ ids: ids.join(',') });
    if (data.code !== 200) return;
    ElMessage({
        message: "批量退出基地成功",
        type: "success"
    });
    closedDialogVisible.value = false;
    commonStore.onGetRunBaseData();
    onGetPagingData(pagingParams);
};
// 表格操作
const onHandleRow = async ({ rowData, type }: { rowData: CustomType<HatchTableRow>, type: string }) => {
    switch (type) {
        case 'details':
            ROUTER.push({ name: "hatchDetails", query: { id: rowData.id } });
            break;
        case 'edit':
            let { data: detailsData } = await getBaseDetails({ id: rowData.id });
            if (detailsData.code !== 200) return;
            ROUTER.push({ name: "hatchEdit" });
            pageStore.$patch((state) => {
                state.baseDetails = detailsData.data
            })
            break
        case 'close':
            let { data } = await closeBase({ id: rowData.id });
            if (data.code !== 200) return;
            ElMessage({
                message: "基地退出成功",
                type: "success"
            })
            onGetPagingData(pagingParams);
            break
        default:
            break;
    }
}

onMounted(async () => {
    // 获取所有基地
    await commonStore.onGetAllBaseData()
    // 获取基地等级
    if (baseLevel.value.length === 0) await commonStore.onGetBaseLevel()
    levelOptions.value = baseLevel.value;
    onGetPagingData(pagingParams);
});

</script>

<style scoped lang="scss">
.el-table :deep(.info-row) {
    --el-table-tr-bg-color: #f2f2f2;
}

.el-table :deep(.el-table-fixed-column--right) {
    background: inherit;
}
</style>