import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { API } from "../../utils/api";
import { BASE_URL } from "../../utils/url";

import NavHeader from "../../components/NavHeader";
import HouseItem from "../../components/HouseItem";
import NoHouse from "../../components/NoHouse";

import styles from "./index.module.css";

function Rent() {
  const history = useNavigate();
  const [state, setState] = useState([]);

  // 获取已发布房源的列表数据
  async function getHouseList() {
    const urlParams = new URL(window.location.href);
    const pathname = urlParams?.pathname;
    const res = await API.get("/user/houses");
    const { status, body } = res.data;
    if (status === 200) {
      setState(body);
    } else {
      history("/login", { state: { datas: pathname } });
    }
  }
  useEffect(() => {
    getHouseList();
  }, []);
  function renderHouseItem() {
    return state.map((item) => {
      return (
        <HouseItem
          key={item.houseCode}
          onClick={() => history(`/detail/${item.houseCode}`)}
          src={BASE_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      );
    });
  }
  function renderRentList() {
    const hasHouses = state.length > 0;

    if (!hasHouses) {
      return (
        <NoHouse>
          您还没有房源，
          <Link to="/rent/add" className={styles.link}>
            去发布房源
          </Link>
          吧~
        </NoHouse>
      );
    }
    return <div className={styles.houses}>{renderHouseItem()}</div>;
  }

  
  return (
    <div className={styles.root}>
      <NavHeader onLeftClick={() => history("/home/profile")} title="房屋管理"></NavHeader>
      {renderRentList()}
    </div>
  );
}
export default Rent;
