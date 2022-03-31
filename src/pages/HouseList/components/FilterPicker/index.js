import React, { Component } from "react";

import { CascadePickerView   } from "antd-mobile";

import FilterFooter from "../../../../components/FilterFooter";
import styles from "./index.module.css";
export default class FilterPicker extends Component {
    state = {
        value: this.props.defaultValue
    };
    render() {
        const { onCancel,onOk,data,type} = this.props;
        const {value} = this.state
        return (
            <>
                <CascadePickerView options = {data} value = {value} className={styles.datePickerView} onChange ={val=>{
                    this.setState({
                        value:val
                    })
                }} />
                {/* 底部按钮 */}
                <FilterFooter
                    cancelText="取消"
                    okText="确定"
                    onCancel={() => onCancel(type)}
                    onOk={() => onOk(type,value)} 
                />
            </>
        )
    }
}