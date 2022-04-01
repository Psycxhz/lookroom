import React from "react";
import { Space, Toast } from "antd-mobile";
import { Link, useNavigate } from "react-router-dom";
import NavHeader from "../../components/NavHeader";
import styles from "./index.module.css";
// 导入withFormik
import { withFormik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
// 导入API
import { API } from "../../utils/api";

// 验证规则
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;
function Registe() {
  return (
    <div className={styles.root}>
      {/* 顶部导航 */}
      <NavHeader className={styles.navHeader} title="注册"></NavHeader>
           {/* 登录表单 */}
           <Form className={styles.form} >
        {/* 账号 */}
        {/* 长度为5-8位，只能出现数字、字母、下划线 */}
        <div>
          <Field
            className={styles.input}
            name="username"
            placeholder="请输入账号"
          />
        </div>
        <ErrorMessage
          className={styles.error}
          name="username"
          component="div"
        />
        {/* 密码 */}
        {/* 长度为5-12位，只能出现数字、字母、下划线 */}
        <div className={styles.formItem}>
          <Field
            className={styles.input}
            name="password"
            type="password"
            placeholder="请输入密码"
          />
        </div>
        <ErrorMessage
          className={styles.error}
          name="password"
          component="div"
        />

        <div className={styles.formSubmit}>
          <button className={styles.submit} type="submit">
            注册
          </button>
        </div>
      </Form>
      <Space className={styles.backHome} justify="between">
        <Link to="/home">点我回首页</Link>
        <Link to="/login">已有账号，去登录</Link>
      </Space>
    </div>
  );
}



const MyComponent = props => {
  const history = useNavigate()
  return (
      <MyEnhancedForm history={ history }/>
  )
}
const MyEnhancedForm = withFormik({
    // 提供状态
    mapPropsToValues: () => ({ username: "", password: "" }),

    // 添加表单校验规则
    validationSchema: yup.object().shape({
      username: yup
        .string() 
        .required("账号为必填项")
        .matches(REG_UNAME, "长度为5-8位，只能出现数字、字母、下划线"),
      password: yup
        .string()
        .required("密码为必填项")
        .matches(REG_PWD, "长度为5-12位，只能出现数字、字母、下划线"),
    }),
  
    // 表单的提交事件
    handleSubmit: async (values, { props }) => {
      // 获取账号和密码
      const { username, password } = values;
      const res = await API.post("/user/registered", {
        username,
        password,
      });
  
      const { status, description } = res.data;
      
      if (status === 200) {
          props.history("/login");
      } else {
        //注册失败
        Toast.show({content:description});
      }
    },
    displayName: 'BasicForm',
})(Registe)
export default MyComponent;
