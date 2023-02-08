<template>
    <el-row class="container">
        <el-col :span="24">
            <div class="seacrch">
                <input v-show="isShowSearch" type="text" id="tipinput" :placeholder="placeholder" value="" />
                <div id="box"></div>
            </div>
            <div id="amap"></div>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { ref, onMounted, onBeforeUnmount, nextTick, shallowRef } from 'vue';

import { CustomType } from "@/types";
interface Props {
    mapId?: string
    address?: string
    banAddress?: string //禁止改变的地址
    position?: CustomType
    placeholder?: string
    isShowSearch?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    mapId: "default",
    address: "",
    banAddress: "",
    position: () => { return {} },
    placeholder: "请输入地址关键词",
    isShowSearch: true
})


const emits = defineEmits<{
    (e: 'getPositonAndlnglat', data: { address: string, position: CustomType, adcode?: string }): void,
    (e: 'onShare', data: { isShow: boolean, position: Array<number> }): void,
}>()

const tipinput: CustomType = ref(null);

let address = ref(props.address)
let banAddress = ref(props.banAddress)
let position = ref(props.position)
let map: CustomType = shallowRef(null); //地图唯一标注
let amap: CustomType = ref(null); //地图构造函数
let marker: CustomType; //地图唯一点标记
let infoWindow: CustomType;

