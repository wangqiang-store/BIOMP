<template>
    <CreateEdit :formData="formData" type="edit" />
</template>
  
<script setup lang="ts">
import { CustomType } from "@/types";
import { ref, onMounted } from "vue";
import CreateEdit from "../component/createEdit.vue";
import useStore from "@/store";
import { storeToRefs } from "pinia";
let { activityDetails } = storeToRefs(useStore().pageStore)

// 表单数据
let formData: CustomType = ref({});
onMounted(() => {
    formData.value = JSON.parse(JSON.stringify(activityDetails.value))
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
  