<template>
    <!-- 活动编辑 -->
    <create-or-edit :formData="formData" type="edit"></create-or-edit>
</template>
  
<script setup lang="ts">
import createOrEdit from "./components/createOrEdit.vue";
import { CustomType } from "@/types";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getActivityDetailById } from "@/api/activityApi/index"
const Route = useRoute();

// 表单数据
const formData: CustomType = ref({});
const getformData = async () => {
    let { data } = await getActivityDetailById({ id: Number(Route.query.id) })
    if (data.code === 200) {
        formData.value = data.data
    }
}


onMounted(() => {
    // 表单数据
    getformData()
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
  