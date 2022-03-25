import React from "react";
import { NavBar } from 'antd-mobile'
import { useNavigate } from "react-router-dom"
// 导入props校验的包
import PropTypes from "prop-types";
import "./index.css"
const Back = ({ title }) => {
    const history = useNavigate()
    const back = () => {
        history(-1)
    }
    return (
        <NavBar icon={<i className="iconfont icon-back" />} onBack={back}>{title}</NavBar>
    )
}

Back.propTypes = {
    title: PropTypes.string.isRequired,
};
export default Back