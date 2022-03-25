import React from "react";
import { API } from "../../utils/api";
import "./index.css"
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { Toast } from "antd-mobile";
// 导入BASE_URL
import { BASE_URL } from "../../utils/url";
import Back from "../../components/NavHeader"
import HouseItem from "../../components/HouseItem";
//解决脚手架全局变量访问
const BMap = window.BMap

// 覆盖物样式
const labelStyle = {
    cursor: "pointer",
    border: "0px solid rgb(255, 0, 0)",
    padding: "0px",
    whiteSpace: "normal",
    fontSize: "12px",
    color: "rgb(255, 255, 255)",
    textAlign: "center",
};
export default class MyMap extends React.Component {
    state = {
        map: null,
        isShowList: false,
        houseList:null,
    }
    componentDidMount() {
        this.initMap()
    }
    initMap() {
        //获取定位城市
        const { label, value } = JSON.parse(localStorage.getItem("look_room"))
        //初始化地图
        const map = new BMap.Map("container");
        this.map = map
        // 创建地址解析器实例     
        const myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(label, async point => {
            if (point) {
                map.centerAndZoom(point, 11);
                //添加控件
                map.addControl(new BMap.NavigationControl());
                map.addControl(new BMap.ScaleControl());
                this.renderOverlays(value)
            }
        },
            label);
        // 给地图绑定移动事件
        map.addEventListener("movestart", () => {
            if (this.state.isShowList) {
            this.setState({
                isShowList: false,
            });
            }
        });
    }
    // 渲染覆盖物入口
    async renderOverlays(id) {
        const hide = Toast.show({icon: 'loading',content: '加载中…',duration: 0,})
        const { data } = await API.get(`/area/map?id=${id}`)
        hide.close()
        const { nextZoom, type } = this.getTypeAndZoom();
        data.body.forEach(item => {
            this.createOverlays(item, nextZoom, type);
        })
    }
    // 计算要绘制的覆盖物类型和下一个缩放级别
    getTypeAndZoom() {
        // 调用地图的getZoom()方法，来获取当前缩放级别
        const zoom = this.map.getZoom();
        let nextZoom, type;
        // console.log("当前地图的缩放级别：", zoom);
        if (zoom >= 10 && zoom < 12) {
            // 区
            nextZoom = 13; // 下一个缩放级别
            type = "circle"; // 绘制圆形覆盖物（区、镇）
        } else if (zoom >= 12 && zoom < 14) {
            // 镇
            nextZoom = 15;
            type = "circle";
        } else if (zoom >= 14 && zoom < 16) {
            // 小区
            type = "rect";
        }

        return {
            nextZoom,
            type,
        };
    }
    // 创建覆盖物
    createOverlays(data, zoom, type) {
        const {
            coord: { longitude, latitude },
            label: areaName,
            count,
            value,
        } = data;
        // 创建坐标对象
        const areaPoint = new BMap.Point(longitude, latitude);
        if (type === "circle") {
            // 区或镇
            this.createCircle(areaPoint, areaName, count, value, zoom);
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value);
        }
    }
    // 创建区、镇覆盖物
    createCircle(point, name, count, id, zoom) {
        const opts = {
            position: point,
            offset: new BMap.Size(-35, -35),
        };
        // 创建Label实例对象
        const label = new BMap.Label("", opts);
        // 给label对象添加唯一标识
        label.id = id;
        // 设置房源覆盖物
        label.setContent(`
        <div class="${styles.bubble}">
            <p class="${styles.name}">${name}</p>
            <p>${count}套</p>
        </div>
        `);
        // 设置样式
        label.setStyle(labelStyle);
        // 添加单击事件
        label.addEventListener("click", () => {
            // 调用renderOverlays()方法，获取该区域下的房源数据
            this.renderOverlays(id);
            // 放大地图
            this.map.centerAndZoom(point, zoom);
            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
            setTimeout(() => {
                // 清除覆盖物
                this.map.clearOverlays();
            });
        });
        // 添加覆盖物到地图中
        this.map.addOverlay(label);
    }
    // 创建小区覆盖物
    createRect(point, name, count, id) {
        const label = new BMap.Label("", {
            position: point,
            offset: new BMap.Size(-50, -28),
        });
        label.id = id;
        label.setContent(`
        <div class="${styles.rect}">
          <span class="${styles.housename}">${name}</span>
          <span class="${styles.housenum}">${count}套</span>
          <i class="${styles.arrow}"></i>
        </div>
      `);
        label.setStyle(labelStyle)
        label.addEventListener("click", (e) => {
            this.getHouseList(id);
            const target = e.changedTouches[0];
            this.map.panBy(
                window.innerWidth / 2 - target.clientX,
                (window.innerHeight - 330) / 2 - target.clientY
            );
        });
        // 添加覆盖物到地图
        this.map.addOverlay(label);
    }
    async getHouseList(id) {
        const res = await API.get(`/houses?cityId=${id}`)
        this.setState({
            houseList: res.data.body.list,
            // 展示房源列表
            isShowList: true,
        });
        
    }
    renderHouseList(){
        return this.state.houseList.map((item) => (
            <HouseItem
              key={item.houseCode}
              src={BASE_URL + item.houseImg}
              title={item.title}
              desc={item.desc}
              tags={item.tags}
              price={item.price}
            />
          ));
    }
    render() {
        return (
            <div className="map">
                <Back title="地图找房" />
                {/* 地图渲染 */}
                <div id="container"></div>
                {/* 房源数据 */}
                <div
                    className={[
                        styles.houseList,
                        this.state.isShowList ? styles.show : "",
                    ].join(" ")}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        {this.state.houseList ? this.renderHouseList():""}
                    </div>
                </div>
            </div>
        )
    }
}