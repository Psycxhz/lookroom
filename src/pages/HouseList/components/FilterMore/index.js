import React from "react";

import FilterFooter from "../../../../components/FilterFooter";
import styles from "./index.module.css";

export default class FilterMore extends React.Component {
  state = {
    selectedValues: this.props.defaultValue,
  };

  onTagClick(value) {
    const { selectedValues } = this.state;
    // 创建新数组
    const newSelectedValues = [...selectedValues];
    if (newSelectedValues.indexOf(value) <= 1) {
      // 没有当前值
      newSelectedValues.push(value);
    } else {
      // 有
      const index = newSelectedValues.findIndex((item) => item === value);
      newSelectedValues.splice(index, 1);
    }

    this.setState({
      selectedValues: newSelectedValues,
    });
  }
  //渲染筛选数据
  renderFilters(data) {
    const { selectedValues } = this.state;
    return data.map((item => {
      const isSelected = selectedValues.indexOf(item.value) > -1;
      return <span onClick={() => this.onTagClick(item.value)} key={item.value} className={[styles.tag, isSelected ? styles.tagActive : ""].join(" ")}>{item.label}</span>
    }))

  }
  //清空删选数据
  onCancel = () => {
    this.setState({
      selectedValues: [],
    });
  };

  // 确定按钮的事件处理程序
  onOk = () => {
    const { type, onSave } = this.props;
    // onSave是父组件中的方法
    onSave(type, this.state.selectedValues);
  };

  render() {
    const { data: { roomType, oriented, floor, characteristic },onCancel,type } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask}  onClick={() => onCancel(type)} ></div>

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋点亮</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          onCancel={this.onCancel}
          onOk={this.onOk}
          cancelText="清除"
          okText="确定"
        />
      </div>
    )
  }
}