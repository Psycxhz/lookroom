import React, { useState, useEffect } from "react";

import { SearchBar } from "antd-mobile";

import { getCity } from "../../../utils/city";
import { API } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
function Search() {
  const history = useNavigate();
  // 当前城市id
  const cityId = getCity().value;
  let timerId = null;
  const [searchTxt,setSearchTxt] = useState('')
  const [tipsList,setTipsList] = useState([])
  // 关键词搜索小区信息
  const handleSearchTxt = (value) => {
    console.log(value);
    setSearchTxt(value);
    if (!value) {
      // 文本框的值为空
      return setTipsList([]);
    }
    // 清除上一次的定时器
    clearTimeout(timerId);
    timerId = setTimeout(async () => {
      // 获取小区数据
      const res = await API.get("/area/community", {
        params: {
          name: value,
          id: cityId,
        },
      });
      setTipsList(res.data.body);
    }, 500);
  };

  const onTipsClick = (item) => {
    history("/rent/add", {
      state: {
        name: item.communityName,
        id: item.community,
      },
    });
  };

  // 渲染搜索结果列表
  const renderTips = () => {
    return tipsList.map((item) => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => onTipsClick(item)}
      >
        {item.communityName}
      </li>
    ));
  };
  return (
    <div className={styles.root}>
      {/* 搜索框 */}
      <SearchBar
        style={{ "--height": "40px" }}
        placeholder="请输入小区或地址"
        value={searchTxt}
        onChange={handleSearchTxt}
        showCancelButton={true}
        onCancel={() => history("/rent/add")}
      />

      {/* 搜索提示列表 */}
      <ul className={styles.tips}>{renderTips()}</ul>
    </div>
  );
}
export default Search;
