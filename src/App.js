import React,{lazy, Suspense} from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
// import CityList from "./pages/CityList";
// import MyMap from "./pages/MyMap";

const CityList = lazy(() => import("./pages/CityList"));
const MyMap = lazy(() => import("./pages/MyMap"));
const HouseDetail = lazy(() => import("./pages/Housedetail"));
const Login = lazy(() => import("./pages/Login"));
const Registe = lazy(() => import("./pages/Registe"));

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Suspense fallback={<div className="route-loading">loading...</div>}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home/*" element={<Home />}></Route>
            <Route path="/cityList" element={<CityList />}></Route>
            <Route path="/map" element={<MyMap />}></Route>
            {/* 房源详情路由规则 */}
            <Route path="/detail/:id" element={<HouseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registe" element={<Registe />} />
          </Routes>
        </div>
        </Suspense>
      </Router>
    );
  }
}
