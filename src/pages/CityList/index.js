import React from "react";
import { IndexBar, List,NavBar } from 'antd-mobile'
import {useNavigate} from "react-router-dom"
import "./index.css"
import axios from "axios";
const Back = ()=>{
    const history = useNavigate()
    const back = ()=>{
        history(-1)
    }
    return (
        <NavBar icon={<i className="iconfont icon-back" />} onBack={back}>选择城市</NavBar>
    )
}

// 数据格式化的方法
const formatCityList = (list) => {
    const cityList = {};
    // 1.遍历list数组
    list.forEach((item) => {
      // 2.获取每一个城市的首字母
      const first = item.short.substr(0, 1);
      // console.log(first);
      // 3.判断cityList中是否有该分类
      if (cityList[first]) {
        // 4.如果有，直接往这个分类里面push数据
        cityList[first].push(item);
      } else {
        // 5.如果没有，就先创建一个数组，然后再把当前的城市信息添加到数组中
        cityList[first] = [item];
      }
    });
    // 获取索引数据
    const cityIndex = Object.keys(cityList).sort();
    // const cityIndex = [];
    return {
      cityList,
      cityIndex,
    };
  };
export default class CityList extends React.Component{
    async getCityList(){
        const res = await axios.get("http://localhost:8080/area/city?level=1")
        const { cityList, cityIndex } = formatCityList(res.data.body);
        console.log(cityList);
        console.log(cityIndex);
    }
    async componentDidMount() {
        await this.getCityList();
    }
    render(){
        return(
            <div className="citylist">
               <Back />
            </div>
        )
    }
}