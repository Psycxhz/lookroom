import React from "react";

import { Space } from "antd-mobile";
import PropTypes, { func } from "prop-types";
import styles from "./index.module.css";
import "./index.css"
function FilterFooter({ cancelText, okText, onCancel, onOk, className }){
    return(
        <Space className={["rootone",styles.root, className || "",].join(" ")}>
          {/* 取消按钮 */}
          <span
            className={[styles.btn, styles.cancel].join(" ")}
            onClick={onCancel}
          >
            {cancelText}
          </span>
    
          {/* 确定按钮 */}
          <span className={[styles.btn, styles.ok].join(" ")} onClick={onOk}>
            {okText}
          </span>
        </Space>
    )
}

// props校验
FilterFooter.propsTypes = {
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    className: PropTypes.string,
  };
  export default FilterFooter;