<template>
    <my-container class="mt-20">
        <my-head text="专家名片">
            <el-button type="primary" text @click="goToBataBase">查看全部</el-button>
        </my-head>

        <el-row v-if="expertList.length > 0">
            <el-col v-for="(item, index) in expertList" :key="index" @click="goToDetail(item.id)" :xs="24"
                :sm="24" :md="12" :lg="6">
                <div class="box">
                    <div class="box-item">
                        <div class="top">
                            <div class="avatar">
                                <el-image style="width: 50px; height: 50px"
                                    :src="item.filePath ? fileBaseUrl + item.filePath : avatarImg" />
                                <div class="title text-ellipsis pr-10" :title="item.name">{{ item.name }}</div>
                            </div>
                            <div class="content">
                                <p class="text-ellipsis  pr-10" :title="item.workUnit">现工作单位: {{ item.workUnit
                                }}</p>
                                <p class="text-ellipsis  pr-10" :title="item.jobs">现任职务: {{ item.jobs }}</p>
                                <p class="text-ellipsis  pr-10" :title="item.phone">手机电话: {{ item.phone }}</p>
                                <p class="pr-10">
                                    <el-popover :width="300" placement="bottom"
                                        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                                        <template #reference>
                                            <p class="text-ellipsis" style="width: max-content;max-width: 100%;">导师类型:
                                                {{
                                                        item.mentorNames.join('、')
                                                }}</p>
                                        </template>
                                        <template #default>
                                            <el-tag v-for="(val, index) in item.mentorNames" :key="index"
                                                color="#e1e1ff" style="color:#9999ff;border: none;" class="mr-5 mb-5">
                                                {{ val }}</el-tag>
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
    </my-container>
</template>
<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue';
import MyContainer from './component/myContainer.vue';
import MyHead from './component/myHead.vue';
import avatarImg from "@/assets/u135.png";
import { useRouter } from 'vue-router';
import { getExpertByPage } from "@/api/expertApi/index"
import useStore from "@/store/index"
const { commonStore } = useStore()

const ROUTER = useRouter();
let fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`
})
const pagingParams = reactive({
    limit: 8,
    page: 1,
    content: "",
    mentorType: undefined,
});
let expertList = ref<Array<any>>([]);

//获取表格列表数据
const getListData = async () => {
    let { data } = await getExpertByPage(pagingParams)
    if (data.code === 200) {
        expertList.value = data.data.records.map((item: any) => {
            item.mentorNamess = item.mentorNames.join("、")
            return item
        })
    }
}

// 跳转专家库
const goToBataBase = () => {
    ROUTER.push({ path: "/expert" })
};
// 查看详情
const goToDetail = (id: any) => {
    ROUTER.push({
        path: "/expert/details",
        query: {
            id
        }
    })
    commonStore.$patch({
        menuActivePath: "/expert"
    })
}

onMounted(() => {
    getListData()
})
</script>

<style scoped lang="scss">
.el-col  {
    border-right: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;

    &:nth-child(4n) {
        border-right: none;
    }
    &:nth-child(n+5) {
        border-bottom: none;
    }
}

.box {
    height: 100%;
    cursor: pointer;
    // padding: 10px;



    .box-item {
        // border: 1px solid $borderColor;
        // box-shadow: $homeBoxShadow;
        // border-radius: 4px;

        // border-right: 1px solid $borderColor;
        // border-bottom: 1px solid $borderColor;
        // &:nth-child(2n){
        //     border-right: none;
        // }


        .top {
            padding: 20px;

            .avatar {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 10px;

                .title {
                    flex: 1;
                    width: calc(100% - 50px);
                }

                .el-image {
                    border-radius: 50%;
                    margin-right: 10px;
                }
            }

            .content {
                width: 100%;
                color: rgb(141, 141, 141);

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
    }
}
</style>