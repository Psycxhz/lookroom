import React from "react";

import { useNavigate } from "react-router-dom";
import {Space} from "antd-mobile"

//导入城市页面顶部
import SearchHeader from "../../components/SearchHeader";
//导入子组件
import Filter from "./components/Filter";

// 导入样式
import styles from "./index.module.css";

//返回按钮
const ToPro = ()=>{
    const history = useNavigate();
    return(
        <i
        className="iconfont icon-back"
        onClick={() =>history.go(-1)}
      ></i>
    )
}

const { label } = JSON.parse(localStorage.getItem('look_room'))
export default class HouseList extends React.Component {
    render() {
        return (
            <div className="root">
                <Space className={styles.header}>
                    <ToPro />
                    <SearchHeader cityName={label} className={styles.searchHeader} />
                </Space>
                <Filter />
            </div>

        )
    }
}