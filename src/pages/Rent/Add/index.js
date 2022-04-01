import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";

import {
  Form,
  Space,
  List,
  Input,
  CascadePicker,
  ImageUploader,
  TextArea ,
  Modal,
  Toast,
} from "antd-mobile";

import { API } from "../../../utils/api";
import NavHeader from "../../../components/NavHeader";
import HousePackge from "../../../components/HousePackage";
import styles from "./index.module.css";
import "./index.css";

// 房屋类型
const roomTypeData = [
  { label: "一室", value: "ROOM|d4a692e4-a177-37fd" },
  { label: "二室", value: "ROOM|d1a00384-5801-d5cd" },
  { label: "三室", value: "ROOM|20903ae0-c7bc-f2e2" },
  { label: "四室", value: "ROOM|ce2a5daa-811d-2f49" },
  { label: "四室+", value: "ROOM|2731c38c-5b19-ff7f" },
];

// 朝向：
const orientedData = [
  { label: "东", value: "ORIEN|141b98bf-1ad0-11e3" },
  { label: "西", value: "ORIEN|103fb3aa-e8b4-de0e" },
  { label: "南", value: "ORIEN|61e99445-e95e-7f37" },
  { label: "北", value: "ORIEN|caa6f80b-b764-c2df" },
  { label: "东南", value: "ORIEN|dfb1b36b-e0d1-0977" },
  { label: "东北", value: "ORIEN|67ac2205-7e0f-c057" },
  { label: "西南", value: "ORIEN|2354e89e-3918-9cef" },
  { label: "西北", value: "ORIEN|80795f1a-e32f-feb9" },
];

// 楼层
const floorData = [
  { label: "高楼层", value: "FLOOR|1" },
  { label: "中楼层", value: "FLOOR|2" },
  { label: "低楼层", value: "FLOOR|3" },
];

