import React from "react";
import { Space, Toast } from "antd-mobile";
import { Link, useNavigate,useLocation  } from "react-router-dom";
import NavHeader from "../../components/NavHeader";

// 导入withFormik
import { withFormik, Form, Field, ErrorMessage } from "formik";
// 导入API
import { API } from "../../utils/api";
// 导入Yup
import * as yup from "yup";
import styles from "./index.module.css";

// 验证规则
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;

const Login = (props)=>{
  return (
    <div className={styles.root}>
      {/* 顶部导航 */}
      <NavHeader className={styles.navHeader} title="账号登录"></NavHeader>

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
            登 录
          </button>
        </div>
      </Form>
      <Space className={styles.backHome}>
        <div>
          <Link to="/registe">还没有账号，去注册~</Link>
        </div>
      </Space>
    </div>
  );
}
const MyComponent = props => {
  const history = useNavigate()
  const location = useLocation()
  return (
      <MyEnhancedForm history={ history } location={location} />
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
      console.log(props);
      const { username, password } = values;
      const res = await API.post("/user/login", {
        username,
        password,
      });
      const { status, body, description } = res.data;
      if (status === 200) {
        // 登陆成功
        localStorage.setItem("look_token", body.token);
        props.history(props.location.state.datas)
      } else {
        // 登陆失败
        Toast.show({content:description});
      }
    },
    displayName: 'BasicForm',
})(Login)
export default MyComponent;
