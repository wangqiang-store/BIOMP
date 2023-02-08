<template>
    <!-- 专家库页面 -->
    <div class="expertPage">
        <div class="page">

            <!-- 搜索 -->
            <div class="search mr-10 mt-20">
                <el-select v-model="selectMentorType" multiple collapse-tags collapse-tags-tooltip clearable
                    placeholder="请选择导师类型">
                    <el-option v-for="item in mentorTypeList" :key="item.status" :label="item.statusName"
                        :value="item.status" />
                </el-select>
                <el-input v-model.trim="content" class="mr-10 ml-10" style="width: 250px" placeholder="请输入姓名、擅长领域关键词" />
                <el-button type="primary" :icon="Search" @click="onSearch">查询</el-button>
            </div>

            <!-- 专家库列表 -->
            <div class="expertList" v-loading="expertLoading">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <div class="box">
                            <div class="box-item d_flex" style="border: 1px dashed #dddddd;" @click="onCreate">
                                <p class="w-100 mt-20 d_flex d_flex_ac d_flex_c createWork">
                                    <el-icon class="mr-5">
                                        <Plus />
                                    </el-icon>
                                    新增专家
                                </p>
                            </div>
                        </div>
                    </el-col>
                    <el-col v-for="(item, index) in listData" :key="index" @click="goToDetail(item.id)" :xs="24"
                        :sm="24" :md="12" :lg="6">
                        <div class="box">
                            <div class="box-item">
                                <div class="top">
                                    <div class="avatar">
                                        <el-image style="width: 80px; height: 80px"
                                            :src="item.filePath ? fileBaseUrl + item.filePath : avatarImg" />
                                    </div>
                                    <div class="content">
                                        <div class="title text-ellipsis pr-10" :title="item.name">{{ item.name }}</div>
                                        <p class="text-ellipsis  pr-10" :title="item.workUnit">现工作单位: {{ item.workUnit
                                        }}</p>
                                        <p class="text-ellipsis  pr-10" :title="item.jobs">现任职务: {{ item.jobs }}</p>
                                        <p class="text-ellipsis  pr-10" :title="item.phone">手机电话: {{ item.phone }}</p>
                                        <p class="pr-10">
                                            <el-popover :width="300" placement="bottom"
                                                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                                                <template #reference>
                                                    <p class="text-ellipsis"
                                                        style="width: max-content;max-width: 100%;">导师类型: {{
                                                                item.mentorNamess
                                                        }}</p>
                                                </template>
                                                <template #default>
                                                    <el-tag v-for="(val, index) in item.mentorNames" :key="index"
                                                        color="#e1e1ff" style="color:#9999ff;border: none;"
                                                        class="mr-5 mb-5">{{ val
                                                        }}</el-tag>
                                                </template>
                                            </el-popover>
                                        </p>
                                    </div>

                                </div>
                                <div class="btn">
                                    <div @click.stop="onEdit(item.id as number)">编辑</div>
                                    <div @click.stop="onDelete(item.id as number)">删除</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <!-- 分页 -->
            <el-pagination v-model:currentPage="pagingParams.page" v-model:page-size="pagingParams.limit"
                :page-sizes="[11, 19, 27]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="onSizeChange" @current-change="onCurrentChange" class="d_flex d_flex_end mt-10 mb-20" />

        </div>
    </div>
</template>
    
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from "vue-router";
import avatarImg from '@/assets/noUser.png'
import useStore from "@/store/index"
import { getPagingExpertData, getExpertDetails, deleteExpert } from '@/api/core/database'
import { ExpertPaging } from '@/api/type';
import { storeToRefs } from "pinia";
import { ExpertInfo } from '@/api/type'
const { commonStore, pageStore } = useStore();
let { mentorType } = storeToRefs(commonStore);
const ROUTER = useRouter()
const ROUTE = useRoute()
let fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`
})


// 搜索以及分页数据
let selectMentorType = ref<Array<number> | null>([]);
let content = ref("");
let expertLoading = ref(false);
let mentorTypeList = ref<Array<{ status: number; statusName: string }>>([])
const pagingParams: ExpertPaging = reactive({
    limit: 11,
    page: 1,
    content: "",
    mentorType: undefined,
});

//表格列表数据
const total = ref(0)
const listData = ref<Array<ExpertInfo>>([]);
//获取表格列表数据
const onGetPagingData = async (params: ExpertPaging) => {
    expertLoading.value = true;
    let { data } = await getPagingExpertData(params);
    if (data.code !== 200) {
        expertLoading.value = false;
        return;
    }
    expertLoading.value = false;
    listData.value = data.data?.records.map((item: any) => {
        item.mentorNamess = item.mentorNames.join("、")
        return item
    });
    total.value = data.data?.total;
}
// 切换分页个数
const onSizeChange = (limit: number) => {
    pagingParams.limit = limit;
    pagingParams.page = 1;
    onGetPagingData(pagingParams);
}
// 切换分页页数
const onCurrentChange = (page: number) => {
    pagingParams.page = page;
    onGetPagingData(pagingParams);
}
// 搜索
const onSearch = () => {
    pagingParams.content = content.value;
    pagingParams.mentorType = selectMentorType.value?.join(",");
    onGetPagingData(pagingParams);
}

// 新增
const onCreate = () => {
    ROUTER.push({ name: "databaseCreate" });
    pageStore.$patch((state) => {
        state.expertDetails = {}
    })
};

// 编辑
const onEdit = async (id: number) => {
    let { data } = await getExpertDetails({ id });
    if (data.code !== 200) return;
    ROUTER.push({ name: "databaseEdit" });
    pageStore.$patch((state) => {
        state.expertDetails = data.data
    })
}

// 查看详情
const goToDetail = (id: any) => {
    ROUTER.push({ name: "databaseDetails", query: { id } })
}
// 删除
const onDelete = (id: number) => {
    ElMessageBox.confirm(
        '是否删除专家信息?',
        '删除提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let { data } = await deleteExpert({ id });
            if (data.code !== 200) return
            ElMessage({
                message: "删除成功",
                type: "success"
            })
            onGetPagingData(pagingParams)
        })
        .catch(() => { })
}

onMounted(async () => {
    onGetPagingData(pagingParams)
    if (mentorType.value.length === 0) await commonStore.onGetMentorType();
    mentorTypeList.value = mentorType.value;
})

</script>
    
<style scoped lang="scss">
.expertPage {
    position: relative;
    padding: 0 20px;

    .page {
        width: 100%;
        // margin: 0 auto;
    }

    .search {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }

    .expertList {
        padding: 10px 0;

        .first {
            height: 100%;
        }

        .box {
            height: 100%;
            cursor: pointer;
            padding: 10px;


            .box-item {
                position: relative;
                height: 240px;
                padding-bottom: 40px;
                border: 1px solid $borderColor;
                box-shadow: $pageBoxShadow;
                border-radius: 4px;


                .top {
                    display: flex;
                    padding: 20px 0;

                    .avatar {
                        display: flex;
                        justify-content: center;
                        width: 120px;

                        .el-image {
                            border-radius: 50%;
                        }
                    }

                    .content {
                        width: calc(100% - 120px);

                        .title {
                            font-size: 18px;
                            font-weight: 700;
                            padding-bottom: 10px;
                        }

                        p {
                            margin-bottom: 8px;
                        }

                        .el-tag {
                            color: #9999ff;

                        }
                    }
                }

                .btn {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    border-top: 1px solid $borderColor;
                    background-color: #f7f9fa;

                    div {
                        flex: 1;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        color: gray;

                        // border-left: 1px solid $borderColor;
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
}
</style>