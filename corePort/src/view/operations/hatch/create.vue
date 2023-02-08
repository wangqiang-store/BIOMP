<template>
    <el-row>
        <el-col :span="24" class="mb-20">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'hatch' }">孵化基地管理</el-breadcrumb-item>
                <el-breadcrumb-item>新建</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24">
            <BaseInfo :form-data="formData" />
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import BaseInfo from '@/baseUI/BaseInfo/index.vue';
import { ArrowRight } from '@element-plus/icons-vue';

let formData = ref({
    provinceCode: 440000000000,
    cityCode: 440100000000,
});

</script>