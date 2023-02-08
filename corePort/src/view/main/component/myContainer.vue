<template>
    <el-row class="container">
        <el-col :span="24" :xs="24" class="overview">
            <slot></slot>

        </el-col>
    </el-row>
</template>
<script lang="ts" setup>

</script>

<style scoped lang="scss">
.container {
    background-color: #fff;
    // border: 1px solid $boxBorderColor;
    // border-radius: $homeborderRadius;
    // box-shadow: $homeBoxShadow;
}
</style>