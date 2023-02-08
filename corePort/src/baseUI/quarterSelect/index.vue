<template>
    <el-popover placement="bottom" :width="200" trigger="click" @show="onShow" @hide="onHide">
        <template #reference>
            <div class="quarter-input" ref="quarterInput">
                {{ quarterCenter }}
                <el-icon>
                    <component :is="iconName"></component>
                </el-icon>
            </div>
        </template>
        <div class="quarter-main">
            <div class="quarter-main-head d_felx d_flex_sb d_flex_ac">
                <i class="iconfont icon-arrowLeft" @click="onArrowLeft"></i>
                <el-input v-model="quarterYear" :max="new Date().getFullYear()" @change="onChangeYear"></el-input>
                <i class="iconfont icon-arrowRight" @click="onArrowRight"></i>
            </div>
            <div class="quarter-main-body" ref="quarterMainBody">
                <div :class="selectQuarter === 1 && 'active'" data-index="1" @click="onChangeQuarter(1)">一季度</div>
                <div :class="selectQuarter === 2 && 'active'" data-index="2" @click="onChangeQuarter(2)">二季度</div>
                <div :class="selectQuarter === 3 && 'active'" data-index="3" @click="onChangeQuarter(3)">三季度</div>
                <div :class="selectQuarter === 4 && 'active'" data-index="4" @click="onChangeQuarter(4)">四季度</div>
            </div>
        </div>
    </el-popover>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { onMounted, ref, watch } from 'vue';

const emits = defineEmits<{
    (e: 'onChange', data: { year: string | number, quarter: string | number }): void,
}>()

let quarterInput = ref(); //内容显示实例
let quarterMainBody = ref();//下拉框内容实例
// 内容显示
let quarterCenter = ref();
// 年份
let quarterYear = ref<number>(new Date().getFullYear());
// 备份合法年份数据
let backupsYear = ref(new Date().getFullYear());
// 图标
let iconName = ref('ArrowDown');
// 选择季度
let selectQuarter = ref<number>();
// 当前季度
let currentQuarter = ref<number>();

const onGetCurrentQuarter = () => {
    // 获取当前月份
    let currentMonth = new Date().getMonth() + 1;
    // 获取当前季度
    let quarterList = [
        { min: 1, max: 3, currentQuarter: 1 },
        { min: 4, max: 6, currentQuarter: 2 },
        { min: 7, max: 9, currentQuarter: 3 },
        { min: 10, max: 12, currentQuarter: 4 }
    ];
    let quarter = quarterList.filter(item => {
        return currentMonth >= item.min && currentMonth <= item.max
    })[0].currentQuarter;
    return quarter;
}

// 切换年
const onChangeYear = () => {
    if (!/^[1-9]\d*$/.test(`${quarterYear.value}`)) return
    if (quarterYear.value > new Date().getFullYear()) return
    backupsYear.value = quarterYear.value
};
// 切换季度
const onChangeQuarter = (index: number) => {
    let quarter = onGetCurrentQuarter();
    if (quarter < index) return;
    selectQuarter.value = index;
    quarterInput.value.click();
};
const onShow = () => {
    quarterInput.value.style.borderColor = '#409eff';
    iconName.value = 'ArrowUp';
};

const onHide = () => {
    quarterInput.value.style.borderColor = '#dcdfe6';
    iconName.value = 'ArrowDown';
    if (!/^[1-9]\d*$/.test(`${quarterYear.value}`)) {
        ElMessage({
            message: "数值应为正整数",
            type: "warning"
        })
        quarterYear.value = backupsYear.value;
        return
    }
    if (quarterYear.value > new Date().getFullYear()) {
        ElMessage({
            message: "数值不能大于当前年数",
            type: "warning"
        })
        quarterYear.value = backupsYear.value;
        return
    }
    quarterCenter.value = `${quarterYear.value}年第${selectQuarter.value}季度`;
}
// 动态禁用图标
const quarterDisadle = () => {
    // console.log('quarterMainBody.value: ', quarterMainBody.value.children);
    let children: Array<HTMLDivElement> = [...quarterMainBody.value.children];
    children.forEach(item => {
        if (Number(item.dataset.index) > (currentQuarter.value as number)) {
            item.style.cursor = "no-drop";
            item.style.backgroundColor = "#f5f7fa";
        }
    })
}

// 点击左箭头
const onArrowLeft = () => {
    quarterYear.value--
};
// 点击右箭头
const onArrowRight = () => {
    quarterYear.value++
};

watch(quarterCenter, () => {
    emits("onChange", { year: quarterYear.value, quarter: selectQuarter.value as number })
})

onMounted(() => {
    quarterCenter.value = `${quarterYear.value}年第${onGetCurrentQuarter()}季度`;
    selectQuarter.value = onGetCurrentQuarter();
    currentQuarter.value = onGetCurrentQuarter();
    quarterDisadle();
});

defineExpose({
    quarterYear,
    selectQuarter
})
</script>

<style scoped lang="scss">
.quarter-input {
    width: 200px;
    height: 100%;
    border: 1px solid #dcdfe6;
    color: #a8abb2;
    border-radius: 2px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        border-color: #c0c4cc;
    }
}

.quarter-main {
    width: 100%;
    background-color: #fff;

    .quarter-main-head {
        width: 100%;
        height: 40px;
        padding: 10px;
        font-size: 16px;
        font-weight: 700;
        color: #333333;

        i {
            cursor: pointer;
        }

        &:deep(.el-input__wrapper) {
            box-shadow: none;
        }

        &:deep(.el-input__inner) {
            text-align: center;
            font-weight: 700;
        }
    }

    .quarter-main-body {
        width: 100%;
        height: 130px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        div {
            width: 50%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
        }
    }

    .active {
        border-radius: 4px;
        background-color: #0076cc;
        color: white;
    }
}
</style>