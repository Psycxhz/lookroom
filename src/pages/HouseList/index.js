import React from "react";

import { useNavigate } from "react-router-dom";
import { Space, Toast } from "antd-mobile";

//导入城市页面顶部
import SearchHeader from "../../components/SearchHeader";
//导入子组件
import Filter from "./components/Filter";
// 导入自定义的axios
import { API } from "../../utils/api";
// 导入样式
import styles from "./index.module.css";
import HouseItem from "../../components/HouseItem";
import { getCurrentCity } from "../../utils";
import { BASE_URL } from "../../utils/url";
import Sticky from "../../components/Sticky";
import NoHouse from "../../components/NoHouse";
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";

//返回按钮
const ToPro = () => {
  const history = useNavigate();
  return <i className="iconfont icon-back" onClick={() => history(-1)}></i>;
};

// const { label, value } = JSON.parse(localStorage.getItem("look_room"));
export default class HouseList extends React.Component {
  state = {
    list: [],
    count: 0,
    isLoading: false,
  };
  filters = {};
    // 初始化默认值
    label = "";
    value = "";  
    async componentDidMount() {
    const { label, value } = await getCurrentCity();
    this.label = label;
    this.value = value;
    this.searchHouseList();
  }
  async searchHouseList() {
    this.setState({
      isLoading: true,
    });
    const hide = Toast.show({
      icon: "loading",
      content: "加载中…",
      duration: 0,
    });
    const res = await API.get("/houses", {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    });
    const { list, count } = res.data.body;
    hide.close();
    if (count !== 0) {
      Toast.show({ content: `共找到${count}套房源` });
    }
    this.setState({
      list,
      count,
      // 数据加载完成的状态
      isLoading: false,
    });
  }
  // 接收Filter组件中的筛选条件数据
  onFilter = (filters) => {
    // 返回页面顶部
    window.scrollTo(0, 0);
    this.filters = filters;
    // 调用获取房屋数据的方法
    this.searchHouseList();
  };

  renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state;
    const house = list[index];
    // 判断house是否存在
    // 不存在的时候就渲染一个loading元素
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      );
    }

    return (
      <HouseItem
        key={key}
        route={`/detail/${house.houseCode}`}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      ></HouseItem>
    );
  };
  // 判断列表中的每一行数据是否加载完毕
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  };

  // 用来获取更多房屋列表数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise((resolve) => {
      API.get("/houses", {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex,
        },
      }).then((res) => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list],
        });
        // 数据加载完成调用resolve即可
        resolve();
      });
    });
  };

  renderList() {
    const { count, isLoading } = this.state;
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>;
    }

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight // 设置高度为WindowScroller最终渲染的列表高度
                    width={width} // 视口宽度
                    height={height} // 视口高度
                    rowCount={count} // List列表项的总条目数
                    rowHeight={130} // 每一行的高度
                    rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  }
  render() {
    return (
      <div className="root">
        <Space className={styles.header}>
          <ToPro />
          <SearchHeader cityName={this.label} className={styles.searchHeader} />
        </Space>
        {/* 条件筛选 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>
        {/* 房屋渲染 */}
        <div className={styles.houseItems}>{this.renderList()}</div>
      </div>
    );
  }
}
