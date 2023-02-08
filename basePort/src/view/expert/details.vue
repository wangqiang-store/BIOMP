<template>
    <div class="expertDatailPage">
        <div>
            <div class="header">
                <div class="leftBox d_flex">
                    <el-image style="width: 100px; height: 100px"
                        :src="detailData.filePath ? fileBaseUrl + detailData.filePath : avatarImg" />

                    <div class="text">
                        <div class="name text-ellipsis" :title="detailData.name">{{ detailData.name }}</div>
                        <div class="info">
                            <div class="text-ellipsis">{{ detailData.genderName }}</div>

                            <div class="text-ellipsis">
                                <span class="bar">|</span>
                                <span :title="detailData.education">{{ detailData.education || '暂无数据' }}</span>
                            </div>
                            <div class="text-ellipsis">
                                <span class="bar">|</span>
                                <span :title="detailData.graduatedMajor">{{ detailData.graduatedMajor || '暂无数据'
                                }}</span>
                            </div>
                            <div class="text-ellipsis">
                                <span class="bar">|</span>
                                <span :title="detailData.graduatedSchool">{{ detailData.graduatedSchool || '暂无数据'
                                }}</span>
                            </div>
                        </div>
                        <div class="teacherType">
                            导师类型：
                            <el-tag v-for="(item, index) in detailData.mentorNames" :key="index" color="#e1e1ff"
                                class="mr-5 mb-5" style="color:#9999ff">{{ item }}</el-tag>
                        </div>
                    </div>
                </div>
                <div style="height: 30px;">
                    <el-button @click="goBack">返回</el-button>
                </div>

            </div>

            <!-- 个人信息 -->
            <div class="personal">
                <div class="title">个人信息</div>
                <el-descriptions>
                    <el-descriptions-item label="手机号码">
                        <span :title="detailData.phone">{{ detailData.phone || "暂无数据" }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="身份证号码">
                        <span :title="detailData.idCard">{{ detailData.idCard || "暂无数据" }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="政治面貌">
                        <span :title="detailData.political">{{ detailData.political || "暂无数据" }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="职称">
                        <span :title="detailData.jobTitle">{{ detailData.jobTitle || "暂无数据" }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="技能等级">
                        <span :title="detailData.skillLevel">{{ detailData.skillLevel || "暂无数据" }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="现工作单位">
                        <span :title="detailData.workUnit">{{ detailData.workUnit || "暂无数据" }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="现任职务">
                        <span :title="detailData.jobs">{{ detailData.jobs || "暂无数据" }}</span>
                    </el-descriptions-item>
                </el-descriptions>
            </div>

            <div class="working">
                <div class="title">工作经历</div>
                <!-- <div v-if="workData.length > 0" class="list"> -->
                <!-- <div>{{ item.name }}</div>
                    <div>{{ item.position }}</div>
                    <div>{{ dayjs(item.workingTime[0]).format("YYYY-MM") }} - {{
                            dayjs(item.workingTime[1]).format("YYYY-MM")
                    }}
                    </div> -->
                <el-descriptions v-if="workData.length > 0">
                    <template v-for="(item, index) in workData" :key="index">
                        <el-descriptions-item>
                            <div>{{ item.name }}</div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <div>{{ item.position }}</div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <div>{{ dayjs(item.workingTime[0]).format("YYYY.MM") }} - {{ item.isSToday ? "至今" :
                                    dayjs(item.workingTime[1]).format("YYYY.MM")
                            }}
                            </div>
                        </el-descriptions-item>
                    </template>
                </el-descriptions>
                <!-- </div> -->
                <el-empty v-else description="暂无数据" />
            </div>
            <div>
                <div class="title">社会服务及荣誉</div>
                <pre v-if="detailData.serviceAndHonors">{{ detailData.serviceAndHonors }}</pre>
                <el-empty v-else description="暂无数据" />
            </div>
            <div>
                <div class="title">就业创业指导工作</div>
                <pre>{{ detailData.guidanceWorkExperience }}</pre>
            </div>
            <div>
                <div class="title">擅长领域</div>
                <pre>{{ detailData.areasOfExpertise }}</pre>
            </div>
        </div>

    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { getExpertDetailById } from "@/api/expertApi/index"
import { dayjs } from "element-plus";
import avatarImg from "@/assets/u135.png"
import useStore from "@/store/index";
const { commonStore } = useStore();
const Router = useRouter()
const Route = useRoute()
let fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`
})

// 专家详情数据
const detailData: any = ref({})
const workData: any = ref([])
const goBack = () => {
    Router.go(-1)
}
onMounted(async () => {
    // 获取专家详情
    let id = Number(Route.query.id)
    let { data } = await getExpertDetailById({ id })
    if (data.code === 200) {
        detailData.value = data.data
        workData.value = data.data.workExperience ? JSON.parse(data.data.workExperience) : []
    }
})
onBeforeRouteLeave(() => {
    commonStore.$patch({
        menuActivePath: ""
    })
})
</script>
  
<style scoped lang="scss">
pre {
    white-space: break-spaces;
    word-break: break-all;
}

.expertDatailPage {
    .title {
        position: relative;
        margin: 60px 0 20px 0;
        font-size: 18px;
        font-weight: 700;

        &::before {
            content: "";
            height: 100%;
            margin-right: 10px;
            border-left: 3px solid #3a8ee6;
        }
    }

    &>div {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .bar {
                position: relative;
                top: -2px;
                padding: 0 10px;
            }

            .leftBox {
                .el-image {
                    border-radius: 50%;
                    margin-right: 10px;
                    border: 1px solid $borderColor;
                }

                .text {
                    width: calc(100% - 110px);

                    .name {
                        max-width: 200px;
                        font-size: 24px;
                    }

                    .info {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        margin: 10px 0;
                        white-space: break-spaces;

                        &>div {
                            max-width: 200px;
                        }
                    }
                }
            }

            .backBtn {
                display: inline-block;
                width: 100px;
                height: 50px;
                position: relative;
                font-size: 17px;
                text-transform: uppercase;
                text-decoration: none;
                border-radius: 6em;
                transition: all .2s;
                border: none;
                font-family: inherit;
                font-weight: 500;
                cursor: pointer;
                color: black;
                background-color: #e8e8e8;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

                &:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }

                &:active {
                    transform: translateY(-1px);
                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                }

                &::after {
                    content: "";
                    display: inline-block;
                    height: 100%;
                    width: 100%;
                    border-radius: 100px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: -1;
                    transition: all .4s;
                }

                &::after {
                    background-color: #e8e8e8;
                }

                &:hover::after {
                    transform: scaleX(1.4) scaleY(1.6);
                    opacity: 0;
                }
            }
        }

        .personal {
            :deep(.el-descriptions tr) {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            :deep(.el-descriptions__cell) {
                display: inline-block;
                width: 350px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .working {
            .list {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 36px;
                padding: 0 10px;
                margin-top: 10px;
                border-bottom: 1px solid $borderColor;
            }

            :deep(.el-descriptions tr) {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            :deep(.el-descriptions__cell) {
                display: inline-block;
                width: 350px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
  