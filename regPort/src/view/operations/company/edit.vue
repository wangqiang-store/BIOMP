<template>
    <el-row>
        <el-col :span="24" class="mb-20">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name:'company' }">入驻创业实体管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24">
            <EntityInfo :form-data="formData" />
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import EntityInfo from '@/baseUI/entityInfo/index.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import useStore from '@/store';
import { storeToRefs } from 'pinia';
let { entityDetails } = storeToRefs(useStore().pageStore);

let formData = ref({});

onMounted(() => {
    formData.value = JSON.parse(JSON.stringify(entityDetails.value));
});
</script>