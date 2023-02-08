<template>
    <!-- 入住实体管理页面 -->
    <el-row>
        <!-- 搜索 -->
        <el-col :span="24" class="d_flex d_flex_ac">
            <el-input style="width: 200px;" class="mr-10" v-model.trim="entityName" placeholder="请输入入孵实体名称"></el-input>
            <el-select class="mr-10" v-model="selectEntityType" clearable placeholder="实体类型">
                <el-option v-for="item in selectOptions.entityTypeList" :key="item.status" :label="item.statusName"
                    :value="item.status" />
            </el-select>
            <el-select class="mr-10" v-model="selectHatchStatus" clearable placeholder="孵化状态">
                <el-option v-for="item in selectOptions.incubationStatusList" :key="item.status"
                    :label="item.statusName" :value="item.status" />
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

        <!-- 表格 -->
        <el-col :span="24" class="mt-20" v-loading="tableLoading">
            <ReuseTable :table-data="tableData" :table-options="tableOptions" :table-row-class-name="tableRowClassName"
                @on-handle-row="onHandleRow" @on-sort-change="onSortChange" />
            <ReusePagination :total="tableTotal" :current-page="pagingParams.page" :page-size="pagingParams.limit"
                :background="true" @size-change="onSizeChange" @current-change="onCurrentChange" />
        </el-col>

        <!-- 批量关闭-->
        <el-col :span="24">
            <el-dialog class="custom-class" v-model="closedDialogVisible" title="批量关闭" width="30%" destroy-on-close>
                <div>
                    <h4 class="mb-10">选择:</h4>
                    <el-select class="w-100 mb-20" v-model="entityCloseList" multiple filterable
                        placeholder="输入入驻实体名称关键词" collapse-tags collapse-tags-tooltip value-key="id">
                        <el-option v-for="item in allEntityList" :key="item.id" :label="item.name" :value="item" />
                    </el-select>
                    <h4 class="mb-10">已选择:</h4>
                    <el-scrollbar max-height="400px">
                        <template v-for="item of entityCloseList" :key="item.id">
                            <el-alert :title="item.name" class="mb-10" @close="onCloseAlert(item)" />
                        </template>
                    </el-scrollbar>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="closedDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="onSubmitClose" :disabled="entityCloseList.length === 0">确定
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import ReuseTable from '@/components/reuseTable/index.vue';
import { CustomType } from '@/types';
import ReusePagination from '@/components/reusePagination/index.vue';
import { useRoute, useRouter } from 'vue-router';
import useStore from '@/store';
import dayjs from "dayjs";
import { getInTheEntityByPage, closeBatchById, getRunInTheEntityByBaseId, closeBatch } from "@/api/companyApi/index"
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
const { commonStore } = useStore();
let { baseUserInfo } = storeToRefs(commonStore);
const Router = useRouter();
const Route = useRoute()

interface EntityTableRow {
    name: string;
    acreage: string | number;
    address: string;
    principal: string;
    telephone: string;
    companyNum: string | number;
    level: number;
    status: number;
    createTime: string;
    [key: string]: any;
}

// 搜索以及分页参数
let entityName = ref(''); //孵化实体名称
let selectEntityType = ref(); //实体类型
let selectHatchStatus = ref(); //孵化状态
let selectOptions: any = reactive({})
let pagingParams: CustomType = reactive({
    limit: 10,
    page: 1,
    content: "",
    status: undefined,
    type: undefined,
    incubationBaseId: undefined,
});
// 切换个数
const onSizeChange = (size: number) => {
    pagingParams.limit = size;
    onGetPagingData();
};
// 切换页数
const onCurrentChange = (page: number) => {
    pagingParams.page = page;
    onGetPagingData();
}
// 搜索
const onSearch = () => {
    pagingParams.page = 1;
    pagingParams.content = entityName.value;
    pagingParams.status = selectHatchStatus.value;
    pagingParams.type = selectEntityType.value;
    onGetPagingData();
};
// 分页获取表格数据
const onGetPagingData = async () => {
    tableLoading.value = true;
    let { data } = await getInTheEntityByPage(pagingParams);
    if (data.code !== 200) { tableLoading.value = false; return };

    tableLoading.value = false;
    tableData.value = data.data?.records;
    retainTableData.value = data.data?.records;
    tableTotal.value = data.data?.total;
};
// 新建按钮
const onCreate = () => {
    commonStore.$patch({
        menuActivePath: Route.path
    })
    Router.push({
        path: "/company/create",
        query: {
            id: ""
        }
    })
}


