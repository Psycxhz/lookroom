import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { API } from "../../utils/api";
import { BASE_URL } from "../../utils/url";
import { Grid, Button, Modal } from "antd-mobile";

import { isAuth, getToken, removeToken } from "../../utils/auth";

import NavHeader from "../../components/NavHeader";
import HouseItem from "../../components/HouseItem";
import NoHouse from "../../components/NoHouse";

import styles from "./index.module.css";
// 菜单数据
const menus = [
  { id: 1, name: "我的收藏", iconfont: "icon-coll", to: "/favorate" },
  { id: 2, name: "我的出租", iconfont: "icon-ind", to: "/rent" },
  { id: 3, name: "看房记录", iconfont: "icon-record" },
  {
    id: 4,
    name: "成为房主",
    iconfont: "icon-identity",
  },
  { id: 5, name: "个人资料", iconfont: "icon-myinfo" },
  { id: 6, name: "联系我们", iconfont: "icon-cust" },
];
// 默认头像
const DEFAULT_AVATAR = BASE_URL + "/img/profile/avatar.png";
function Profile() {
  const history = useNavigate();
  const [state, setState] = useState({
    // 是否登录
    isLogin: isAuth(),
    // 用户信息
    userInfo: {
      avatar: "",
      nickname: "",
    },
  });
  async function getUserInfo() {
    if (!state.isLogin) {
      // 未登录
      return;
    }
    // 发送请求，获取个人资料
    const res = await API.get("/user", {
      headers: {
        authorization: getToken(),
      },
    });
    if (res.data.status === 200) {
      const { avatar, nickname } = res.data.body;
      setState({
        ...state,
        userInfo: {
          avatar: BASE_URL + avatar,
          nickname,
        },
      });
    }
  }

  // 退出
  const logout = async () => {
    const result = await Modal.confirm({
      content: "是否确定退出？",
    });
    if (result) {
      // 调用退出接口
      API.post("/user/logout", null, {
        headers: {
          authorization: getToken(),
        },
      });
      // 移除本地token
      removeToken();

      // 处理状态
      setState({
        ...state,
        isLogin: false,
        userInfo: {
          avatar: "",
          nickname: "",
        },
      });
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  const {
    isLogin,
    userInfo: { avatar, nickname },
  } = state;
  return (
    <div className={styles.root}>
      {/* 个人信息 */}
      <div className={styles.title}>
        <img
          className={styles.bg}
          src={BASE_URL + "/img/profile/bg.png"}
          alt="背景图"
        />
        <div className={styles.info}>
          <div className={styles.myIcon}>
            <img
              className={styles.avatar}
              src={avatar || DEFAULT_AVATAR}
              alt="icon"
            />
          </div>
          <div className={styles.user}>
            <div className={styles.name}>{nickname || "游客"}</div>
            {/* 展示内容： */}
            {isLogin ? (
              // 登录后展示
              <>
                <div className={styles.auth}>
                  <span onClick={logout}>退出</span>
                </div>
                <div className={styles.edit}>
                  编辑个人资料
                  <span className={styles.arrow}>
                    <i className="iconfont icon-arrow" />
                  </span>
                </div>
              </>
            ) : (
              // 未登录展示
              <div className={styles.edit}>
                <Button
                  type="primary"
                  size="small"
                  inline
                  onClick={() => history("/login")}
                >
                  去登录
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Grid className={styles.Grid} columns={3} gap={40}>
        {menus.map((item) => {
          return (
            <Grid.Item key={item.id}>
              {item.to ? (
                <Link to={item.to}>
                  <div className={styles.menuItem}>
                    <i className={`iconfont ${item.iconfont}`} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              ) : (
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )}
            </Grid.Item>
          );
        })}
      </Grid>

      {/* 加入我们 */}
      <div className={styles.ad}>
        <img src={BASE_URL + "/img/profile/join.png"} alt="" />
      </div>
    </div>
  );
}
export default Profile;
