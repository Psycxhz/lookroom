const TOKEN_NAME = "look_room";

// 获取当前定位城市
const getCity = () => JSON.parse(localStorage.getItem(TOKEN_NAME)) || {};

// 设置当前定位城市
const setCity = (value) => localStorage.getItem(TOKEN_NAME, value);

export { getCity, setCity };