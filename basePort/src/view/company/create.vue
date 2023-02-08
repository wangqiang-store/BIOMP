<template>
    <!-- 入住实体管理 - 添加页面 -->
    <el-row>
        <el-col :span="24">
            <EntityInfo :form-data="formData" />
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import EntityInfo from './components/entityInfo.vue';
import useStore from '@/store';
const { commonStore } = useStore()
const { baseUserInfo } = commonStore

let formData:any = ref({});
onMounted(()=>{
    formData.value.incubationBaseId = baseUserInfo.incubationBaseId
    formData.value.incubationBaseName = baseUserInfo.incubationBaseName
})
</script>