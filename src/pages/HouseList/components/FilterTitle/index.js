import React from "react";

import { Space } from "antd-mobile";

import styles from "./index.module.css";

const titleList = [
    { title: "区域", type: "area" },
    { title: "方式", type: "mode" },
    { title: "租金", type: "price" },
    { title: "筛选", type: "more" },
];


export default function FilterTitle({ titleSelectedStatus,onClick }) {
    return (
        <Space className={styles.root} justify="around">
            {titleList.map(item => {
                const isSlected = titleSelectedStatus[item.type]
                return (
                    <div key={item.type} onClick={() => onClick(item.type)}>
                        <span
                            className={[
                                styles.dropdown, 
                                isSlected ? styles.selected : "",
                            ].join(" ")}
                        >
                            <span>{item.title}</span>
                            <i className="iconfont icon-arrow"></i>
                        </span>
                    </div>
                )
            })}
        </Space>
    )
}