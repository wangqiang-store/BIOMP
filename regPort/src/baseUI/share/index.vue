<template>
    <div class="share_body">
        <div class="share_top"></div>
        <div class="share_bottom">
            <p>复制链接，可以任意粘贴到聊天工具，或者邮件当中，分享给朋友。</p>
            <div class="share_url">
                <el-input v-model="linkURL" ref="input" @change="onChangeUrl"></el-input>
                <el-button type="primary" @click="onCopy" ref="copy" :data-clipboard-text="linkURL">
                    复制
                </el-button>
                <el-button type="danger" @click="dialogClose">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, shallowRef } from "vue";
import Clipboard from 'clipboard';
import { ElMessage } from "element-plus";
interface Props {
    linkURL: string
}
const props = withDefaults(defineProps<Props>(), {
    linkURL: '我是比爸爸'
})
const emits = defineEmits<{
    (e: 'close', data: { isShow: boolean }): void,
    (e: 'changeUrl', data: string): void,
}>()

const dialogClose = () => {
    emits("close", { isShow: false });
};

const onChangeUrl = () => {
    emits("changeUrl", props.linkURL);
};
let copy = ref();
let clipboard = shallowRef();
const onCopy = () => {
    clipboard.value.on('success', () => {
        ElMessage({
            message: "复制成功",
            type: "success",
        })
        //  释放内存
        clipboard.value.destroy()
    })
    clipboard.value.on('error', () => {
        // 不支持复制
        console.log('该浏览器不支持复制')
        // 释放内存
        clipboard.value.destroy()
    })
    clipboard.value = new Clipboard(copy.value.$el);
};

onMounted(() => {
    clipboard.value = new Clipboard(copy.value.$el);
})
</script>

<style scoped lang="scss">
.share_body {
    .share_top {
        height: 200px;
        background-image: url("@/assets/share.png");
        background-position: center;
        background-repeat: no-repeat;
    }

    .share_bottom {
        .share_url {
            display: flex;

            & .el-input {
                width: 85%;
                margin-right: 10px;

                &:deep(.el-input__inner::selection) {
                    background-color: #fff;
                    color: #43b6c2;
                }
            }
        }
    }
}
</style>
