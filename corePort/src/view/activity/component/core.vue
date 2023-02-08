<template>
    <!-- 活动中心页面 -->
    <div class="activityPage">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item>活动沙龙</el-breadcrumb-item>
            <el-breadcrumb-item>{{ type === 'my' ? '我的活动' : '活动中心' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page">
            <!-- 搜索 -->
            <div class="search">
                <el-input v-model.trim="content" style="width: 400px"
                    :placeholder="type === 'my' ? '请输入活动标题、简介' : '请输入活动标题、简介、发布来源'" />
                <el-button type="primary" class="searchBtn" @click="onSearch" size="large">搜索</el-button>
                <el-button type="primary" v-if="type === 'my'" size="large" @click="onCreate">发布活动</el-button>
            </div>
            <!-- 活动类型 -->
            <div class="activityType">
                <span class="mr-20">活动类型: </span>
                <div class="typeList">
                    <span v-for="(item, index) in acTypeList" :key="item.status"
                        :class="{ active: index === typeIndex }" @click="onPickType(item.status)">{{ item.statusName
                        }}</span>
                </div>
            </div>
            <!-- 活动列表 -->
            <div class="activityContent" v-if="listData.length > 0">
                <el-row>
                    <el-col v-for="(item, index) in listData" :key="index" :span="6" :xs="24" :sm="12" :md="6">
                        <div class="box">
                            <div class="box-container">
                                <div class="box-item" @click.stop="goToDetail(item)">
                                    <el-image style="width: 100%;height: 180px;"
                                        :src="item.coverPath ? fileBaseUrl + item.coverPath : defaultIMG" />
                                    <div class="bottomBox">
                                        <div class="title text-ellipsis" :title="item.title">{{ item.title }}</div>
                                        <div class="desc text-ellipsis" :title="item.introduction">{{ item.introduction
                                        }}</div>
                                        <div class="text text-ellipsis" v-if="type !== 'my'" :title="item.sourceName">
                                            发布来源:
                                            <span>{{ item.sourceName }}</span>
                                        </div>
                                        <div class="time">
                                            <div class="text-ellipsis">{{ dayjs(item.activityTime).format("YYYY-MM-DD HH: mm: ss") }}
                                            </div>
                                            <div class="type">{{ getAcTypeName(item.activityType) }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="btn" v-if="type === 'my'">
                                    <div @click.stop="onEdit(item)">编辑</div>
                                    <div @click.stop="onDelete(item)">删除</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-else>
                <el-empty description="暂无活动" />
            </div>
            <!-- 分页 -->
            <reuse-pagination :total="total" :page-size="pagingParams.limit" :current-page="pagingParams.page"
                :page-size-list="[8, 16, 24]" @current-change="onCurrentChange" @size-change="onSizeChange" />
        </div>
    </div>
</template>
  
<script setup lang="ts">
import reusePagination from "@/components/reusePagination/index.vue"
import { computed, onMounted, ref, toRefs } from "vue";
import { CustomType } from "@/types"
import { useRouter, useRoute } from "vue-router";
import defaultIMG from "@/assets/u0.svg";
import { ArrowRight } from '@element-plus/icons-vue';
import useStore from "@/store";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { deleteActivity } from "@/api/core/activity";
import { getActivityDetails } from "@/api/core/activity";
import { ElMessage, ElMessageBox } from "element-plus";
const ROUTER = useRouter();
let { commonStore, pageStore } = useStore();
let { activityType } = storeToRefs(commonStore)


interface Props {
    type?: string;
    // 列表数据
    listData: CustomType;
    total: number;
    pagingParams: CustomType;
}

const props = withDefaults(defineProps<Props>(), {
    type: "center",
    listData: () => [],
    total: 0,
    pagingParams: () => { return {} }
})
let { total, pagingParams } = toRefs(props)

const emits = defineEmits<{
    (e: 'onSearch', data: { content: string, type: number }): void
    (e: 'onCurrentChange', page: number): void
    (e: 'onSizeChange', size: number): void
    (e: 'onPickType', value: number | undefined): void
}>()


const onCurrentChange = (page: number) => {
    emits("onCurrentChange", page)
}
const onSizeChange = (page: number) => {
    emits("onSizeChange", page)
}

let fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`
})
// 搜索
const content = ref("");
// 活动分类数据
let typeIndex: CustomType = ref(0);
const acTypeList = ref<Array<{ status: number | undefined; statusName: string }>>([])
const onPickType = (index: number | undefined) => {
    typeIndex.value = index === undefined ? 0 : index
    emits("onPickType", index)
}
const onSearch = () => {
    emits("onSearch", { content: content.value, type: typeIndex.value === 0 ? undefined : typeIndex.value })
}
// 显示活动类型名称 number ~ string
const getAcTypeName = (type: number) => {
    return acTypeList.value.filter(item => {
        return item.status === type
    })[0].statusName
};

// 发布活动按钮
const onCreate = () => {
    ROUTER.push({ name: "activityPublish" });
    pageStore.$patch((status) => {
        status.activityDetails = {}
    })
}

// 编辑
const onEdit = async (data: CustomType) => {
    let { data: detailsData } = await getActivityDetails({ id: data.id });
    if (detailsData.code !== 200) return;
    ROUTER.push({ name: "activityEdit" });
    pageStore.$patch((status) => {
        status.activityDetails = detailsData.data
    })
}
// 删除
const onDelete = (activityInfo: CustomType) => {
    ElMessageBox.confirm(
        '是否删除该活动记录?',
        '删除提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let { data } = await deleteActivity({ id: activityInfo.id });
            if (data.code !== 200) return;
            ElMessage({
                message: "删除成功",
                type: "success"
            })
            onSearch()
        })
        .catch(() => { })
}

const goToDetail = (data: { id: number }) => {
    ROUTER.push({ name: "activityDetails", query: { id: data.id, index: props.type === 'my' ? 1 : 0 } })
}

onMounted(async () => {
    // 获取活动类型
    activityType.value.length === 0 && await commonStore.onGetActivityType();
    acTypeList.value = [{ statusName: "全部", status: undefined }, ...activityType.value];
})

</script>
  
<style scoped lang="scss">
.activityPage {
    position: relative;

    .page {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .search {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;

        :deep(.el-input__wrapper) {
            border-radius: 5px 0 0 5px !important;
        }

        .searchBtn {
            border-radius: 0 5px 5px 0;
        }
    }

    .activityType {
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-left: 20px;
        padding-bottom: 20px;
        border-bottom: 1px dashed $borderColor;

        .typeList {
            display: flex;

            span {
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
            }
        }

        .active {
            background-color: #2494ff;
            color: #fff;
        }
    }

    .activityContent {
        max-width: 1200px;
        margin-top: 20px;

        .box {
            cursor: pointer;
            padding: 10px;

            .box-container {
                border: 1px solid $borderColor;
                    box-shadow: $pageBoxShadow;

                .box-item {
                    

                    .el-image {
                        border-bottom: 1px solid $borderColor;
                    }

                    .bottomBox {
                        padding: 20px 20px 10px 20px;

                        .title {
                            font-weight: 700;
                            font-size: 18px;
                            line-height: 20px;
                        }

                        .desc {
                            font-size: 14px;
                            color: gray;
                            line-height: 40px;
                        }

                        .text,
                        .time {
                            font-size: 12px;
                            color: #b8b8b8;
                            padding: 2px 0;
                        }

                        .time {
                            display: flex;
                            justify-content: space-between;

                            .type {
                                color: #2494ff;
                                min-width: 50px;
                                white-space: nowrap;
                            }
                        }
                    }
                }

                .btn {
                    display: flex;
                    align-items: center;
                    border-top: 1px solid $borderColor;
                    // border-right: 1px solid $borderColor;
                    // border-bottom-left-radius: 4px;
                    // border-bottom-right-radius: 4px;

                    div {
                        flex: 1;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        color: gray;

                        &:first-child {
                            border-right: 1px solid $borderColor;
                        }

                        &:hover {
                            color: #2494ff;
                        }
                    }
                }
            }


        }

    }

    .pagination {
        display: flex;
        justify-content: flex-end;
        margin: 10px;
    }
}
</style>