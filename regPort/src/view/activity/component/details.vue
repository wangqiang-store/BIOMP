<template>
    <div class="acDetail" v-if="activityDetails">
        <el-breadcrumb :separator-icon="ArrowRight" class="mb-20">
            <el-breadcrumb-item>活动沙龙</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: parentPageName === '活动中心' ? 'activityCore' : 'activityMine' }">{{
                    parentPageName
            }}</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 上面部分 -->
        <div class="top">
            <el-image style="width: 300px;height: 100%;"
                :src="activityDetails.coverPath ? fileBaseUrl + activityDetails.coverPath : defaultIMG" />
            <div class="introduction">
                <div class="title">
                    <span class="mr-10 text-ellipsis" :title="activityDetails.title">{{ activityDetails.title }}</span>
                    <div class="activityType">{{ activityTypeText }}</div>
                </div>
                <div class="text1 mb-10">
                    <div class="mb-5">简介：{{ activityDetails.introduction }}</div>
                    <div>发布来源：{{ activityDetails.sourceName }}</div>
                </div>
                <div class="text2">
                    <div class="mb-10">
                        <i class="mr-5 iconfont icon-shijian"></i>
                        <span>{{ dayjs(activityDetails.activityTime).format("YYYY-MM-DD HH:mm") }}</span>
                    </div>
                    <div>
                        <i class="mr-5 iconfont icon-wxbdingwei"></i>
                        <span>{{ activityDetails.address }}</span>
                    </div>
                </div>
            </div>
            <div class="goBackBtn">
                <el-button @click="onGoBack">返 回</el-button>
            </div>
        </div>
        <div class="bottom">
            <div class="left" v-html="activityDetails.content"></div>
            <div class="right">
                <div class="map">
                    <div class="title">活动地点</div>
                    <reuse-map map-id="activityMap" ref="mapRef" :address="activityDetails.address"
                        :isShowSearch="false" @on-share="changeShowShareDialog">
                    </reuse-map>
                    <el-dialog title="分享" v-model="shareVisible" width="750px">
                        <Share :linkURL="linkURL" @close="changeShowShareDialog" />
                    </el-dialog>
                </div>
                <div class="file">
                    <div class="title">相关附件</div>
                    <ul class="fileList">
                        <li v-for="item in activityDetails.fileList" :key="item.id">
                            <div>
                                <i class="iconfont icon-file mr-5"></i>
                                <span>{{ item.name }}</span>
                            </div>
                            <el-icon style="cursor: pointer;" @click="onDownload(item)">
                                <Download />
                            </el-icon>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import reuseMap from "@/components/reuseMap/index.vue";
import { Download } from "@element-plus/icons-vue"
import { onMounted, ref, computed } from "vue";
import Share from "@/baseUI/share/index.vue";
import defaultIMG from "@/assets/u0.svg";
import { useRoute, useRouter } from "vue-router";
import dayjs from 'dayjs'
import { getActivityDetails } from "@/api/core/activity";
import { ArrowRight } from '@element-plus/icons-vue';
import useStore from '@/store';
import { storeToRefs } from "pinia";
let { commonStore } = useStore();
let { activityType } = storeToRefs(commonStore);
const ROUTE = useRoute();
const Router = useRouter();
let shareVisible = ref(false);
let linkURL = ref('');
const mapRef = ref();
let activityDetails = ref();
const fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`;
});
const parentPageName = computed(() => {
    if (ROUTE.query.index) {
        let pageName = ["活动中心", "我的活动"];
        return pageName[Number(ROUTE.query.index)]
    }
})
const activityTypeText = computed(() => {
    if (activityDetails.value) {
        return (activityType.value as Array<{ status: number; statusName: string }>).filter((item) => {
            return item.status === activityDetails.value.activityType
        })[0].statusName
    }
})
// 分享显示隐藏
const changeShowShareDialog = ({ isShow, position }: { isShow: boolean, position?: Array<number> }) => {
    if (position) {
        let [lng, lat] = position;
        linkURL.value = `https://uri.amap.com/marker?position=${lng},${lat}`
    }
    shareVisible.value = isShow;
}
// 获取活动详情
const onGetActivityDetails = async () => {
    let id = Number(ROUTE.query.id);
    if (!id) {
        activityDetails.value = null;
        return
    }
    let { data } = await getActivityDetails({ id });
    if (data.code !== 200) return;
    activityDetails.value = data.data;
}

// 文件下载
const onDownload = (file: { id: number, name: string, path: string }) => {
    let a = document.createElement('a');
    a.download = file.name;
    a.href = fileBaseUrl.value + file.path;
    a.click()
}
// 返回
const onGoBack = ()=>{
    Router.go(-1)
}

onMounted(async () => {
    onGetActivityDetails()
    // 获取活动类型
    activityType.value.length === 0 && await commonStore.onGetActivityType();
})
</script>
  
<style scoped lang="scss">
.acDetail {
    .top {
        position: relative;
        display: flex;
        height: 200px;
        padding-bottom: 30px;
        border-bottom: 1px solid $borderColor;

        .el-image {
            border: 1px solid $borderColor;
        }

        .introduction {
            padding-left: 20px;
            width: calc(100% - 300px);

            .title {
                font-size: 24px;
                width: calc(100% - 120px);
                font-weight: 700;
                margin-bottom: 20px;
                display: flex;

                .activityType {
                    min-width: 90px;
                    padding: 5px 15px;
                    border-radius: 24px;
                    color: #e6a23c;
                    border: 1px solid #ebb563;
                    background-color: #fdf6ec;
                    text-align: center;
                    font-size: 14px;
                    cursor: pointer;

                    &:hover {
                        background-color: #e6a23c;
                        color: white;
                    }
                }
            }

            .text1 {
                font-size: 16px;
                color: #666666;
                margin-bottom: 10px;
            }

            .text2 {
                color: #999999;
            }
        }

        .goBackBtn {
            position: absolute;
            top: 0;
            right: 0;
            width: 80px;
            height: 36px;

            .el-button {
                width: 100%;
            }
        }
    }

    .bottom {
        display: flex;
        padding: 30px 0;

        .left {
            flex: 1;
            margin-right: 20px;
            border-right: 1px solid $borderColor;

            &:deep(img) {
                max-width: 100%;
            }
        }

        .right {
            width: 400px;

            .title {
                font-weight: 700;
                margin: 10px 0;

                &::before {
                    content: "";
                    border-left: 10px solid #1890ff;
                    padding-left: 10px;
                }
            }

            .map {
                height: 300px;
            }

            .fileList {
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    height: 30px;
                    line-height: 30px;

                    &:hover {
                        background-color: #f5f7fa;
                        color: #1890ff;
                    }
                }

            }
        }
    }
}
</style>