import React from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

// 导入自定义的axios
import { API } from "../../../../utils/api";
import styles from "./index.module.css";

// 标题高亮的状态
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};
// FilterPicker和FilterMore组件的选中值
const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: [],
};
export default class Filter extends React.Component {
  state = {
    titleSelectedStatus,
    openType: "",
    filtersData: {},
    selectedValues,
  };
  onTitleClick = (type) => {
    const { titleSelectedStatus, selectedValues } = this.state;
    // 创建新的标题选中状体对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };

    // 遍历标题选中状态对象
    Object.keys(titleSelectedStatus).forEach((key) => {
      // key表示数组中的每一项
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true;
        return;
      }

      // 其他标题
      const selectedVal = selectedValues[key];
      if (
        key === "area" &&
        (selectedVal.length !== 2 || selectedVal[0] !== "area")
      ) {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "mode" && selectedVal[0] !== "null") {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "price" && selectedVal[0] !== "null") {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "more" && selectedVal.length !== 0) {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else {
        newTitleSelectedStatus[key] = false;
      }
    });

    // console.log("newTitleSelectedStatus：", newTitleSelectedStatus);

    this.setState({
      // 展示对话框
      openType: type,
      // 使用新的标题选中状态对象来更新
      titleSelectedStatus: newTitleSelectedStatus,
    });
  };
  componentDidMount() {
    this.getFiltersData();
  }
  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem("look_room"));
    const res = await API.get(`/houses/condition?id=${value}`);

    this.setState({
      filtersData: res.data.body,
    });
  }
  //渲染FilterPicker
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues,
    } = this.state;
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    let data = [];
    let defaultValue = selectedValues[openType];
    switch (openType) {
      case "area":
        // 获取区域数据
        data = [area, subway];
        break;
      case "mode":
        data = rentType;
        break;
      case "price":
        data = price;
        break;
      default:
        break;
    }
    return (
      <FilterPicker
        key={openType}
        data={data}
        onCancel={this.onCancel}
        onOk={this.onSave}
        type={openType}
        defaultValue={defaultValue}
      />
    );
  }
  //渲染FilterMore
  renderFilterMore() {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic },
      selectedValues,
    } = this.state;
    if (openType !== "more") {
      return null;
    }
    const defaultValue = selectedValues.more;
    const data = {
      roomType,
      oriented,
      floor,
      characteristic,
    };

    return (
      <FilterMore
        type={openType}
        data={data}
        onSave={this.onSave}
        onCancel={this.onCancel}
        defaultValue={defaultValue}
      />
    );
  }
  onCancel = (type) => {
    const { titleSelectedStatus, selectedValues } = this.state;
    // 创建新的标题选中状体对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };

    // 其他标题
    const selectedVal = selectedValues[type];
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    this.setState({
      openType: "",
      titleSelectedStatus: newTitleSelectedStatus,
    });
  };
  onSave = (type, value) => {
    const { titleSelectedStatus } = this.state;
    // 创建新的标题选中状体对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };

    // 其他标题
    const selectedVal = value;
    // console.log(selectedVal);
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    const newSelectedValues = {
      ...this.state.selectedValues,
      // 只更新当前type对应的选中值
      [type]: value,
    };

    // 筛选条件数据
    const filters = {};

    const { area, mode, price, more } = newSelectedValues;
    // 区域
    const areaKey = area[0];
    let areaValue = "null";
    if (area.length === 4) {
      areaValue = area[3] !== "null" ? area[3] : area[2];
    }
    filters[areaKey] = areaValue;

    // 方式和租金
    filters.mode = mode[0];
    filters.price = price[0];

    // 更多筛选条件more
    filters.mode = more.join(",");

    // 调用父组件中的方法，来将筛选数据传递给父组件
    this.props.onFilter(filters);

    this.setState({
      openType: "",
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues,
    });
  };
  render() {
    const { titleSelectedStatus, openType } = this.state;
    return (
      <div>
        <div className={styles.root}>
          {openType === "area" ||
          openType === "mode" ||
          openType === "price" ? (
            <div
              className={styles.mask}
              onClick={() => this.onCancel(openType)}
            ></div>
          ) : null}
          <div className={styles.content}>
            <FilterTitle
              titleSelectedStatus={titleSelectedStatus}
              onClick={this.onTitleClick}
            />
            {this.renderFilterPicker()}
            {this.renderFilterMore()}
          </div>
        </div>
      </div>
    );
  }
}
