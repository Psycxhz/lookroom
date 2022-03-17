import React from "react";
import { Space, Swiper, Toast } from 'antd-mobile'
import { useNavigate } from "react-router-dom"
import "./index.css"
import axios from "axios";

import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";


// 导航菜单的数据
const navs = [
    {
        id: 0,
        img: Nav1,
        title: "整租",
        path: "/home/list",
    },
    {
        id: 1,
        img: Nav2,
        title: "合租",
        path: "/home/list",
    },
    {
        id: 2,
        img: Nav3,
        title: "地图找房",
        path: "/home/map",
    },
    {
        id: 3,
        img: Nav4,
        title: "去出租",
        path: "/rent/add",
    },
];
// 导航菜单
const RenderNavs = () => {
    const history = useNavigate()
    return (
        <Space className="nav" justify='around'>
            {navs.map((item)=>{
                return (
                    <div
                    key={item.id}
                    onClick={() => {
                      history(item.path);
                    }}
                  >
                    <img src={item.img} alt="" />
                    <h2>{item.title}</h2>
                  </div>
                )
            })}
        </Space>
    )
}
export default class index extends React.Component {
    state = {
        swiperdata: [],
        isSwiper:false
    }
    async getSwiper() {
        const { data } = await axios.get("http://localhost:8080/home/swiper")
        this.setState({
            swiperdata: data.body,
            isSwiper:true
        })
    }
    //轮播图
    items = () => {
        return (
            <Swiper autoplay loop>
            {this.state.swiperdata.map((item, index) => (
                <Swiper.Item key={item.id}>
                    <div
                        className="content"
                        onClick={() => {
                            console.log(index);
                        }}
                    >
                        <img src={`http://localhost:8080${item.imgSrc}`} alt=""></img>
                    </div>
                </Swiper.Item>
            ))}
            </Swiper>
        )
    }
    async componentDidMount() {
        this.getSwiper()
    }
    render() {
        return (
            <div className="index">
                {/* 轮播图 */}
                <div className="swiper">
                    {this.state.isSwiper ? this.items() :""}
                </div>
                {/* 渲染导航菜单 */}
                <RenderNavs />
            </div>
        )
    }
}