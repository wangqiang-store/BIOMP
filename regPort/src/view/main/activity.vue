<template>
    <my-container class="mt-20">
        <my-head text="活动沙龙">
            <el-button type="primary" text @click="goToActivity">查看全部</el-button>
        </my-head>

        <el-row v-if="activityList.length > 0">
            <el-col v-for="(item, index) in activityList" :key="index" :span="12" :xs="24" :sm="12" :md="12">
                <div class="box">
                    <div class="box-container">
                        <div class="box-item" @click.stop="goToDetail(item)">
                            <el-image :src="item.coverPath ? fileBaseUrl + item.coverPath : defaultIMG" />
                            <div class="bottomBox">
                                <div class="title text-ellipsis" :title="item.title">{{ item.title }}</div>
                                <div class="desc text-ellipsis" :title="item.introduction">{{ item.introduction }}</div>
                                <div class="text text-ellipsis" :title="item.sourceName">
                                    发布来源:
                                    <span>{{ item.sourceName }}</span>
                                </div>
                                <div class="time">
                                    <div class="text-ellipsis">
                                        活动时间： {{ dayjs(item.activityTime).format("YYYY-MM-DD HH:mm:ss") }}
                                    </div>
                                </div>
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
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import MyContainer from './component/myContainer.vue';
import MyHead from './component/myHead.vue';
import defaultIMG from "@/assets/u0.svg";
import { pagingActivityParams } from "@/api/type";
import { getPagingActivity } from "@/api/core/activity";

const ROUTER = useRouter();

let fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`
})

let pagingParams: pagingActivityParams = reactive({
    page: 1,
    limit: 6,
    content: "",
    activityType: undefined
})
let activityList = ref<Array<any>>([]);

// 获取页面数据
const getData = async (params: pagingActivityParams) => {
    let { data } = await getPagingActivity(params);
    if (data.code !== 200) return;
    activityList.value = data.data?.records;
}

const goToActivity = () => {
    ROUTER.push({ name: "activity" })
}

const goToDetail = (data: { id: number }) => {
    ROUTER.push({ name: "activityDetails", query: { id: data.id, index: 0 } })
}

onMounted(() => {
    getData(pagingParams)
})
</script>

<style scoped lang="scss">
.el-col {
    border-right: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;

    &:nth-child(2n) {
        border-right: none;
    }

    &:nth-child(n+5) {
        border-bottom: none;
    }
}

.box {
    cursor: pointer;
    // padding: 10px;

    .box-container {
        // box-shadow: $homeBoxShadow;

        .box-item {
            // border: 1px solid $borderColor;
            // border-radius: 4px;
            padding: 20px;
            // border-right: 1px solid $borderColor;
            // border-bottom: 1px solid $borderColor;
            display: flex;

            .el-image {
                // border-bottom: 1px solid $borderColor;
                width: 40%;
                min-width: 150px;
                height: 180px;
            }

            .bottomBox {
                flex: 1;
                width: calc(100% - 40%);
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
    }
}
</style>