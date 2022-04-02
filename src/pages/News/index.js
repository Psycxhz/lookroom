import React from "react";
import { List } from "antd-mobile";
import { API } from "../../utils/api";
import { BASE_URL } from "../../utils/url";
import {getCity} from "..//../utils/city"
import styles from "./index.module.css";

export default class News extends React.Component {
    state={
        newsdata:'',
        isGet:false
    }
  //获取资讯数据
  async getNews() {
      this.setState({
          isGet:false
      })
    const { data } = await API.get("/home/news", {
      params: {
        area: getCity().value,
      },
    });
    this.setState({
      newsdata: data.body,
      isGet:true
    });
  }
  componentDidMount(){
      this.getNews()
  }
  //咨询布局
  renderNews() {
    return this.state.newsdata.map((item) => {
      return (
        <List.Item className="news-item" key={item.id}>
          <div className="imgWrap">
            <img className="img" src={BASE_URL + item.imgSrc} alt="" />
          </div>
          <div className="content" direction="column" justify="between">
            <h3 className="title">{item.title}</h3>
            <div className="info" justify="between">
              <span>{item.from}</span>
              <span>{item.date}</span>
            </div>
          </div>
        </List.Item>
      );
    });
  }
  render() {
    return (
      <div className={styles.root}>
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <List>{this.state.isGet?this.renderNews():null}</List>
        </div>
      </div>
    );
  }
}
