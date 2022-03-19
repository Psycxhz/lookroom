import React from "react";
// 导入路由
import { Route, Routes,useLocation,useNavigate,Link} from "react-router-dom";
// 导入TabBar组件
import { TabBar, Grid } from "antd-mobile";
// 导入组件自己的样式文件
import "./index.css";
// 导入组件
import Index from "../Index";
import HouseList from "../HouseList";
import News from "../News";
import Profile from "../Profile";

// const HouseList = lazy(() => import("../HouseList"));
// const News = lazy(() => import("../News"));
// const Profile = lazy(() => import("../Profile"));


// TabBar.Item数据
const Bottom = () => {
    const history = useNavigate()
    const location = useLocation()
    const { pathname } = location
  
    const setRouteActive = (value) => {
        history(value)
    }
  
    const tabItems = [
        {
            title: "首页",
            icon: "icon-ind",
            path: "/home",
        },
        {
            title: "找房",
            icon: "icon-findHouse",
            path: "/home/list",
        },
        {
            title: "资讯",
            icon: "icon-infom",
            path: "/home/news",
        },
        {
            title: "我的",
            icon: "icon-my",
            path: "/home/profile",
        },
    ];
  
    return (
      <TabBar className="tab" activeKey={pathname} onChange={value => setRouteActive(value)}>
        {tabItems.map(item => (
          <TabBar.Item key={item.path} icon={<i className={`iconfont ${item.icon}`}></i>} title={item.title} />
        ))}
      </TabBar>
    )
  }
export default class Home extends React.Component {
    // 当Home组件的内容发生更新的时候去调用
    // 渲染TabBar.Item

    render() {
        return (
            <div className="home">
                {/* 渲染子路由 */}
                <Routes>
                    <Route path="/" exact element ={<Index />}></Route>
                    <Route path="/list" element = {<HouseList />}></Route>
                    <Route path="/news" element = {<News />} ></Route>
                    <Route path="/profile" element = {<Profile />} ></Route>
                </Routes>
                <Bottom />
            </div>
        );
    }
}
