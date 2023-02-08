<template>
    <!-- 活动详情页面 -->
    <div class="acDetail">
        <!-- 上面部分 -->
        <div class="top">
            <el-image :src="details.coverPath ? fileBaseUrl + details.coverPath : defaultImg" />
            <div class="introduction">
                <div class="title">
                    <span class="text-ellipsis" :title="details.title">{{ details.title }}</span>
                    <span class="ctivityType">{{ activityTypeName }}</span>
                </div>
                <div class="text1">
                    <div class="text-ellipsis" :title="details.introduction">简介: {{ details.introduction }}</div>
                    <div>发布来源: {{ details.sourceName }}</div>
                </div>
                <div class="text2">
                    <div>
                        <el-icon>
                            <Clock />
                        </el-icon>
                        <span>{{ dayjs(details.activityTime).format("YYYY-MM-DD HH:mm") }}</span>
                    </div>
                    <div>
                        <el-icon>
                            <Location />
                        </el-icon>
                        <span>{{ details.address }}</span>
                    </div>
                </div>
            </div>
            <div class="goBackBtn">
                <el-button @click="onGoBack">返 回</el-button>
            </div>
        </div>
        <div class="bottom">
            <div class="left" v-html="details.content">
            </div>
            <div class="right">
                <div class="map">
                    <div class="title">活动地点</div>
                    <reuse-map v-if="details.address" map-id="activityMap" ref="mapRef" :address="details.address"
                        :banAddress="details.address" :position="[details.longitude, details.latitude]"
                        :isShowSearch="false" @on-share="changeShowShareDialog">
                    </reuse-map>
                    <el-dialog title="分享" v-model="shareVisible" width="750px">
                        <Share :linkURL="linkURL" @close="changeShowShareDialog" />
                    </el-dialog>
                </div>
                <div class="file">
                    <div class="title">相关附件</div>
                    <ul class="fileList">
                        <li v-for="(item, index) in details.fileList" :key="index">
                            <span>{{ item.name }}</span>
                            <el-icon @click="onDownload(item)">
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
import { Download, Location, Clock } from "@element-plus/icons-vue"
import defaultImg from "@/assets/u0.svg";
import Share from "@/baseUI/share/index.vue";
import { computed, onMounted, ref } from "vue";
import { getActivityDetailById } from "@/api/activityApi/index"
import { onBeforeRouteLeave, useRoute,useRouter } from "vue-router";
import dayjs from "dayjs"
import { CustomType } from "@/types"
import useStore from "@/store/index"
const { commonStore } = useStore()
const Route = useRoute()
const Router = useRouter()

const fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`;
});

// 分享框数据
let shareVisible = ref(false);
let linkURL = ref('')
const mapRef = ref();
// 分享显示隐藏
const changeShowShareDialog = ({ isShow, position }: { isShow: boolean, position?: Array<number> }) => {
    if (position) {
        let [lng, lat] = position;
        linkURL.value = `https://uri.amap.com/marker?position=${lng},${lat}`
    }
    shareVisible.value = isShow;
}

// 获取详情信息
const details: CustomType = ref({})
const getDetails = async () => {
    let { data } = await getActivityDetailById({ id: Number(Route.query.id) })
    if (data.code === 200) {
        details.value = data.data
        // details.value.coverPath = import.meta.env.VITE_BASE_URL + data.data.coverPath
    }
}

// 下载
const onDownload = (item: any) => {
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = import.meta.env.VITE_BASE_URL + item.path;
    link.setAttribute("download", item.name);
    document.body.appendChild(link);
    link.click();
}

// 返回
const onGoBack = ()=>{
    Router.go(-1)
}

// 活动类型列表
const activityTypeList: CustomType = ref([])
const activityTypeName = computed(() => {
    return activityTypeList.value.filter((item: any) => {
        return details.value.activityType === item.status
    })[0]?.statusName
})


onBeforeRouteLeave(() => {
    commonStore.$patch({
        menuActivePath: "",
    })
})
onMounted(async () => {
    getDetails()
    // 获取活动类型列表
    if (commonStore.activityTypeList.length === 0) {
        await commonStore.getActivityTypeFn()
    }
    activityTypeList.value = commonStore.activityTypeList

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
            width: 300px;
            height: 100%;
            border: 1px solid $borderColor;
        }

        .introduction {
            width: calc((100% - 300px));
            padding-left: 20px;

            .title {
                display: flex;
                align-items: center;
                width: calc(100% - 120px);
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 20px;

                .ctivityType {
                    width: 120px;
                    text-align: center;
                    padding: 5px 10px;
                    margin-left: 20px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #e6a23c;
                    background-color: #fdf6ec;
                    border: 1px solid #e6a23c;
                    border-radius: 20px;
                }
            }

            .text1 {
                font-size: 16px;
                color: #666666;

                div {
                    height: 32px;
                    line-height: 32px;
                }
            }

            .text2 {
                color: #999999;

                div {
                    display: flex;
                    align-items: center;
                    height: 32px;
                    line-height: 32px;

                    .el-icon {
                        margin-right: 5px;
                    }

                }
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
                        cursor: pointer;
                        background-color: #f5f7fa;
                        color: #1890ff;
                    }
                }
            }
        }
    }
}
</style>