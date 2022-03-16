import React from "react";
import { Button, Space, Swiper, Toast } from 'antd-mobile'
import "./index.css"
import axios from "axios";

export default class index extends React.Component{
    state = {
        swiperdata:[]
    }
    async getSwiper(){
        const {data} = await axios.get("http://localhost:8080/home/swiper")
        this.setState({
            swiperdata : data.body
        })
    }
    items = ()=>{
        console.log(this.state.swiperdata);
        return (
            this.state.swiperdata.map((item) => (
                <Swiper.Item key={item.id}>
                  <div
                    className="content"
                    onClick={() => {
                      Toast.show(`你点击了卡片 ${index + 1}`)
                    }}
                  >
                    <img src= {`http://localhost:8080${item.imgSrc}`} alt = ""></img>
                  </div>
                </Swiper.Item>
            ))
        )
    }
    async componentDidMount(){
        this.getSwiper()
    }
    render(){
        return(
            <div>
                <Swiper autoplay loop>{this.items()}</Swiper>
            </div>
        )
    }
}