const TONKEN_NAME = "look_token";

// 获取token
const getToken = () => localStorage.getItem(TONKEN_NAME);

// 设置token
const setToken = (value) => localStorage.setItem(TONKEN_NAME, value);

// 删除token
const removeToken = () => localStorage.removeItem(TONKEN_NAME);

// 是否登录（有权限）
const isAuth = () => !!getToken();

export { getToken, setToken, removeToken, isAuth };