function RentAdd() {
  const history = useNavigate();
  const community= {
    name: "",
    id: "",
  }
  const [husetype, setHusetype] = useState(false);
  const [storey, setStorey] = useState(false);
  const [orientation, setOrientation] = useState(false);
  const {state} = useLocation();

  if (state) {
    // 有小区信息数据，存储到状态中
    community.name = state.name;
    community.id = state.id;
  }
  const [data, setData] = useState({
    // 临时图片地址
    tempSlides: [],
    // 小区的名称和id
    community,
    // 价格
    price: "",
    // 房屋类型
    roomType: "",
    // 楼层
    floor: "",
    // 朝向
    oriented: "",
    // 房屋描述
    description: "",
    // 房屋标题
    title: "",
    // 面积
    size: "",
    // 房屋配套
    supporting: "",
    // 房屋图片
    houseImg: "",
  });
  // 取消编辑，返回上一页
  const onCancel = async () => {
    const result = await Modal.confirm({ content: "放弃发布房源？" });
    if (result) {
      history(-1);
    }
  };
  const getValue = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  };
  // 获取房屋配置数据
  const handleSupporting = (selected) => {
    setData({
      ...data,
      supporting: selected.join("|"),
    });
  };
  // 获取房屋图片
  function handleHouseImg(files, type, index) {
    setData({
      ...data,
      tempSlides: files,
    });
  }
  const houseSelect = (roomType) => {
    roomTypeData.forEach((v) => {
      if (v.value === roomType) {
        return v.label;
      } else {
        return null;
      }
    });
  };
  async function addHouse() {
    const {
      tempSlides,
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      title,
      size,
      supporting,
    } = data;
    let houseImg = "";
    if (tempSlides.length > 0) {
      // 已经有上传的图片了
      const form = new FormData();
      tempSlides.forEach((item) => form.append("file", item.file));
      const res = await API.post("/houses/image", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      houseImg = res.data.body.join("|");
    }
    console.log(data);
    // 发布房源
    const res = await API.post("/user/houses", {
      title,
      description,
      houseImg,
      oriented:oriented.value,
      supporting,
      price,
      roomType: roomType.value,
      size,
      floor: floor.value,
      community: community.id,
    });
    if (res.data.status === 200) {
      // 发布成功
      Toast.show({ content: "发布成功" });
      history("/rent");
    } else {
      Toast.show({ content: "服务器偷懒了，请稍后再试~" });
    }
  }
  const {
    price,
    roomType,
    floor,
    oriented,
    description,
    tempSlides,
    title,
    size,
  } = data;
  return (
    <div className={[styles.root, "rootthree"].join(" ")}>
      <NavHeader onLeftClick={onCancel} title={"发布房源"}></NavHeader>
      <Form layout="horizontal">
        <List className={styles.header} renderHeader={() => "房源信息"}>
          <List.Item
            extra={community.name || "请输入小区名称"}
            onClick={() => history("/rent/search")}
          >
            小区名称
          </List.Item>
          <Form.Item label="￥/月">
            <Input
              placeholder="请输入租金/月"
              style={{ "--text-align": "right" }}
              value={price}
              clearable
              onChange={(val) => getValue("price", val)}
            />
          </Form.Item>
          <Form.Item label="㎡">
            <Input
              placeholder="请输入建筑面积"
              style={{ "--text-align": "right" }}
              value={size}
              clearable
              onChange={(val) => getValue("size", val)}
            />
          </Form.Item>
          <CascadePicker
            options={roomTypeData}
            value={[roomType]}
            visible={husetype}
            onConfirm={(val, arr) => {
              setHusetype(false);
              getValue("roomType", arr.items[0]);
            }}
            onCancel={() => {
              setHusetype(false);
            }}
          />
          <List.Item
            extra={roomType ? roomType.label : "请选择"}
            onClick={() => {
              setHusetype(true);
            }}
          >
            户型
          </List.Item>
          <CascadePicker
            options={floorData}
            value={[floor]}
            visible={storey}
            onConfirm={(val, arr) => {
              setStorey(false);
              getValue("floor", arr.items[0]);
            }}
            onCancel={() => {
              setStorey(false);
            }}
          />
          <List.Item
            extra={floor ? floor.label : "请选择"}
            onClick={() => {
              setStorey(true);
            }}
          >
            楼层
          </List.Item>

          <CascadePicker
            options={orientedData}
            value={[oriented]}
            visible={orientation}
            onConfirm={(val, arr) => {
              setOrientation(false);
              getValue("oriented", arr.items[0]);
            }}
            onCancel={() => {
              setStorey(false);
            }}
          />
          <List.Item
            extra={oriented ? oriented.label : "请选择"}
            onClick={() => {
              setOrientation(true);
            }}
          >
            朝向
          </List.Item>
        </List>

        {/* 房屋图像 */}
        <Form.Item className={styles.title} label="房屋标题" layout="vertical">
          <Input
            placeholder="请输入房屋标题"
            value={title}
            clearable
            onChange={(val) => getValue("title", val)}
          />
        </Form.Item>
        <Form.Item className={styles.title} label="房屋图像" layout="vertical">
          <ImageUploader
            value={tempSlides}
            onChange={handleHouseImg}
            multiple={true}
            upload = {null}
            className={styles.imgpicker}
          />
        </Form.Item>
        <Form.Item className={styles.title} label="房屋配置" layout="vertical">
            <HousePackge select onSelect={handleSupporting} />
        </Form.Item>
        <Form.Item className={styles.title} label="房屋描述" layout="vertical">
        <TextArea 
            rows={5}
            placeholder="请输入房屋描述信息"
            value={description}
            onChange={(val) => getValue("description", val)}
          />
        </Form.Item>
      </Form>
      <Space className={styles.bottom}>
          <div className={styles.cancel} onClick={onCancel}>
            取消
          </div>
          <div className={styles.confirm} onClick={addHouse}>
            提交
          </div>
    </Space>
    </div>
  );
}
export default RentAdd;
