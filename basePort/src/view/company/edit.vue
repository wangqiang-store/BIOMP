<template>
    <!-- 入住实体管理 - 编辑页面 -->
    <el-row>
        <el-col :span="24">
            <entity-info :form-data="formData"></entity-info>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import EntityInfo from './components/entityInfo.vue';
import { getDetailById } from "@/api/companyApi"
import useStore from '@/store';
import { useRoute } from 'vue-router';
const { commonStore } = useStore()
const Route = useRoute()

let formData = ref({});

onMounted(async () => {
    let { data } = await getDetailById({ id: Number(Route.query.id) })
    if (data.code === 200) {
        formData.value = data.data
    }
});
</script>