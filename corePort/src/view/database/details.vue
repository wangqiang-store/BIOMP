<template>
    <div class="expertDatailPage pt-20 mt-20">
        <div v-if="expertDetails">
            <div class="header">
                <div class="leftBox d_flex d_flex_ac">
                    <el-image style="width: 100px; height: 100px"
                        :src="expertDetails.filePath ? fileBaseUrl + expertDetails.filePath : avatarImg" />
                    <div class="text">
                        <div class="name text-ellipsis" :title="expertDetails.name">{{ expertDetails.name }}</div>
                        <div class="info">
                            <span>{{ expertDetails.genderName }}</span>
                            <span class="partingLine text-ellipsis" :title="expertDetails.education || ''">{{
                                    expertDetails.education || '暂无数据'
                            }}</span>
                            <span class="partingLine text-ellipsis" :title="expertDetails.graduatedMajor || ''">{{
                                    expertDetails.graduatedMajor || '暂无数据'
                            }}</span>
                            <span class="partingLine text-ellipsis" :title="expertDetails.graduatedSchool || ''">{{
                                    expertDetails.graduatedSchool || '暂无数据'
                            }}</span>
                        </div>
                        <div class="teacherType">
                            导师类型：
                            <el-tag v-for="item of expertDetails.mentorNames" color="#e7e7ff"
                                style="color: #adadff;border: none;" class="mr-5 mb-5">{{ item
                                }}</el-tag>
                        </div>
                    </div>
                </div>
                <!-- <button class="backBtn" @click="goBack">返回</button> -->
                <el-button @click="goBack">返回</el-button>
            </div>

            <!-- 个人信息 -->
            <div class="personal">
                <div class="title">个人信息</div>
                <el-descriptions>
                    <el-descriptions-item label="手机号码">
                        <span :title="expertDetails.phone">{{ expertDetails.phone }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="身份证号码">
                        <span :title="expertDetails.idCard">{{ expertDetails.idCard || '暂无数据' }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="政治面貌">
                        <span :title="expertDetails.political">{{ expertDetails.political || '暂无数据' }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="职称">
                        <span :title="expertDetails.jobTitle">{{ expertDetails.jobTitle || '暂无数据' }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="技能等级">
                        <span :title="expertDetails.skillLevel">{{ expertDetails.skillLevel || '暂无数据' }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="现工作单位">
                        <span :title="expertDetails.workUnit">{{ expertDetails.workUnit || '暂无数据' }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="现任职务">
                        <span :title="expertDetails.jobs">{{ expertDetails.jobs }}</span>
                    </el-descriptions-item>
                </el-descriptions>
            </div>

            <div class="working">
                <div class="title">工作经历</div>
                <!-- <div v-if="workData.length > 0">
                    <div class="list" v-for="(item, index) in workData" :key="index">
                        <div class="listTitle" :title="item.name">{{ item.name }}</div>
                        <div class="listTitle" :title="item.position">{{ item.position }}</div>
                        <div>
                            <span>{{ dayjs(item.workingTime[0]).format("YYYY.MM") }} - {{
                                    dayjs(item.workingTime[1]).format("YYYY.MM")
                            }}</span>
                        </div>
                    </div>
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
                <el-empty v-else description="暂无数据" />
            </div>
            <div>
                <div class="title">社会服务及荣誉</div>
                <pre class="textarea" v-if="expertDetails.serviceAndHonors">{{ expertDetails.serviceAndHonors }}</pre>
                <el-empty v-else description="暂无数据" />
            </div>
            <div>
                <div class="title">就业创业指导工作</div>
                <pre class="textarea">{{ expertDetails.guidanceWorkExperience }}</pre>
            </div>
            <div>
                <div class="title">擅长领域</div>
                <pre class="textarea">{{ expertDetails.areasOfExpertise }}</pre>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import avatarImg from "@/assets/noUser.png";
import { ExpertInfo } from '@/api/type';
import dayjs from 'dayjs';
import { getExpertDetails } from '@/api/core/database';
const ROUTER = useRouter();
const ROUTE = useRoute();
let fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`
})

// 导师详情数据
let expertDetails = ref<ExpertInfo | null>(null);
// 工作数据
const workData = ref<Array<{ name: string; position: string; workingTime: Array<string>; isSToday: boolean }>>([]);
// 获取导师详请数据
const onGetExpertDetails = async () => {
    if (!ROUTE.query.id) {
        expertDetails.value = {}
        return
    }
    let { data } = await getExpertDetails({ id: Number(ROUTE.query.id) });
    if (data.code !== 200) return;
    expertDetails.value = data.data;
    workData.value = data.data.workExperience ? JSON.parse(data.data.workExperience) : []
};
const goBack = () => {
    ROUTER.go(-1)
}

onMounted(() => {
    onGetExpertDetails()
})
</script>
  
<style scoped lang="scss">
.expertDatailPage {
    padding-bottom: 60px;

    .title {
        position: relative;
        margin: 50px 0 30px 0;
        font-size: 20px;
        font-weight: bold;

        &::before {
            content: "";
            height: 100%;
            border-left: 5px solid #1890ff;
            padding-left: 10px;
        }
    }

    &>div {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;

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
                        color: #5a5e61;
                        font-size: 24px;
                    }

                    .info {
                        color: #353535;
                        display: flex;
                        align-items: center;
                        margin: 20px 0;
                        white-space: nowrap;

                        .partingLine {
                            display: inline-block;
                            max-width: 200px;

                            &::before {
                                content: "";
                                height: 100%;
                                border-right: 2px solid #a3a494;
                                margin: 0 5px;
                            }
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

        .working {
            .list {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 36px;
                padding: 0 10px;
                margin-top: 10px;
                border-bottom: 1px solid $borderColor;

                // .listTitle {
                //     font-size: 16px;
                //     font-weight: bold;
                // }
            }
        }
    }

    .textarea {
        white-space: break-spaces;
        word-break: break-all;
        line-height: 1.5;
    }

    &:deep(.el-descriptions tr) {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &:deep(.el-descriptions__cell) {
        width: 350px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
    }
}
</style>
  