import React, { useState, useEffect } from "react";
import { Swiper, ImageViewer, Space, Modal, Toast } from "antd-mobile";
import NavHeader from "../../components/NavHeader";
import HouseItem from "../../components/HouseItem";
import HousePackage from "../../components/HousePackage";
import { useNavigate, useParams } from "react-router-dom";

import { BASE_URL } from "../../utils/url";
import { API } from "../../utils/api";
import styles from "./index.module.css";
import "./index.css";

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL + "/img/message/1.png",
    desc: "72.32㎡/南 北/低楼层",
    title: "安贞西里 3室1厅",
    price: 4500,
    tags: ["随时看房"],
  },
  {
    id: 2,
    src: BASE_URL + "/img/message/2.png",
    desc: "83㎡/南/高楼层",
    title: "天居园 2室1厅",
    price: 7200,
    tags: ["近地铁"],
  },
  {
    id: 3,
    src: BASE_URL + "/img/message/3.png",
    desc: "52㎡/西南/低楼层",
    title: "角门甲4号院 1室1厅",
    price: 4300,
    tags: ["集中供暖"],
  },
];

// 百度地图
const BMap = window.BMap;

const labelStyle = {
  position: "absolute",
  zIndex: -7982820,
  backgroundColor: "rgb(238, 93, 91)",
  color: "rgb(255, 255, 255)",
  height: 25,
  padding: "5px 10px",
  lineHeight: "14px",
  borderRadius: 3,
  boxShadow: "rgb(204, 204, 204) 2px 2px 2px",
  whiteSpace: "nowrap",
  fontSize: 12,
  userSelect: "none",
};
function HouseDetail() {
  const state = {
    // 数据加载中的状态
    isLoading: false,

    // 房屋详情
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: "",
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: "两室一厅",
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: "精装",
      // 朝向
      oriented: [],
      // 楼层
      floor: "",
      // 小区名称
      community: "",
      // 地理位置
      coord: {
        latitude: "39.928033",
        longitude: "116.529466",
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: "",
      // 房屋描述
      description: "",
    },
    // 表示房源是否收藏
    isFavorite: false,
  };
  const [data, setdata] = useState(state);
  const [visible, setVisible] = useState(false);
  const { id } = useParams();
  const history = useNavigate()
  async function getHouseDetail() {
    // 开启loading
    const res = await API.get(`/houses/${id}`);
    setdata({
      ...data,
      houseInfo: res.data.body,
      isLoading: true,
    });
    const { community, coord } = res.data.body;
    renderMap(community, coord);
  }

  // 渲染地图
  function renderMap(community, coord) {
    const { latitude, longitude } = coord;

    const map = new BMap.Map("map");
    const point = new BMap.Point(longitude, latitude);
    map.centerAndZoom(point, 17);

    const label = new BMap.Label("", {
      position: point,
      offset: new BMap.Size(0, -36),
    });

    label.setStyle(labelStyle);
    label.setContent(`
        <span>${community}</span>
        <div class="${styles.mapArrow}"></div>
        `);
    map.addOverlay(label);
  }

  // 渲染轮播图
  function renderSwipers() {
    const {
      houseInfo: { houseImg },
    } = data;
    return (
      <Swiper autoplay loop autoplayInterval={5000}>
        {houseImg.map((item) => (
          <Swiper.Item
            key={item}
            onClick={() => {
              setVisible(true);
            }}
          >
            <img src={BASE_URL + item} alt="" />
          </Swiper.Item>
        ))}
      </Swiper>
    );
  }
  function preview() {
    const {
      houseInfo: { houseImg },
    } = data;
    let newhouseImg = [];
    houseImg.forEach((v) => {
      let src = `${BASE_URL}${v}`;
      newhouseImg.push(src);
    });
    return (
      <ImageViewer.Multi
        images={newhouseImg}
        visible={visible}
        defaultIndex={1}
        onClose={() => {
          setVisible(false);
        }}
      />
    );
  }

  // 渲染标签
  function renderTags() {
    const {
      houseInfo: { tags },
    } = data;

    return tags.map((item, index) => {
      let tagClass = "";
      if (index > 2) {
        tagClass = "tag3";
      } else {
        tagClass = "tag" + (index + 1);
      }
      return (
        <span key={item} className={[styles.tag, styles[tagClass]].join(" ")}>
          {item}
        </span>
      );
    });
  }
  async function handleFavorite() {
    const isLogin = false;
    if (!isLogin) {
      // 未登录
      const result = await Modal.confirm({
        content: '未登录请登录',
      })
      if (result) {
        history('/login')
      } else {
        Toast.show({ content: '点击了取消', position: 'bottom' })
      }
    }
  }
  useEffect(() => {
    getHouseDetail();
  }, []);
  const {
    isLoading,
    houseInfo: {
      community,
      title,
      tags,
      price,
      roomType,
      size,
      floor,
      oriented,
      supporting,
      description,
    },
    isFavorite,
  } = data;
  return (
    <div className={[styles.root].join(" ")}>
      {/* 导航栏 */}
      <NavHeader
        className={styles.navHeader}
        rightContent={[<i className="iconfont icon-share"></i>]}
        title={community}
      ></NavHeader>

      {/* 轮播图 */}
      {/* 调用渲染轮播图的方法 */}
      <div className={styles.slides}>
        {isLoading ? renderSwipers() : ""}
        {visible ? preview() : ""}
      </div>

      {/* 房屋基础信息 */}
      <div className={styles.info}>
        <h3 className={styles.infoTitle}>{title}</h3>
        <Space className={styles.tags}>
          <div>{renderTags()}</div>
        </Space>

        <Space className={styles.infoPrice}>
          <div className={styles.infoPriceItem}>
            <div>
              {price}
              <span className={styles.month}>/月</span>
            </div>
            <div>租金</div>
          </div>
          <div className={styles.infoPriceItem}>
            <div>{roomType}</div>
            <div>房型</div>
          </div>
          <div className={styles.infoPriceItem}>
            <div>{size}平米</div>
            <div>面积</div>
          </div>
        </Space>

        <Space className={styles.infoBasic} align="start">
          <div>
            <span className={styles.title}>装修：</span>
            精装
          </div>
          <div>
            <span className={styles.title}>楼层：</span>
            {floor}
          </div>
          <div>
            <span className={styles.title}>朝向：</span>
            {oriented.join("、")}
          </div>
          <div>
            <span className={styles.title}>类型：</span>普通住宅
          </div>
        </Space>
      </div>
      {/* 地图位置 */}
      <div className={styles.map}>
        <div className={styles.mapTitle}>
          小区：
          <span>天山星城</span>
        </div>
        <div className={styles.mapContainer} id="map">
          地图
        </div>
      </div>
      {/* 房屋配套 */}
      <div className={styles.about}>
        <div className={styles.houseTitle}>房屋配套</div>
        {supporting.length === 0 ? (
          <div className="title-empty">暂无数据</div>
        ) : (
          <HousePackage list={supporting} />
        )}
      </div>
      {/* 房屋概况 */}
      <div className={styles.set}>
        <div className={styles.houseTitle}>房源概况</div>
        <div>
          <div className={styles.contact}>
            <div className={styles.user}>
              <img src={BASE_URL + "/img/avatar.png"} alt="头像" />
              <div className={styles.useInfo}>
                <div>王女士</div>
                <div className={styles.userAuth}>
                  <i className="iconfont icon-auth" />
                  已认证房主
                </div>
              </div>
            </div>
            <span className={styles.userMsg}>发消息</span>
          </div>
          <div className={styles.descText}>{description || "暂无房屋描述"}</div>
        </div>
      </div>

      {/* 推荐 */}
      <div className={styles.recommend}>
        <div className={styles.houseTitle}>猜你喜欢</div>
        <div className={styles.items}>
          {recommendHouses.map((item) => (
            <HouseItem {...item} key={item.id} />
          ))}
        </div>
      </div>
      {/* 底部收藏按钮 */}
      <Space
        className={[styles.fixedBottom, "roottwo"].join(" ")}
        justify="around"
      >
        <div onClick={handleFavorite}>
          <img
            src={BASE_URL + (isFavorite ? "/img/star.png" : "/img/unstar.png")}
            className={styles.favoriteImg}
            alt="收藏"
          />
          <span className={styles.favorite}>
            {isFavorite ? "已收藏" : "收藏"}
          </span>
        </div>
        <div>在线咨询</div>
        <div>
          <a href="tel:400-618-4000" className={styles.telephone}>
            电话预约
          </a>
        </div>
      </Space>
    </div>
  );
}

export default HouseDetail;
