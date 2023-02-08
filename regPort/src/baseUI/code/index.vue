<template>
    <img class="code" v-show="authCode" :src="authCode" v-html="authCode" @click="onRefreshCode">
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getCode } from '@/api';
let authCode = ref();
// let allchar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e",
//     "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r",
//     "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E",
//     "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
//     "S", "T", "U", "V", "W", "X", "Y", "Z"];

// const randomChar = () => {
//     let result = "";//创建空的字符串，方便等下接收值
//     //循环找出4的字符
//     for (var i = 0; i < 4; i++) {
//         //随机生成一个0-61的数字
//         var index = Math.floor(Math.random() * 62);
//         //将随机生成的数字，作为数组的索引，然后赋给result
//         //每次赋一个数组值，循环4次最后就是4个字符
//         result += allchar[index];
//     }
//     return result;
// }
// 获取验证码
const onGetCode = async () => {
    let { data } = await getCode();
    const blob = new Blob([data]);
    const objectURL = URL.createObjectURL(blob);
    authCode.value = objectURL;
};

// 点击验证码
const onRefreshCode = () => {
    // authCode.value = randomChar();
    onGetCode()
}

onMounted(() => {
    // authCode.value = randomChar();
    onGetCode()
});
defineExpose({
    authCode,
    onGetCode
})
</script>

<style scoped lang="scss">
.code {
    width: 70px;
    height: 90%;
    background-color: #fff;
    color: #474c5b;
    font-family: fantasy;
    font-style: oblique;
    cursor: pointer;
}
</style>