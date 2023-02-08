<template>
    <el-form :ref="formRef" :model="formData" :rules="rules" :label-width="labelWidth" :label-position="labelPosition"
        class="demo-ruleForm" :size="formSize" status-icon>
        <el-row>
            <template v-for="item of formOption" :key="item.props">
                <el-col :span="item.span || 24">
                    <!-- 插槽 -->
                    <el-form-item v-if="item.type === 'slot'" :label="item.label" :prop="item.props">
                        <slot :name="item.slotName"></slot>
                    </el-form-item>
                    <!-- 输入框 -->
                    <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.props">
                        <el-input v-model.trim="formData[item.props]" :placeholder="item.placeholder"
                            :disabled="typeof item.isDisabled === 'function' ? item.isDisabled(formData) : item.isDisabled "
                            :clearable="item.clearable" :type="item.inputType" />
                    </el-form-item>
                    <!-- 文本框 -->
                    <el-form-item v-if="item.type === 'textarea'" :label="item.label" :prop="item.props"
                        style="width:100%">
                        <el-input v-model="formData[item.props]" type="textarea" :placeholder="item.placeholder"
                            :autosize="{ minRows: item.minRows || 8,maxRows:item.maxRows || 10 }" />
                    </el-form-item>
                    <!-- 下拉框 -->
                    <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.props">
                        <el-select v-model="formData[item.props]" :placeholder="item.placeholder"
                            :disabled="typeof item.isDisabled === 'function' ? item.isDisabled(formData) : item.isDisabled">
                            <el-option v-for="ops of formItemOption[item.props]" :key="ops[item.value]"
                                :label="ops[item.optionLabel]" :value="ops[item.value]" />
                        </el-select>
                    </el-form-item>

                    <!-- 日期选择器 -->
                    <el-form-item v-if="item.type === 'date'" :label="item.label" :prop="item.props">
                        <el-date-picker v-model="formData[item.props]" :type="item.dateType ||'date'"
                            :range-separator="item.rangeSeparator" :placeholder="item.placeholder || '请选择日期'"
                            :size="item.size" />
                    </el-form-item>

                    <!-- 单选框 -->
                    <el-form-item v-if="item.type === 'radio'" :label="item.label" :prop="item.props">
                        <el-radio-group v-model="formData[item.props]">
                            <el-radio v-for="(val,i) in radios[item.props]" :key="val[item.value]"
                                :label="val[item.value]">
                                {{val[item.text]}}</el-radio>
                        </el-radio-group>
                    </el-form-item>

                </el-col>
            </template>
        </el-row>
    </el-form>
</template>
<script lang="ts" setup>
import { getCurrentInstance } from 'vue';
import { CustomType } from '@/types';

type formSizeType = 'large' | 'default' | 'small';
type labelPositionType = "left" | "right" | "top";

interface Props {
    formRef?: string;
    // 表单数据
    formData: CustomType;
    // 表单配置
    formOption: Array<any>;
    // 下拉框options
    formItemOption?: CustomType;
    // 单选框数据
    radios?: CustomType,
    // 验证规则
    rules?: CustomType;
    labelWidth?: string;
    formSize?: formSizeType;
    labelPosition?: labelPositionType;
}

const props = withDefaults(defineProps<Props>(), {
    formRef: "formRef",
    formData: () => { return {} },
    rules: () => { return {} },
    formOption: () => [],
    formItemOption: () => { return {} },
    labelWidth: "120px",
    formSize: "default",
    labelPosition: "top",
})

// 获取vue实例
const { proxy }: any = getCurrentInstance()
// 表单实例
const ruleFormRef = () => proxy.$refs[props.formRef];

defineExpose({
    ruleFormRef
})
</script>

<style scoped lang="scss">
.el-form {
    :deep(.el-form-item, .el-select) {
        width: 100%;
    }

    :deep(.el-select) {
        width: 100%;
    }

    :deep(textarea) {
        resize: none;
    }
}
</style>