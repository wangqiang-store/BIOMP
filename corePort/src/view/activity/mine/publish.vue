<template>
    <CreateEdit :formData="formData" type="create" />
</template>
  
<script setup lang="ts">
import { CustomType } from "@/types";
import { ref } from "vue";
import CreateEdit from "../component/createEdit.vue";

// 表单数据
let formData: CustomType = ref({
    content: "这是发布活动"
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
  