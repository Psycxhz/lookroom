import React from 'react';
import './App.css';
import {BrowserRouter as Router,Routes, Route,Navigate} from 'react-router-dom'
import Home from './pages/Home';
import CityList from './pages/CityList';
import MyMap from "./pages/MyMap"

export default class App extends React.Component{
    render(){
        return (
          <Router>  
            <div className='App'>
              <Routes>
                <Route path='/' element = {<Navigate to="/home" />} />
                <Route path='/home/*' element = {<Home />}></Route>
                <Route path='/cityList' element = {<CityList />}></Route>
                <Route path='/map' element = {<MyMap />}></Route>
              </Routes>
            </div>
          </Router> 
        )
    }
}
