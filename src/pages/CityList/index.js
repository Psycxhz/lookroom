import React from "react";
import { NavBar,Toast } from 'antd-mobile'
import "./index.css"
import { List, AutoSizer } from "react-virtualized";
import { API } from "../../utils/api";

import { getCurrentCity } from "../../utils";
import Back from "../../components/NavHeader"
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

// 封装处理字母索引的方法
const formatCityIndex = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
};

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

// 有房源的城市
const HOUSE_CITY = ["北京", "上海", "广州", "深圳"];

export default class CityList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cityList: {},
      cityIndex: [],
      // 指定右侧字母索引列表高亮的索引号
      activeIndex: 0,
    };

    // 创建ref对象
    this.cityListComponent = React.createRef();
  }
  async getCityList() {
    const res = await API.get("/area/city?level=1")
    const { cityList, cityIndex } = formatCityList(res.data.body);

    const hotRes = await API.get('/area/hot')
    cityList['hot'] = hotRes.data.body;
    cityIndex.unshift("hot");

    // 获取当前定位城市信息
    const curCity = await getCurrentCity();
    cityList["#"] = [curCity];
    cityIndex.unshift("#");
    this.setState({
      cityList,
      cityIndex,
    });
  }
  //计算列表行高
  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state;
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
  };

  //渲染城市列表
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在List中是可见的
    style, // ！！一定要给每一行添加该样式
  }) => {
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  //切换城市
  changeCity({label,value}){
    if (HOUSE_CITY.indexOf(label) > -1) {
      // 有
      localStorage.setItem("look_room", JSON.stringify({ label, value }));
    } else {
      Toast.show("该城市暂无房源数据");
    }
  }
  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          // console.log("当前项索引号：", index);
          this.cityListComponent.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""} >
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  }
  //计算滚动值
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      });
    }
  };
  async componentDidMount() {
    await this.getCityList();
    // 调用measureAllRows提前计算List中每一行的高度，实现scrollToRow的精确跳转
    this.cityListComponent.current.measureAllRows();
  }
  render() {
    return (
      <div className="citylist">
        <Back title = "选择城市" />
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered = {this.onRowsRendered}
              scrollToAlignment="start"
              width={width}
            >
            </List>
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }
}