import React from "react";
import { Grid, Space, Swiper, List } from 'antd-mobile'
import { useNavigate } from "react-router-dom"
import "./index.css"
import axios from "axios";

import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";


import SearchHeader from "../../components/SearchHeader";

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
            {navs.map((item) => {
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
        isSwiper: false,
        groupdata: [],
        newsdata: [],
        curCityName: "成都",
    }
    //获取轮播图
    async getSwiper() {
        const { data } = await axios.get("http://localhost:8080/home/swiper")
        this.setState({
            swiperdata: data.body,
            isSwiper: true
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
    //获取租房信息
    async getGroup() {
        const { data } = await axios.get("http://localhost:8080/home/groups", {
            params: {
                area: "AREA|88cff55c-aaa4-e2e0"
            }
        })
        this.setState({
            groupdata: data.body,
        })
    }
    //租房信息布局
    rederGroups = () => {
        return (
            <Grid className="group" columns={2} gap={10}>
                {this.state.groupdata.map(item => {
                    return (
                        <Grid.Item className="group-item" justify="around" key={item.id}>
                            <div className="desc">
                                <p className="title">{item.title}</p>
                                <span className="info">{item.desc}</span>
                            </div>
                            <img src={"http://localhost:8080" + item.imgSrc} alt="" />
                        </Grid.Item>
                    )
                })}
            </Grid>
        )
    }
    //获取资讯数据
    async getNews() {
        const { data } = await axios.get("http://localhost:8080/home/news", {
            params: {
                area: "AREA%7C88cff55c-aaa4-e2e0"
            }
        })
        this.setState({
            newsdata: data.body
        })
    }
    //咨询布局
    renderNews() {
        return this.state.newsdata.map(item => {
            return (
                <List.Item className="news-item" key={item.id}>
                    <div className="imgWrap">
                        <img
                            className="img"
                            src={`http://localhost:8080${item.imgSrc}`}
                            alt=""
                        />
                    </div>
                    <div className="content" direction="column" justify="between">
                        <h3 className="title">{item.title}</h3>
                        <div className="info" justify="between">
                            <span>{item.from}</span>
                            <span>{item.date}</span>
                        </div>
                    </div>
                </List.Item>
            )
        })
    }
    //执行函数获取数据
    async componentDidMount() {
        this.getSwiper()
        this.getGroup()
        this.getNews()
        const curCity = new window.BMapGL.LocalCity();
        curCity.get(async (res) => {
            console.log("当前城市信息：", res);
            const result = await axios.get(
                `http://localhost:8080/area/info?name=${res.name}`
            );
            this.setState({
                curCityName: result.data.body.label,
            });
        });
    }
    render() {
        return (
            <div className="index">
                {/* 轮播图 */}
                <div className="swiper">
                    {this.state.isSwiper ? this.items() : ""}
                </div>
                {/* 顶部搜索框 */}
                <SearchHeader cityName={this.state.curCityName} />
                {/* 渲染导航菜单 */}
                <RenderNavs />
                {/* 租房小组 */}
                <div className="group">
                    <h3 className="group-title">租房小组
                        <span className="more">更多</span>
                    </h3>
                    {/* {this.rederGroups()} */}
                    {this.state.isSwiper ? this.rederGroups() : ""}
                </div>
                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    <List>{this.renderNews()}</List>
                </div>
            </div>
        )
    }
}