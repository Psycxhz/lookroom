import React from "react";
import { Route, Routes} from "react-router-dom";
import "../News"
import News from "../News";

export default class Home extends React.Component{
    render(){
        return(
            <div>首页
                {/* <News></News> */}
                <Routes>
                    <Route path="/news" element = {<News />}></Route>
                </Routes>
            </div>
        )
    }
}