//表格数据
let tableLoading = ref(false);
let tableTotal = ref(0);
let tableData = ref<EntityTableRow[]>([]);
let retainTableData = ref<EntityTableRow[]>([]);
let tableOptions = ref([
    {
        label: "序号",
        type: "index",
        width: "80"
    },
    {
        label: "入驻实体名称",
        type: "text",
        props: "name"
    },
    // {
    //     label: "入驻基地",
    //     type: "text",
    //     props: "incubationBaseName"
    // },
    {
        label: "入驻基地时间",
        type: "text",
        props: "baseTime",
        formatter: (row: CustomType) => {
            return row.baseTime ? dayjs(row.baseTime).format("YYYY-MM-DD") : ''
        }
    },
    {
        label: "实体类型",
        type: "tag",
        props: "typeName",
        color(row: CustomType) {
            let colorOption = ["#e1e1ff", "#b3f0e1"];
            return colorOption[`${row.type - 1}`]
        },
        textColor(row: CustomType) {
            let colorOption = ["#9999ff", "#00cc66"];
            return colorOption[`${row.type - 1}`]
        },
        formatter(row: CustomType) {
            if (selectOptions.entityTypeList.length > 0) {
                return selectOptions?.entityTypeList.filter((item: any) => {
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
        formatter: (row: CustomType) => {
            return dayjs(row.protocolTime).format("YYYY-MM-DD")
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
        style(row: CustomType) {
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
        formatter: (row: CustomType) => {
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
                isShow(row: CustomType) {
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
                isShow(row: CustomType) {
                    return row.status !== 3
                }
            },
        ]
    }
]);
// 表格行样式
const tableRowClassName = ({
    row,
    rowIndex,
}: {
    row: EntityTableRow
    rowIndex: number
}) => {
    if (row.status === 3) {
        return "info-row"
    }
    let protocolTime = new Date(row.protocolTime).getTime()
    let newTime = new Date().getTime()
    if (newTime >= protocolTime) {
        return 'error-row'
    }
}
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
            commonStore.$patch({
                menuActivePath: Route.path
            })
            Router.push({
                path: "/company/details",
                query: {
                    id: rowData.id,
                }
            })
            break;
        case 'edit':
            commonStore.$patch({
                menuActivePath: Route.path
            })
            Router.push({
                path: "/company/edit",
                query: {
                    id: rowData.id,
                }
            })
            break
        case 'close':
            let { data } = await closeBatchById({ id: rowData.id });
            if (data.code !== 200) return;
            ElMessage({
                message: "入孵实体关闭成功",
                type: "success"
            })
            onGetPagingData();
            break
        default:
            break;
    }
}

// 批量关闭
let closedDialogVisible = ref(false);
let entityCloseList: CustomType = ref([]);
let allEntityList: CustomType = ref([
    { name: "张三", value: 3, id: 3 },
    { name: "李四", value: 4, id: 4 },
    { name: "王五", value: 5, id: 5 },
    { name: "赵六", value: 6, id: 6 },
])
// 根据基地id获取所有未关闭的实体
const getRunInTheEntityByBaseIdFn = async () => {
    let { data } = await getRunInTheEntityByBaseId({ incubationBaseId: Number(baseUserInfo.value.incubationBaseId) })
    if (data.code === 200) {
        allEntityList.value = data.data
    }
}
// 点击批量关闭按钮
const onBatchClosed = () => {
    closedDialogVisible.value = true;
    entityCloseList.value = []
};
// 要取消的实体
const onCloseAlert = (data: CustomType) => {
    let index = entityCloseList.value.findIndex((item: CustomType) => {
        return item.id === data.id
    });
    entityCloseList.value.splice(index, 1);
};
// 批量删除框的确认
const onSubmitClose = async () => {
    let ids: Array<number> = [];
    entityCloseList.value.forEach((item: CustomType) => {
        ids.push(item.id)
    })
    let { data } = await closeBatch({ ids: ids.join(",") });
    if (data.code !== 200) return;
    ElMessage({
        message: "批量关闭基地成功",
        type: "success"
    });
    closedDialogVisible.value = false;
    onGetPagingData();
};


onMounted(async () => {
    const incubationBaseId = baseUserInfo.value.incubationBaseId;
    if (incubationBaseId) {
        pagingParams.incubationBaseId = incubationBaseId
    }
    //获取实体类型列表
    if (commonStore.entityTypeList.length === 0) {
        await commonStore.getEntityTypeFn()
    }
    selectOptions.entityTypeList = commonStore.entityTypeList
    // 获取孵化状态列表
    if (commonStore.incubationStatusList.length === 0) {
        await commonStore.getIncubationStatusTypeFn()
    }
    selectOptions.incubationStatusList = commonStore.incubationStatusList

    onGetPagingData();
    getRunInTheEntityByBaseIdFn()
});

</script>

<style scoped lang="scss">
.el-table :deep(.info-row) {
    --el-table-tr-bg-color: #f2f2f2;
}

.el-table :deep(.error-row) {
    --el-table-tr-bg-color: #ffe3e3;
}

.el-table :deep(.success-row) {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.el-table :deep(.el-table-fixed-column--right) {
    background: inherit;
}
</style>