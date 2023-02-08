<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>入驻创业实体管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="p-20">
        <el-col :span="24" class="d_flex d_flex_ac mt-20">
            <el-input style="width: 200px;" class="mr-10" v-model="entityName" placeholder="请输入入孵实体名称"></el-input>
            <el-select class="mr-10" v-model="selectEnterBase" clearable filterable placeholder="入驻基地">
                <el-option v-for="item in baseOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-select class="mr-10" v-model="selectEntityType" clearable placeholder="实体类型">
                <el-option v-for="item in typeOptions" :key="item.status" :label="item.statusName"
                    :value="item.status" />
            </el-select>
            <el-select class="mr-10" v-model="selectHatchStatus" clearable placeholder="孵化状态">
                <el-option v-for="item in statusOptions" :key="item.status" :label="item.statusName"
                    :value="item.status" />
            </el-select>
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
                批量关闭
            </el-button>
        </el-col>
        <el-col :span="24" class="mt-20" v-loading="entityLoading">
            <ReuseTable :table-data="tableData" :table-options="tableOptions" :table-row-class-name="tableRowClassName"
                @on-handle-row="onHandleRow" @on-sort-change="onSortChange"/>
            <ReusePagination :total="tableTotal" :current-page="pagingParams.page" :page-size="pagingParams.limit"
                :background="true" @size-change="onSizeChange" @current-change="onCurrentChange" />
        </el-col>
        <el-col :span="24">
            <!-- 批量关闭-->
            <el-dialog class="custom-class" v-model="closedDialogVisible" title="批量关闭" width="30%" destroy-on-close>
                <div>
                    <h4 class="mb-10">选择:</h4>
                    <el-select class="w-100 mb-20" v-model="selectCloseEntity" multiple filterable
                        placeholder="输入入驻实体名称关键词" collapse-tags collapse-tags-tooltip value-key="id">
                        <el-option v-for="item in runCodeEntityList" :key="item.id" :label="item.name" :value="item" />
                    </el-select>
                    <h4 class="mb-10">已选择:</h4>
                    <el-scrollbar max-height="400px">
                        <template v-for="item of selectCloseEntity" :key="item.id">
                            <el-alert :title="item.name" class="mb-10" @close="onCloseAlert(item)" />
                        </template>
                    </el-scrollbar>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="closedDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="onSubmitClose" :disabled="selectCloseEntity.length === 0">确定
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
import { EntityTableRow } from "../type"
import ReusePagination from '@/components/reusePagination/index.vue';
import { getPagingEntity, closeEntity, batchCloseEntity, getEntityDetails } from '@/api/core/hatchEntity'
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { storeToRefs } from 'pinia';
import { entityPagingParams } from '@/api/type';
import dayjs from "dayjs";
import { ElMessage } from 'element-plus';
import { entityListType } from '@/store/type';
const ROUTER = useRouter();
const { pageStore, commonStore, userStore } = useStore();
let { runCodeEntityList, entityStatus, entityType, allCodeBaseList } = storeToRefs(commonStore);
let { userInfo } = storeToRefs(userStore);

