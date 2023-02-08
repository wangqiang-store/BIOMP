<template>
    <!-- 入住实体管理 - 详情页面 -->
    <el-row>
        <el-col :span="24" class="mt-20">
            <el-descriptions :column="1">
                <template #title>
                    <div class="titleName">
                        <h3 class="mr-10">{{entityDetails.name}}</h3>
                        <el-tag :color="tagColor" :style="{color:tagTextColor}">{{entityDetails.typeName}}</el-tag>
                    </div>
                </template>
                <el-descriptions-item>
                    <el-descriptions>
                        <template #title>
                            <h3 class="title">基本信息</h3>
                        </template>
                        <el-descriptions-item label="营业执照">
                            {{entityDetails.businessLicense}}
                        </el-descriptions-item>
                        <el-descriptions-item label="注册日期">
                            {{formatTime(entityDetails.register)}}
                        </el-descriptions-item>
                        <el-descriptions-item label="孵化协议号">{{entityDetails.protocolNum}}</el-descriptions-item>
                        <el-descriptions-item label="孵化协议期限">{{formatTime(entityDetails.protocolTime)}}
                        </el-descriptions-item>
                        <el-descriptions-item label="用工人数">{{entityDetails.peopleNum}}</el-descriptions-item>
                        <el-descriptions-item label="入驻基地">{{entityDetails.incubationBaseName}}</el-descriptions-item>
                        <el-descriptions-item label="入驻基地时间">{{formatTime(entityDetails.baseTime)}}
                        </el-descriptions-item>
                        <el-descriptions-item label="孵化状态">
                            <el-tag>{{entityDetails.statusName}}</el-tag>
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
                                <li v-for="(item,index) in entityDetails.fileList" :key="index">
                                    <span>{{item.name}}</span>
                                    <el-icon @click="onDownload(item)">
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
import useStore from '@/store';
import { Download } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { getDetailById } from '@/api/companyApi';
import dayjs from 'dayjs';

const { commonStore } = useStore();
const Route = useRoute();
let entityDetails: any = ref({});
let entityTypeList = ref<Array<any>>([]); //实体类型列表

// 获取基地详情
const onGetEntityDetails = async () => {
    let id = Number(Route.query.id)
    let { data } = await getDetailById({ id });
    if (data.code !== 200) return;
    entityDetails.value = data.data;
};

// 格式化时间
const formatTime = (time: string): string => {
    return time ? dayjs(time).format("YYYY-MM-DD") : '暂无数据'
}



const tagColor = computed(() => {
    if (entityDetails.value !== null) {
        let colorOption = ["#e1e1ff", "#b3f0e1"];
        return colorOption[`${entityDetails.value.type - 1}`]
    }
});
const tagTextColor = computed(() => {
    if (entityDetails.value !== null) {
        let colorOption = ["#9999ff", "#00cc66"];
        return colorOption[`${entityDetails.value.type - 1}`]
    }
})
const incubationStatusName = computed(() => {
    if (entityDetails.value !== null) {
        if (entityTypeList.value.length > 0) {
            return entityTypeList.value.filter((item: any) => {
                return item.status === entityDetails.value.status
            })[0]?.statusName
        }
    }
})


// 附件下载
const onDownload = (item: any) => {
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = import.meta.env.VITE_BASE_URL + item.path;
    link.setAttribute("download", item.name);
    document.body.appendChild(link);
    link.click();
}

onMounted(async () => {
    await onGetEntityDetails();
    // 获取实体类型列表
    if (commonStore.entityTypeList.length === 0) {
        await commonStore.getEntityTypeFn()
    }
    entityTypeList.value = commonStore.entityTypeList
})

onBeforeRouteLeave(() => {
    commonStore.$patch({
        menuActivePath: "",
    })
})
</script>

<style scoped lang="scss">
.title {
    font-weight: bold;
    font-size: 18px;
    border-left: 5px solid #1890ff;
    padding-left: 10px;
}

.titleName{
    display: flex;
    align-items: center;
}
.fileList {
    width: 300px;

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

        .el-icon {
            cursor: pointer;
        }
    }

}
</style>