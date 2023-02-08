<template>
    <el-dialog v-model="dialogVisible" top="10vh" title="选取位置" class="mapDialog" @close="onCloseDialog">
        <reuse-map map-id="positionMap" ref="mapRef" :address="mapAddress" :position="mapPosition"
            @getPositonAndlnglat="getPositonAndlnglat"></reuse-map>
        <template #footer>
            <div class="dialog-footer">
                <div>
                    当前位置: {{ mapAddress }}
                </div>
                <span>
                    <el-button @click="onCancel">取消</el-button>
                    <el-button type="primary" @click="onMapConfirm">确定</el-button>
                </span>
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { CustomType } from "@/types";
import reuseMap from "@/components/reuseMap/index.vue";
import { FormInstance } from 'element-plus';
interface Props {
    address?: string
    position?: CustomType
}
const props = withDefaults(defineProps<Props>(), {
    address: "",
    positon: () => { return {} }
})
const emits = defineEmits<{
    (e: 'onClose'): void,
    (e: 'onMapConfirm', data: { address: string, position: CustomType, adcode: string }): void,
}>()

let dialogVisible = ref(true)
let mapAddress = ref<string>(props.address);//标注地址
let mapPosition = ref<Array<number>>(props.position);//标注经纬度
let mapAdcode = ref<string>('');//标注所在区域code

const mapRef: CustomType = ref<FormInstance>();

// 关闭dialog
const onCloseDialog = () => {
    emits("onClose")
}


// 获取并显示位置以及坐标
const getPositonAndlnglat = ({ address, position, adcode }: CustomType) => {
    nextTick(() => {
        mapAddress.value = address
        mapPosition.value = position
        mapAdcode.value = adcode
    })
}


// 确定按钮
const onMapConfirm = () => {
    emits("onMapConfirm", { address: mapAddress.value, position: mapPosition.value, adcode: mapAdcode.value });
    onCloseDialog()
}

// 取消按钮
const onCancel = () => {
    onCloseDialog()
}
</script>

<style lang="scss">
.mapDialog {
    height: 80%;
    min-height: 400px;
    min-width: 650px;

    .el-dialog__body {
        height: calc(100% - 110px);
        padding: 10px 20px;
    }

    .dialog-footer {
        display: flex;
        justify-content: space-between;
    }
}
</style>