let entityName = ref('');
let selectEnterBase = ref();
let selectEntityType = ref();
let selectHatchStatus = ref();
let entityLoading = ref(false);
let pagingParams: entityPagingParams = reactive({
    content: "",
    countyCode: userInfo.value.countyCode,
    incubationBaseId: undefined,
    isAsc: undefined,
    type: undefined,
    status: undefined,
    limit: 10,
    page: 1
});
let baseOptions = ref<Array<{ id?: number, name?: string }>>([]);
let typeOptions = ref<Array<{ status?: number, statusName?: string }>>([]);
let statusOptions = ref<Array<{ status?: number, statusName?: string }>>([]);
let tableTotal = ref(0);
let tableData = ref<Array<EntityTableRow>>([]);
let retainTableData = ref<Array<EntityTableRow>>([]);
let tableOptions = ref([
    {
        label: "序号",
        type: "text",
        formatter: (row: EntityTableRow, column: TableColumnCtx<CustomType>, cellValue: CustomType, index: number) => {
            return index + 1
        }
    },
    {
        label: "入驻实体名称",
        type: "text",
        props: "name"
    },
    {
        label: "入驻基地",
        type: "text",
        props: "incubationBaseName"
    },
    {
        label: "入驻基地时间",
        type: "text",
        props: "baseTime",
        formatter: (row: EntityTableRow) => {
            return row.baseTime ? dayjs(row.baseTime).format("YYYY-MM-DD") : ''
        }
    },
    {
        label: "实体类型",
        type: "tag",
        color(row: EntityTableRow) {
            let colorOption = ["#e1e1ff", "#b3f0e1"];
            return colorOption[`${row.type - 1}`]
        },
        textColor(row: EntityTableRow) {
            let colorOption = ["#9999ff", "#00cc66"];
            return colorOption[`${row.type - 1}`]
        },
        formatter(row: EntityTableRow) {
            if (typeOptions.value.length > 0) {
                return typeOptions?.value.filter(item => {
                    return item.status === row.type
                })[0]?.statusName;
            }
        }
    },
    {
        label: "孵化协议号",
        type: "text",
        props: "protocolNum"
    },
    {
        label: "孵化协议期限",
        type: "text",
        props: "protocolTime",
        formatter: (row: EntityTableRow) => {
            return row.protocolTime ? dayjs(row.protocolTime).format("YYYY-MM-DD") : ''
        }
    },
    {
        label: "用工人数",
        type: "text",
        props: "peopleNum"
    },
    {
        label: "孵化状态",
        type: "styleText",
        props: "statusName",
        style(row: EntityTableRow) {
            let colors = ["#1890ff", "#6468ef", "#bdbdc6"];
            return {
                color: colors[row.status - 1]
            }
        },
    },
    {
        label: "创建时间",
        type: "text",
        props: "createTime",
        sortable: true,
        formatter: (row: EntityTableRow) => {
            return dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
        }
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
                isShow(row: EntityTableRow) {
                    return row.status !== 3
                }
            },
            {
                text: "关闭",
                textBtn: true,
                type: "primary",
                handleType: "close",
                isPopConfirm: true,
                width: 200,
                title: "是否关闭入孵实体？",
                isShow(row: EntityTableRow) {
                    return row.status !== 3
                }
            },
        ]
    }
]);
const tableRowClassName = ({
    row,
}: {
    row: EntityTableRow
    rowIndex: number
}) => {
    if (row.status === 3) {
        return 'info-row';
    } else {
        if (!row.protocolTime) return '';
        let isOverdue = new Date(row.protocolTime).getTime() < new Date().getTime();
        if (isOverdue) {
            return 'danger-row'
        }
    }
}
// 批量关闭
let closedDialogVisible = ref(false);
let selectCloseEntity = ref<Array<entityListType>>([]);
// 分页获取基地数据
const onGetPagingData = async (params: entityPagingParams) => {
    entityLoading.value = true;
    let { data } = await getPagingEntity(params);
    if (data.code !== 200) { entityLoading.value = false; return };
    entityLoading.value = false;
    tableData.value = data.data?.records;
    retainTableData.value = data.data?.records;
    tableTotal.value = data.data?.total;
};
// 搜索
const onSearch = () => {
    pagingParams.page = 1;
    pagingParams.content = entityName.value;
    pagingParams.incubationBaseId = selectEnterBase.value;
    pagingParams.type = selectEntityType.value;
    pagingParams.status = selectHatchStatus.value;
    onGetPagingData(pagingParams);
};
// 新建按钮
const onCreate = () => {
    ROUTER.push({ name: "companyCreate" });
    pageStore.$patch((state) => {
        state.entityDetails = {}
    })
}
// 点击批量关闭
const onBatchClosed = () => {
    closedDialogVisible.value = true;
    selectCloseEntity.value = []
    commonStore.onGetRunEntityData(userInfo.value.countyCode);
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
const onCloseAlert = (data: entityListType) => {
    let index = selectCloseEntity.value.findIndex(item => {
        return item.id === data.id
    });
    selectCloseEntity.value.splice(index, 1);
};
// 确认关闭
const onSubmitClose = async () => {
    let ids: Array<number> = [];
    selectCloseEntity.value.forEach((item) => {
        ids.push(item.id)
    })
    let { data } = await batchCloseEntity({ ids: ids.join(',') });
    if (data.code !== 200) return;
    ElMessage({
        message: "批量关闭入驻实体成功",
        type: "success"
    });
    closedDialogVisible.value = false;
    commonStore.onGetRunEntityData(userInfo.value.countyCode);
    onGetPagingData(pagingParams);
};
// 表格排序
const onSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
    let closeList: EntityTableRow[] = [];
    let runList: EntityTableRow[] = [];
    let successList: EntityTableRow[] = [];
    tableData.value.forEach(item => {
        switch (item.status) {
            case 1:
                runList.push(item)
                break;
            case 2:
                successList.push(item)
                break;
            case 3:
                closeList.push(item)
                break;
            default:
                break;
        }
    })

    switch (order) {
        case "ascending":
            runList.sort((a, b) => {
                return new Date(a[prop]).getTime() - new Date(b[prop]).getTime()
            });
            successList.sort((a, b) => {
                return new Date(a[prop]).getTime() - new Date(b[prop]).getTime()
            });
            closeList.sort((a, b) => {
                return new Date(a[prop]).getTime() - new Date(b[prop]).getTime()
            });
            tableData.value = [...runList, ...successList, ...closeList]
            break;
        case "descending":
            closeList.sort((a, b) => {
                return new Date(b[prop]).getTime() - new Date(a[prop]).getTime()
            });
            runList.sort((a, b) => {
                return new Date(b[prop]).getTime() - new Date(a[prop]).getTime()
            });
            successList.sort((a, b) => {
                return new Date(b[prop]).getTime() - new Date(a[prop]).getTime()
            });
            tableData.value = [...runList, ...successList, ...closeList]
            break;
        case null:
            tableData.value = retainTableData.value;
            break
        default:
            break;
    }
}
// 表格操作
const onHandleRow = async ({ rowData, type }: { rowData: CustomType<EntityTableRow>, type: string }) => {
    switch (type) {
        case 'details':
            ROUTER.push({ name: "companyDetails", query: { id: rowData.id } });
            break;
        case 'edit':
            let { data: detailsData } = await getEntityDetails({ id: rowData.id });
            if (detailsData.code !== 200) return;
            ROUTER.push({ name: "companyEdit" });
            pageStore.$patch((state) => {
                state.entityDetails = detailsData.data
            })
            break
        case 'close':
            let { data } = await closeEntity({ id: rowData.id });
            if (data.code !== 200) return;
            ElMessage({
                message: "入孵实体关闭成功",
                type: "success"
            })
            onGetPagingData(pagingParams);
            break
        default:
            break;
    }
}

onMounted(async () => {
    // 获取基地列表
    await commonStore.onGetAllBaseData(userInfo.value.countyCode)
    baseOptions.value = allCodeBaseList.value as Array<any>;
    // 获取实体类型
    if (entityType.value.length === 0) await commonStore.onGetEntityType()
    typeOptions.value = entityType.value;
    // 获取实体状态
    if (entityStatus.value.length === 0) await commonStore.onGetEntityStatus()
    statusOptions.value = entityStatus.value;
    onGetPagingData(pagingParams);
});

</script>

<style scoped lang="scss">
.el-table :deep(.info-row) {
    --el-table-tr-bg-color: #f2f2f2;
}

.el-table :deep(.danger-row) {
    --el-table-tr-bg-color: #ffe3e3;
}

.el-table :deep(.el-table-fixed-column--right) {
    background: inherit;
}
</style>