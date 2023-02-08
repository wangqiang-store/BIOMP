<template>
    <!-- 新建活动页面 -->
    <create-or-edit :formData="formData" type="create"></create-or-edit>
</template>
  
<script setup lang="ts">
import createOrEdit from "./components/createOrEdit.vue";
import { CustomType } from "@/types";
import { ref, onMounted } from "vue";

// 表单数据
const formData: CustomType = ref({});

onMounted(() => {

});
</script>
  
<style scoped lang="scss">
.activityInfoPage {
    padding: 20px 80px;

    .title {
        font-size: 16px;
        font-weight: 700;
    }

    .formClass {
        padding: 20px 0;
        margin: auto;
        max-width: 1100px;
        min-width: 700px;
    }

    .btn {
        display: flex;
        justify-content: center;
    }

    .address {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
}
</style>
  