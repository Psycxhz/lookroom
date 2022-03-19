import React from "react";
import { Space } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import "./index.css";

function SearchHeader({cityName, className }) {
    const history = useNavigate()
    return (
      <Space className={["search-box", className || ""].join(" ")} justify="center" align = "center">
        {/* 左侧的白色区域 */}
        <div className="search">
          {/* 位置 */}
          <div className="location" onClick={() => history("/citylist")}>
            <span className="name">{cityName}</span>
            <i className="iconfont icon-arrow" />
          </div>
          {/* 搜索表单 */}
          <div className="form" onClick={() => history("/search")}>
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区或地址</span>
          </div>
        </div>
        {/* 右侧地图图标 */}
        <i className="iconfont icon-map" onClick={() => history("/map")} />
      </Space>
    );
  }

  SearchHeader.propTypes = {
    cityName: PropTypes.string.isRequired,
  };
  export default SearchHeader;