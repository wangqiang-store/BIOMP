<template>
    <el-table class="reuse-table" :data="tableData" style="width: 100%" :border="isborder" :cell-style="{
            padding: '15px 0'
        }" 
        header-row-class-name="header" :row-class-name="tableRowClassName" fit :row-key="rowKey" :max-height="maxHeight" @sort-change="onSortChange">
        <template v-for="item of tableOptions" :key="item.props">
            <!-- 插槽 -->
            <el-table-column v-if="item.type === 'slot'" :prop="item.props" :label="item.label" :width="item.width"
                :fixed="item.fixed" align="center">
                <template #default="{row}">
                    <slot :name="item.slotName" :row="row"></slot>
                </template>
            </el-table-column>
            <!-- 序号 -->
            <el-table-column v-if="item.type === 'index'" type="index" :label="item.label" :width="item.width"
                align="center" />
            <!--普通文本框 -->
            <el-table-column v-if="item.type === 'text'" :prop="item.props" :label="item.label" :formatter="
            item.formatter" :width="item.width" align="center" :sortable="item.sortable" :sort-method="item.sortMethod" :sort-by="item.sortBy" show-overflow-tooltip />
            <!-- 带样式文本框 -->
            <el-table-column v-if="item.type === 'styleText'" :prop="item.props" :label="item.label" :width="item.width"
                align="center" :sortable="item.sortable " show-overflow-tooltip>
                <template #default={row}>
                    <span :style="typeof item.style === 'function' ? item.style(row) : item.style">
                        {{item.formatter ? item.formatter(row) : row[item.props]}}
                    </span>
                </template>
            </el-table-column>
            <!-- switch -->
            <el-table-column v-if="item.type === 'switch'" :label="item.label" :width="item.width" align="center">
                <template #default="{row}">
                    <el-switch v-model="row[item.props]" @change="onChangeSwitch(row)"
                        :style="{'--el-switch-on-color':item.onColor, '--el-switch-off-color': item.offColor}"
                        :disabled="typeof item.isDisabled === 'function' ? item.isDisabled(row) : item.isDisabled" />
                </template>
            </el-table-column>
            <!-- tag -->
            <el-table-column v-if="item.type === 'tag'" :label="item.label" :width="item.width" align="center">
                <template #default="{row}">
                    <el-tag
                        :style="{color:typeof item.textColor === 'function' ? item.textColor(row) : item.textColor || ''}"
                        :color="typeof item.color === 'function' ? item.color(row) : item.color">{{ item.formatter ?
                        item.formatter(row) : row[item.props] }}</el-tag>
                </template>
            </el-table-column>
            <!-- handle -->
            <el-table-column v-if="item.type === 'handle'" fixed="right" :label="item.label" :width="item.width"
                align="center">
                <template #default="{row}">
                    <template v-for="btn of item.btns" :key="btn.text">
                        <el-popconfirm :title="btn.title"
                            v-if="btn.isShow ? btn.isShow(row) && btn.isPopConfirm  : btn.isPopConfirm"
                            :width="btn.width" :icon-color="btn.iconColor" @confirm="onClickBtn(row,btn.handleType)">
                            <template #reference>
                                <el-button :type="btn.type" :size="btn.size || 'small'" :text="btn.textBtn"
                                    :disabled="typeof btn.isDisabled === 'function' ? btn.isDisabled(row) : btn.isDisabled">
                                    {{btn.text}}
                                </el-button>
                            </template>
                        </el-popconfirm>
                        <el-button v-if="btn.isShow ? btn.isShow(row) && !btn.isPopConfirm : !btn.isPopConfirm"
                            :type="btn.type" :size="btn.size || 'small'" :text="btn.textBtn"
                            @click="onClickBtn(row,btn.handleType)"
                            :disabled="typeof btn.isDisabled === 'function' ? btn.isDisabled(row) : btn.isDisabled">
                            {{btn.text}}
                        </el-button>
                    </template>
                </template>
            </el-table-column>
        </template>
    </el-table>
</template>
<script lang="ts" setup>
import { CustomType } from '@/types';
interface Props {
    // 表格数据
    tableData?: any[],
    // 表格配置项
    tableOptions?: any[],
    // 是否显示表格边框
    isborder?: boolean,
    // 表格行状态样式
    tableRowClassName?: Function | string,
    rowKey?:string,
    // 流体高度
    maxHeight?:string,
}

const props = withDefaults(defineProps<Props>(), {
    tableData: () => [],
    tableOptions: () => [],
    isborder: false,
    rowKey:""
})
const emits = defineEmits<{
    (e: 'onHandleRow', data: { rowData: CustomType, type: string }): void
    (e: 'onChangeSwitch', data: { rowData: CustomType }): void
    (e: 'onSortChange', data: { prop: string; order:string | null }): void
}>()

// 点击操作按钮
const onClickBtn = (rowData: CustomType, type: string) => {
    emits("onHandleRow", { rowData, type })
}
// 切换switch
const onChangeSwitch = (rowData: CustomType) => {
    emits("onChangeSwitch", { rowData })
}
// 切换表格排序
const onSortChange = ({ column, prop, order }:any) => {
    emits("onSortChange", { prop, order })
}
</script>

<style scoped lang="scss">
.el-table :deep(.header) th {
    border: 1px solid #e8e8e8 !important;
    border-left: none !important;
    border-right: none !important;
}

.el-table :deep(.header) th:first-child {
    border-left: 1px solid #e8e8e8 !important;
}

.el-table :deep(.header) th:last-child {
    border-right: 1px solid #e8e8e8 !important;
}

.el-table :deep(.el-tag){
    border: none;
}
</style>