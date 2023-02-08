<template>
    <el-row>
        <el-col :span="24" class="mb-20">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'company' }">入驻创业实体管理</el-breadcrumb-item>
                <el-breadcrumb-item>新建</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24">
            <EntityInfo :form-data="formData" />
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import EntityInfo from '@/baseUI/entityInfo/index.vue';
import { ArrowRight } from '@element-plus/icons-vue';

let formData = ref({});
</script>