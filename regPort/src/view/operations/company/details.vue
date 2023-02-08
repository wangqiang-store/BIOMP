<template>
    <el-row v-if="entityDetails">
        <el-col :span="24">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'company' }">入驻创业实体管理</el-breadcrumb-item>
                <el-breadcrumb-item>详情</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="mt-20">
            <el-descriptions :column="1">
                <template #title>
                    <div class="d_flex d_flex_ac">
                        <h3 class="mr-10">{{ entityDetails.name }}</h3>
                        <el-tag :color="tagColor" :style="{ color: tagTextColor }">{{ entityDetails.typeName }}</el-tag>
                    </div>
                </template>
                <el-descriptions-item>
                    <el-descriptions>
                        <template #title>
                            <h3 class="title">基本信息</h3>
                        </template>
                        <el-descriptions-item label="营业执照">
                            {{ entityDetails.businessLicense || '暂无数据' }}
                        </el-descriptions-item>
                        <el-descriptions-item label="注册日期">
                            {{ customTime(entityDetails.register) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="孵化协议号">{{ entityDetails.protocolNum }}</el-descriptions-item>
                        <el-descriptions-item label="孵化协议期限">{{ customTime(entityDetails.protocolTime) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="用工人数">{{ entityDetails.peopleNum }}</el-descriptions-item>
                        <el-descriptions-item label="入驻基地">{{ entityDetails.incubationBaseName }}</el-descriptions-item>
                        <el-descriptions-item label="入驻基地时间">{{ customTime(entityDetails.baseTime) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="孵化状态">
                            <el-tag>{{ entityDetails.statusName }}</el-tag>
                        </el-descriptions-item>
                    </el-descriptions>
                </el-descriptions-item>

                <el-descriptions-item>
                    <el-descriptions direction="vertical" :column="1">
                        <template #title>
                            <h3 class="title">相关协议附件</h3>
                        </template>
                        <el-descriptions-item>
                            <ul class="fileList">
                                <li v-for="item in entityDetails.fileList" :key="item.id">
                                    <div>
                                        <i class="iconfont icon-file mr-5"></i>
                                        <span>{{ item.name }}</span>
                                    </div>
                                    <el-icon style="cursor: pointer;" @click="onDownload(item)">
                                        <Download />
                                    </el-icon>
                                </li>
                            </ul>
                        </el-descriptions-item>
                    </el-descriptions>
                </el-descriptions-item>
            </el-descriptions>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import { computed, onMounted, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { getEntityDetails } from '@/api/core/hatchEntity';
import { Download } from "@element-plus/icons-vue"
const ROUTE = useRoute();
let entityDetails: Ref<any> = ref(null);
const fileBaseUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}`;
});
// 获取基地详情
const onGetEntityDetails = async () => {
    let id = Number(ROUTE.query.id);
    if (!id) {
        entityDetails.value = null;
        return
    }
    let { data } = await getEntityDetails({ id });
    if (data.code !== 200) return;
    entityDetails.value = data.data;
};

const tagColor = computed(() => {
    if (entityDetails.value !== null) {
        let colorOption = ["#e1e1ff", "#b3f0e1", "#ffe1b3"];
        return colorOption[`${entityDetails.value.type - 1}`]
    }
});
const tagTextColor = computed(() => {
    if (entityDetails.value !== null) {
        let colorOption = ["#9999ff", "#00cc66", "#ff9900"];
        return colorOption[`${entityDetails.value.type - 1}`]
    }
})

const customTime = (time: string): string => {
    return time ? dayjs(time).format("YYYY-MM-DD") : '暂无数据'
}

// 文件下载
const onDownload = (file: { id: number, name: string, path: string }) => {
    let a = document.createElement('a');
    a.download = file.name;
    a.href = fileBaseUrl.value + file.path;
    a.click()
}

onMounted(async () => {
    await onGetEntityDetails();
})
</script>

<style scoped lang="scss">
.title {
    font-weight: bold;
    font-size: 18px;
    border-left: 5px solid #1890ff;
    padding-left: 10px;
}

.fileList {
    li {
        width: 30%;
        min-width: 300px;
        max-width: 500px;
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
</style>