<template>
    <my-container>
        <my-head text="通知通告">
            <el-button type="primary" style="padding: 0;height: auto;" text @click="goToNotice">查看全部</el-button>
        </my-head>

        <div class="notice-main">
            <el-scrollbar max-height="400px" v-if="noticeData.length > 0">
                <ul class="notice-list w-100" ref="noticeRef" @mousemove="onPause" @mouseleave="onPlay">
                    <li v-for="(item, index) of noticeData" :key="index" class="notice-item">
                        <div>
                            <p class="d_flex d_flex_ac mb-10">
                                <el-tag class="mr-10" :color="item.type === 1 ? '#ffe1b3' : '#b3f0e1'"
                                    :style="{ color: item.type === 1 ? '#ff9900' : '#00cc66' }" style="border: none;">
                                    {{ formatType(item.type) }}
                                </el-tag>

                                <span class="text-ellipsis csp" :title="item.title"
                                    @click="onGoToNoticeDetails(item)">{{
                                            item.title
                                    }}</span>
                            </p>
                            <p>发布时间: {{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}</p>
                        </div>
                    </li>
                </ul>
            </el-scrollbar>
            <el-empty v-else description="暂无通知" />
        </div>
    </my-container>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MyHead from './component/myHead.vue';
import MyContainer from './component/myContainer.vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { getNewNotice } from '@/api/core/notify';
import useStore from '@/store';
// 引入animejs
import anime from "animejs";
import { storeToRefs } from 'pinia';
let { commonStore } = useStore()
let { notifyType } = storeToRefs(commonStore);
const ROUTER = useRouter();

const noticeRef = ref()

// 动画实例
let animation = ref();
// 滚动列表  y轴 偏移数量
let yTrans = ref<Array<{ y: number }>>([]);

let noticeData = ref<Array<{ id: number; title: string; createTime: string; type: number }>>([]);
// 获取分页数据
const onGetPagingData = async () => {
    let { data } = await getNewNotice();
    if (data.code !== 200) return;
    noticeData.value = data.data;
}
// 跳转通知页
const goToNotice = () => {
    ROUTER.push({ name: "notify" })
}
// 跳转通知详情页
const onGoToNoticeDetails = (data: { id: number; type: number }) => {
    ROUTER.push({
        name: "notifyDetails",
        query: {
            id: data.id,
        },
    });
}

const formatType = (type: number): string => {
    if (notifyType.value.length === 0) return '';
    return notifyType.value.filter(item => {
        return item.status === type
    })[0].statusName
}

// 初始化走马灯
const initAnime = () => {
    anime.set(".notice-item", {
        translateY: function (el: any, i: number, l: any) {
            yTrans.value[i] = { y: i * 80 };
            return i * 80;
        },
    });
    animation.value = anime({
        targets: yTrans.value,
        duration: ((noticeData.value.length * 80) / 20.8) * 1000, //走一周持续时间
        easing: "linear",
        y: `-=${80 * noticeData.value.length}`,
        loop: true,
        update: function (anim: any) {
            anime.set(".notice-item", {
                translateY: function (el: any, i: number, l: any) {
                    return yTrans.value[i]?.y %
                        (80 * noticeData.value.length) <
                        - 80 ? (yTrans.value[i]?.y % (80 * noticeData.value.length)) +
                    80 * noticeData.value.length
                        : yTrans.value[i]?.y % (80 * noticeData.value.length);
                },
            });
        },
    });
};
const onPlay = () => {
    animation.value && animation.value.play();
};
const onPause = () => {
    animation.value && animation.value.pause();
};

onMounted(async () => {
    await onGetPagingData();
    // 判断 通知条数 是否大于5条 是 轮播滚动 否 不做操作
    noticeData.value.length > 5 && initAnime();
    if (noticeData.value.length <= 5 && noticeData.value.length > 0) {
        let liItems = [...noticeRef.value.children];
        liItems.forEach((item, index) => {
            if (index === liItems.length - 1) {
                item.firstChild.style.borderBottom = 'none';
            } else {
                item.firstChild.style.borderBottom = '1px solid $borderColor';
            }
            item.style.transform = `translateY(${80 * index}px)`;
        })
        noticeRef.value.style.height = `${80 * noticeData.value.length}px`;
    }
    if (notifyType.value.length === 0) await commonStore.onGetNotifyType()
})

onUnmounted(() => {
    animation.value && animation.value.remove(yTrans.value)
})
</script>

<style scoped lang="scss">
.notice-main {
    .notice-list {
        height: 400px;
        transition: all 0.2s linear;
        position: relative;

        li {
            width: 100%;
            height: 80px;
            padding: 10px 20px 0 20px;
            position: absolute;
            top: 0;

            &>div {
                height: 100%;
                border-bottom: 1px solid $borderColor;
            }

            &>div p:last-child {
                color: $smallTextColor;
            }
        }
    }
}
</style>