import React from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";
import {useNavigate} from "react-router-dom"

function HouseItem({ src, title, desc, tags, price, route, style }) {
  const history = useNavigate();
  function godetails(){
    if(route){
      history(route)
    }else{
      console.log("暂没功能");
    }
  }
  return (
    <div className={styles.house} onClick={godetails} style={style} >
      <div className={styles.imgWrap}>
        <img className={styles.img} src={src} alt="" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        <div>
          {tags.map((tag, index) => {
            const tagClass = "tag" + (index + 1);
            return (
              <span
                className={[styles.tag, styles[tagClass]].join(" ")}
                key={tag}
              >
                {tag}
              </span>
            );
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span>元/月
        </div>
      </div>
    </div>
  );
}

HouseItem.propsTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  tags: PropTypes.array.isRequired,
  price: PropTypes.number,
  onClick: PropTypes.func,
};

export default HouseItem;