// 地图初始化
const initMap = () => {
    AMapLoader.load({
        "key": "e4c77265ff45bdf58b359dbe94b5f474",
        "version": "2.0",
        "plugins": [
            "AMap.Geocoder",
            "AMap.Geolocation",
            "AMap.PlaceSearch",
            "AMap.CitySearch"
        ],
        AMapUI: {
            "version": '1.1',   // AMapUI 缺省 1.1
            "plugins": [
                'overlay/SimpleMarker', 	//SimpleMarker 简单标记
                'overlay/SimpleInfoWindow', //SimpleInfoWindow 信息窗口
                'misc/PoiPicker',
                'control/BasicControl',
                'misc/MarkerList',
                'geo/DistrictExplorer',
                'misc/PathSimplifier',
            ],
        },
        "Loca": {
            "version": '2.0'
        },

    }).then((AMap) => {
        amap.value = AMap
        map.value = new AMap.Map('amap', {
            zoom: 15,
            zooms: [4, 18],
            center: [113.265123, 23.134143],
        });

        const geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: '全国'
        })

        const geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            // 定位按钮的停靠位置的偏移量
            offset: [10, 20],
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            position: 'RB'
        })

        const placeSearch = new AMap.PlaceSearch({
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: "010", // 兴趣点城市
            citylimit: true,  //是否强制限制在设置的城市内搜索
            map: map.value, // 展现结果的地图实例
            panel: "box", // 结果列表将在此容器中进行展示。
            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });

        const citySearch = new AMap.CitySearch();

        // 根据ip定位
        function getPositionByIp() {
            citySearch.getLocalCity((status: any, result: any) => {
                if (status === 'complete' && result.info === 'OK') { }
            })
        }

        //根据浏览器定位
        function getPositionByBrowser() {
            geolocation.getCurrentPosition(function (status: CustomType, result: CustomType) {
                if (status == 'complete') {
                    onComplete(result)
                } else {
                    onError(result)
                }
            });
            function onComplete(data: CustomType) {
                console.log("数据", data);
            }
            function onError(data: CustomType) {
                // 定位出错
                map.value.setZoomAndCenter(11, [113.265123, 23.134143]); //同时设置地图层级与中心点
            }
        }

        // 根据坐标获取位置
        function getAddressByLonLats(position: CustomType) {
            let adcode = '';
            geocoder.getAddress(position, (status: CustomType, result: CustomType) => {
                if (status === 'complete' && result.info === 'OK') {
                    let { formattedAddress, addressComponent } = result.regeocode;
                    address.value = formattedAddress
                    adcode = addressComponent.adcode;
                } else {
                    address.value = ""
                }
                emits("getPositonAndlnglat", { address: address.value, position, adcode })
            })
        }

        // 根据位置获取经纬度
        function getLonLatsByAddress(address: string) {
            geocoder.getLocation(address, (status: CustomType, result: CustomType) => {
                if (status === 'complete' && result.info === 'OK') {
                    const { location: { lng, lat }, formattedAddress } = result.geocodes[0];
                    setOnlyMark([lng, lat], true)
                } else {
                    getPositionByBrowser()
                }
            })
        }

        // 设置唯一点标记
        function setOnlyMark(pstion: Array<number>, bool?: boolean) {
            if (marker) {
                marker.setPosition(pstion)
            } else {
                marker = new AMap.Marker({
                    position: pstion,
                    // offset: [0, 50]
                })
                map.value.add(marker)
            }
            map.value.setCenter(pstion)
            if (!bool) getAddressByLonLats(pstion)
            position.value = pstion
            switch (props.mapId) {
                case 'activityMap':
                    marker.on("click", (e: Event) => markerClick(e, props.mapId));
                    break;
                case 'baseDetailsMap':
                    marker.on("click", (e: Event) => markerClick(e, props.mapId));
                    break
                default:
                    break;
            }
        }

        function markerClick(e: Event, mapId: string) {
            let infoWindowBody;
            switch (mapId) {
                case 'activityMap':
                    infoWindowBody = `
                          <div>
                            <p>${banAddress.value}</p>
                            <p class='share' onclick="onShare()">分享</p>
                          </div>
                        `;
                    break;
                case 'baseDetailsMap':
                    infoWindowBody = `
                          <div>
                            <p>${banAddress.value}</p>
                            <p class='share' onclick="onShare()">分享</p>
                          </div>
                        `;
                    break
                default:
                    break;
            }
            initInfoWindow(infoWindowBody as string)
        }

        // 信息窗口
        function initInfoWindow(content: string) {
            if (infoWindow) {
                infoWindow.setContent(content)
            } else {
                //构建信息窗体中显示的内容
                infoWindow = new AMap.InfoWindow({
                    content,   //使用默认信息窗体框样式，显示信息内容
                    offset: [0, -30],
                    position: position.value
                });
            }
            infoWindow && infoWindow.open(map.value, marker.getPosition());
        }

        // 关闭信息窗口
        function closeInfoWindow() {
            infoWindow && infoWindow.close()
        }

        // 页面输入框搜索
        function initSearch() {
            // 搜索列表点击
            placeSearch.on("listElementClick", (SelectChangeEvent: CustomType) => {
                const { name, location, adcode } = SelectChangeEvent.data
                address.value = name
                position.value = [location.lng, location.lat]
                emits("getPositonAndlnglat", { address: address.value, position: position.value, adcode })
            })

            //关键字查询
            if (tipinput.value.value) {
                nextTick(() => {
                    placeSearch.search(tipinput.value.value);
                })
            }
        }

        // 地图图块加载完成后触发
        map.value.on("complete", function () {
            switch (props.mapId) {
                case "positionMap":
                    if (position.value && position.value.length > 0) {
                        setOnlyMark(position.value)
                    } else if (address.value) {
                        getLonLatsByAddress(address.value)
                    } else {
                        getPositionByBrowser()
                    }
                    break;
                case "activityMap":
                    if (position.value && position.value.length > 0) {
                        setOnlyMark(position.value)
                    } else if (address.value) {
                        getLonLatsByAddress(address.value);
                        closeInfoWindow()
                    } else {
                        getPositionByBrowser()
                    }
                    break;
                case "baseDetailsMap":
                    console.log('address.value: ', address.value);
                    if (position.value && position.value.length > 0) {
                        setOnlyMark(position.value)
                    } else if (address.value) {
                        getLonLatsByAddress(address.value);
                        closeInfoWindow()
                    } else {
                        getPositionByBrowser()
                    }
                    break;
                default:
                    break;
            }
        });

        // 地图点击
        map.value.on('click', (e: CustomType) => {
            switch (props.mapId) {
                case "positionMap":
                    setOnlyMark([e.lnglat.lng, e.lnglat.lat])
                    break;
                case "activityMap":
                    // setOnlyMark([e.lnglat.lng, e.lnglat.lat]);
                    closeInfoWindow()
                    break;
                case "baseDetailsMap":
                    closeInfoWindow()
                    break;
                default:
                    break;
            }
        })

        tipinput.value &&
            tipinput.value.addEventListener("input", initSearch);

    }).catch(e => {
        console.log("高德地图加载错误", e);
    })
}
window.onShare = () => {
    emits("onShare", { isShow: true, position: position.value })
}
onMounted(() => {
    tipinput.value = document.getElementById("tipinput");
    initMap()
})
onBeforeUnmount(() => {
    // 销毁地图组件
    map.value && map.value.destroy()
    console.log("销毁");
})
defineExpose({
    address, position
})
</script>

<style scoped lang="scss">
.seacrch {
    position: relative;

    #tipinput {
        margin: 10px 0;
        padding: 5px;
        border-radius: 5px;
        border: 2px solid #9c9ea1;

        &:focus {
            border: 2px solid #409eff;
        }
    }

    #box {
        position: absolute;
        top: 38px;
        left: 0;
        width: 300px;
        height: auto;
        max-height: 300px;
        overflow-y: auto;
        z-index: 999;
    }

}

.container {
    width: 100%;
    min-height: calc(100% - 50px);

    #amap {
        height: 100%;
    }

    &:deep(.amap-info-close) {
        display: none;
    }

    &:deep(.amap-info-contentContainer) {
        width: max-content;
    }

    &:deep(.share) {
        margin: 0 0 5px 0;
        text-align: right;
        font-weight: bold;
        cursor: pointer;
        color: #1d7ecb;
        font-size: 14px;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>