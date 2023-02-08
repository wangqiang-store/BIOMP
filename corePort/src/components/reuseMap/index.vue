<template>
    <el-row class="container">
        <el-col :span="24">
            <div class="seacrch">
                <input v-show="isShowSearch" type="text" id="tipinput" :placeholder="placeholder" value="" />
                <div id="box"></div>
            </div>
            <div id="amap"></div>
            <slot></slot>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { ref, onMounted, onBeforeUnmount, nextTick, shallowRef, toRefs, watch, watchEffect } from 'vue';
import { getBaseStat } from '@/api/core/hatchBase';
import { CustomType } from "@/types";
interface Props {
    mapId?: string;
    address?: string;
    position?: CustomType;
    placeholder?: string;
    isShowSearch?: boolean;
    baseList?: Array<any>;
    homeSelectData?: CustomType
}
const props = withDefaults(defineProps<Props>(), {
    mapId: "default",
    address: "",
    position: () => { return {} },
    placeholder: "请输入地址关键词",
    isShowSearch: true,
    baseList: () => [],
    homeSelectData: () => { return {} }
})

const emits = defineEmits<{
    (e: 'getPositonAndlnglat', data: { address: string, position: CustomType, adcode?: string }): void,
    (e: 'onShare', data: { isShow: boolean, position: Array<number> }): void,
    (e: 'onGoToBaseDetails', data: { id: number }): void,
    (e: 'onClickHomeMarker', data: boolean): void,
}>()

let { baseList } = toRefs(props);

const tipinput = ref<CustomType>(null);

let map = shallowRef<CustomType>(null); //地图实例
let amap = ref<CustomType>(null); //地图构造函数
let address = ref(props.address);//地址
let position = ref(props.position);//位置经纬度
let marker: CustomType; //地图唯一点标记
let moreMarkers = ref<Array<CustomType>>([]);//多个点标记
let infoWindow: CustomType;
let disProvince: CustomType;//行政区域图层

