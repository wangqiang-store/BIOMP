<template>
    <!-- 专家库页面 -->
    <div class="expertPage">
        <div class="page">

            <!-- 搜索 -->
            <div class="search">
                <el-select v-model="mentorType" clearable multiple collapse-tags collapse-tags-tooltip
                    style="width: 250px" placeholder="请选择导师类型">
                    <el-option v-for="item in mentorTypeList" :key="item.status" :label="item.statusName"
                        :value="item.status" />
                </el-select>
                <el-input v-model.trim="content" class="mr-10 ml-10" style="width: 250px" placeholder="请输入姓名、擅长领域关键词" />
                <el-button type="primary" class="mr-10" :icon="Search" @click="onSearch">查询</el-button>
            </div>

            <!-- 专家库列表 -->
            <div class="expertList" v-loading="loading">
                <el-row v-if="listData && listData.length > 0">
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
                                        <div class="title text-ellipsis" :title="item.name">{{ item.name }}</div>
                                        <p class="text-ellipsis" :title="item.workUnit">现工作单位: {{ item.workUnit }}</p>
                                        <p class="text-ellipsis" :title="item.jobs">现任职务: {{ item.jobs }}</p>
                                        <p :title="item.phone">手机电话: {{ item.phone }}</p>
                                        <p class="text-ellipsis">
                                            <el-popover :width="300" placement="bottom-start" :show-arrow="false"
                                                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                                                <template #reference>
                                                    导师类型: {{ item.mentorNamess }}
                                                </template>
                                                <template #default>
                                                    <el-tag v-for="(val, index) in item.mentorNames" :key="index"
                                                        color="#e1e1ff" style="color:#9999ff" class="mr-5 mb-5">{{ val
                                                        }}</el-tag>
                                                </template>
                                            </el-popover>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-empty v-else description="暂无数据" />
            </div>

            <!-- 分页 -->
            <el-pagination v-model:currentPage="pagingParams.page" v-model:page-size="pagingParams.limit"
                :page-sizes="[12, 20, 28]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="onSizeChange" @current-change="onCurrentChange" class="d_flex d_flex_end mt-10" />

        </div>
    </div>
</template>
    
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { Search } from '@element-plus/icons-vue'
import { CustomType } from "@/types"
import { getExpertByPage } from "@/api/expertApi/index"
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store/index"
import avatarImg from "@/assets/u135.png"
const { commonStore } = useStore()

const Router = useRouter()
const Route = useRoute()
let fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`
})


// 搜索以及分页数据
const mentorType = ref<Array<number> | undefined>();
const mentorTypeList = ref() // 导师列表
const content = ref("")
const pagingParams = reactive<{ limit: number; page: number; content: string; mentorType?:string}>({
    limit: 12,
    page: 1,
    content: "",
    mentorType: undefined,
});
const onSizeChange = (limit: number) => {
    pagingParams.limit = limit
    getListData()
}
const onCurrentChange = (page: number) => {
    pagingParams.page = page
    getListData()
}
const onSearch = () => {
    pagingParams.page = 1
    pagingParams.content = content.value
    pagingParams.mentorType = mentorType.value?.join(',');
    getListData()
}


//表格列表数据
const loading = ref(false)
const total = ref(0)
const listData: CustomType = ref();
//获取表格列表数据
const getListData = async () => {
    loading.value = true
    let { data } = await getExpertByPage(pagingParams)
    if (data.code === 200) {
        listData.value = data.data.records.map((item: any) => {
            item.mentorNamess = item.mentorNames.join("、")
            return item
        })
        total.value = data.data.total
    }
    loading.value = false
}

// 查看详情
const goToDetail = (id: any) => {
    commonStore.$patch({
        menuActivePath: Route.path
    })
    Router.push({
        path: "/expert/details",
        query: {
            id
        }
    })
}

onMounted(async () => {
    // 获取导师列表
    if (commonStore.mentorTypeList.length === 0) {
        await commonStore.getMentorTypeFn()
    }
    mentorTypeList.value = commonStore.mentorTypeList

    // 获取表格列表数据
    getListData()
})

</script>
    
<style scoped lang="scss">
.expertPage {
    .page {
        width: 100%;
        margin: 0 auto;
    }

    .search {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }

    .expertList {
        padding: 10px 0;

        .box {
            height: 100%;
            cursor: pointer;
            padding: 10px;


            .box-item {
                position: relative;
                height: 100%;
                border: 1px solid $borderColor;
                box-shadow: $pageBoxShadow;
                border-radius: 4px;

                .top {
                    display: flex;
                    padding: 20px 10px 20px 0;

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

                        .tag {
                            color: #9999ff;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;

                        }

                        .el-tag {
                            color: #9999ff;
                        }
                    }
                }
            }
        }

    }
}
</style>