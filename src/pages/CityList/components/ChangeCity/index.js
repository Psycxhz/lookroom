import React from "react";
import { useNavigate } from "react-router-dom";
import {Toast } from 'antd-mobile'

function ChangeCity({ item, HOUSE_CITY }) {
  const history = useNavigate();
  // 切换城市
  //   console.log(item);
  function changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) > -1) {
      // 有
      localStorage.setItem("look_room", JSON.stringify({ label, value }));
      history(-1);
    } else {
        Toast.show("该城市暂无房源数据");
    }
  }

  return (
    <div className="name" key={item.value} onClick={() => changeCity(item)}>
      {item.label}
    </div>
  );
}
export default ChangeCity;