// 地图初始化
const initMap = () => {
    AMapLoader.load({
        "key": "e4c77265ff45bdf58b359dbe94b5f474",
        "version": "2.0",
        "plugins": [
            "AMap.Geocoder",
            "AMap.Geolocation",
            "AMap.PlaceSearch",
            "AMap.CitySearch",
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

        // 初始化行政区域图层
        function initPro(adcode: string) {
            disProvince && map.value.remove(disProvince)
            disProvince = new AMap.DistrictLayer.Province({
                zIndex: 12,
                adcode: [adcode],
                depth: 2,
                styles: {
                    'fill': function () {
                        return 'rgba(183, 185, 251,0.5)'
                    },
                    'province-stroke': 'cornflowerblue',
                    'city-stroke': 'white',//中国地级市边界
                    'county-stroke': 'transparent'//中国区县边界   透明
                }
            })
            disProvince.setMap(map.value);
            map.value.setCity(adcode);
        }
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
                    address.value = formattedAddress;
                    adcode = addressComponent.adcode;
                } else {
                    address.value = ""
                }
                emits("getPositonAndlnglat", { address: address.value, position, adcode })
            })
        }

        /**
         * @param address 地址
         * @param isMoreMarker 是否多标注 
         * @param data 数据
         */
        // 根据位置获取经纬度
        function getLonLatsByAddress(address: string, isMoreMarker?: boolean, data?: CustomType) {
            geocoder.getLocation(address, (status: CustomType, result: CustomType) => {
                if (status === 'complete' && result.info === 'OK') {
                    const { location: { lng, lat }, formattedAddress } = result.geocodes[0];
                    setOnlyMark([lng, lat], true, isMoreMarker, data)
                } else {
                    getPositionByBrowser()
                }
            })
        }

        // 设置唯一点标记
        /**
         * @param pstion 标注经纬度
         * @param bool 控制是否用经纬度获取位置信息
         * @param isMoreMarker 是否多标注
         * @param data 信息窗口显示数据
         */
        function setOnlyMark(pstion: Array<number>, bool?: boolean, isMoreMarker?: boolean, data?: CustomType) {
            if (isMoreMarker) {
                let marker = new AMap.Marker({
                    position: pstion,
                })
                map.value.add(marker);
                marker.on("click", (e: Event) => markerClick({ e, marker, id: data.id }));
                moreMarkers.value.push({ marker, data });
                map.value.setFitView()
            } else {
                if (marker) {
                    marker.setPosition(pstion)
                } else {
                    marker = new AMap.Marker({
                        position: pstion,
                    })
                    map.value.add(marker)
                }
                map.value.setCenter(pstion)
            }

            if (!bool) getAddressByLonLats(pstion)
            position.value = pstion;
            switch (props.mapId) {
                case 'activityMap':
                    let activityMapInfoWindowBody: string;
                    activityMapInfoWindowBody = `
                          <div>
                            <p>${address.value}</p>
                            <p class='textBtn' onclick="onShare()">分享</p>
                          </div>
                        `;
                    marker.on("click", (e: Event) => markerClick({ e, infoWindowBody: activityMapInfoWindowBody, marker }));
                    break;
                case 'baseDetailsMap':
                    let baseDetailsMapInfoWindowBody: string;
                    baseDetailsMapInfoWindowBody = `
                          <div>
                            <p>${address.value}</p>
                            <p class='textBtn' onclick="onShare()">分享</p>
                          </div>
                        `;
                    marker.on("click", (e: Event) => markerClick({ e, infoWindowBody: baseDetailsMapInfoWindowBody, marker }));
                    break;
                default:
                    break;
            }
        }

        function markerClick({ e, infoWindowBody, marker, id }: { e: Event; infoWindowBody?: string, marker?: CustomType, id?: number }) {
            if (id) {
                // 点击首页标注
                emits("onClickHomeMarker", true)
                getBaseData(id)
            }
            else initInfoWindow(infoWindowBody, marker)
        }

        // 信息窗口
        function initInfoWindow(content: string = '', markerinstance: CustomType) {
            if (infoWindow) {
                infoWindow.setContent(content)
            } else {
                //构建信息窗体中显示的内容
                infoWindow = new AMap.InfoWindow({
                    content,   //使用默认信息窗体框样式，显示信息内容
                    offset: [0, -30],
                    position: position.value,
                });
            }
            infoWindow && infoWindow.open(map.value, markerinstance.getPosition());
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
                case "homeMap":
                    if (position.value && position.value.length > 0) {
                        setOnlyMark(position.value)
                    } else if (address.value) {
                        watchEffect(() => {
                            baseList.value.forEach(item => {
                                setOnlyMark([item.longitude, item.latitude], true, true, item)
                            })
                        })
                    } else {
                        getPositionByBrowser()
                    }
                    break;
                case "baseDetailsMap":
                    if (position.value && position.value.length > 0) {
                        setOnlyMark(position.value)
                    } else if (address.value) {
                        getLonLatsByAddress(address.value);
                        closeInfoWindow()
                    } else {
                        getPositionByBrowser()
                    }
                    break
                default:
                    break;
            }
            // 监听首页下拉选择
            watch(() => props.homeSelectData, async (newData) => {
                // 判断点击的是地区 基地
                if (newData.id) {
                    // 基地  显示弹框
                    getBaseData(newData.id)
                    disProvince && map.value.remove(disProvince)
                }
                if (newData.code) {
                    // 地区
                    initPro(newData.code)
                }
            })
        });

        // 地图点击
        map.value.on('click', (e: CustomType) => {
            switch (props.mapId) {
                case "positionMap":
                    setOnlyMark([e.lnglat.lng, e.lnglat.lat])
                    break;
                case "activityMap":
                    closeInfoWindow()
                    break;
                case "homeMap":
                    closeInfoWindow()
                    emits("onClickHomeMarker", true)
                    break;
                case "baseDetailsMap":
                    closeInfoWindow()
                    break;
                default:
                    break;
            }
        })

        // 获取基地入孵数据
        const getBaseData = async (id: number) => {
            let { data } = await getBaseStat({ incubationBaseId: id })
            if (data.code !== 200) return;
            let { addInTheEntity, haveInTheEntity, sumInTheEntity, addInTheEntityPeopleNum, haveInTheEntityPeopleNum, sumInTheEntityPeopleNum } = data.data;
            moreMarkers.value.forEach(item => {
                if (id === item.data.id) {
                    let homeMapInfoWindowBody: string;
                    homeMapInfoWindowBody = `
                          <div>
                            <h3 class='pt-10 pb-10'>${item.data ? item.data.name : '基地名称'}</h3>
                            <p class='mb-5'>${item.data ? item.data.address : '基地地址'}</p>
                            <p class='mb-5'>当季新增入孵创业实体数（户）： ${addInTheEntity}</p>
                            <p class='mb-5'>当前实有入孵创业实体数（户）：${haveInTheEntity}</p>
                            <p class='mb-5'>累计入孵创业实体数（户）：${sumInTheEntity}</p>
                            <p class='mb-5'>当季新增入孵创业实体带动就业数（人次）：${addInTheEntityPeopleNum}</p>
                            <p class='mb-5'>当前入孵创业实体带动就业实有数（人次）：${haveInTheEntityPeopleNum}</p>
                            <p class='mb-5'>累计入孵创业实体带动就业数（人次）： ${sumInTheEntityPeopleNum}</p>
                            <p class='textBtn' onclick="onGoToBaseDetails(${id})">查看详情</p>
                          </div>
                        `;
                    initInfoWindow(homeMapInfoWindowBody, item.marker)
                }
            })
        }

        tipinput.value &&
            tipinput.value.addEventListener("input", initSearch);

    }).catch(e => {
        console.log("高德地图加载错误", e);
    })
}

window.onShare = () => {
    emits("onShare", { isShow: true, position: position.value })
}
window.onGoToBaseDetails = (id: number) => {
    emits("onGoToBaseDetails", { id })
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
    address,
    position,
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

    &:deep(.textBtn) {
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