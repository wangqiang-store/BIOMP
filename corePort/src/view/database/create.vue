<template>
    <el-row class="p-20">
        <el-col :span="24" class="mb-20">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ name: 'database' }">创业专家导师库</el-breadcrumb-item>
                <el-breadcrumb-item>新增专家导师</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24">
            <DatabaseInfo :form-data="formData" />
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import DatabaseInfo from '@/baseUI/databaseInfo/index.vue'
import { ArrowRight } from '@element-plus/icons-vue';

let formData = ref({});
</script>

<style scoped lang="scss">

</style>