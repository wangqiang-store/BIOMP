<template>
    <my-container>
        <my-head text="入孵实体数据"></my-head>

        <div class="overview-main">
            <div v-for="item of entityData" :key="item.text">
                <div class="d_flex" style="cursor: pointer;">
                    <div class="d_flex d_flex_column d_flex_c ml-10 info">
                        <p class="mb-10">{{ item.text }}</p>
                        <p class="tac">{{ item.count }}</p>
                    </div>
                </div>
            </div>
        </div>
    </my-container>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';
import MyHead from './component/myHead.vue';
import MyContainer from './component/myContainer.vue';

interface Props {
    entityData: Array<{
        text: string;
        count: number
    }>
}

let props = withDefaults(defineProps<Props>(), {
    entityData: () => []
})

let { entityData } = toRefs(props)

</script>

<style scoped lang="scss">
.overview-main {
    display: flex;
    padding: 30px 20px 20px 20px;

    &>div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &>div:not(:first-child) {
        border-left: 1px solid $borderColor;
    }

    .info p:nth-child(1) {
        color: $smallTextColor;
        font-size: $smallTextFontSize;
    }

    .info p:nth-child(2) {
        color: #1890ff;
        font-size: 32px;
        font-weight: 600;
    }
}

@media screen and (max-width:768px) {
    .complete {
        padding: 0px !important;
        margin-top: 20px;
    }
}
</style>