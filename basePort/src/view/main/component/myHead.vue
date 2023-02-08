<template>
    <div class="head d_flex d_flex_ac d_flex_sb">
        <h3 class="head-title">{{ text }}</h3>
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';

interface Props {
    text: string
}

let props = withDefaults(defineProps<Props>(), {
    text: ''
})

let { text } = toRefs(props);
</script>

<style scoped lang="scss">
.head {
    padding: 15px 20px;
    border-bottom: 1px solid $borderColor;
}
</style>