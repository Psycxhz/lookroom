import axios from "axios";

export const getCurrentCity = ()=>{
    const localCity = JSON.parse(localStorage.getItem("look_room"));
    if (!localCity) {
        return new Promise((resolve, reject) => {
          // 如果没有
          const curCity = new window.BMapGL.LocalCity();
          curCity.get(async (res) => {
            try {
              const result = await axios.get(
                `http://localhost:8080/area/info?name=${res.name}`
              );
              // 保存到本地存储中
              localStorage.setItem("look_room", JSON.stringify(result.data.body));
              resolve(result.data.body);
            } catch (e) {
              // 获取定位城市失败
              reject(e);
            }
          });
        });
      }
      return Promise.resolve(localCity);
}