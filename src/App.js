import React from 'react';
import './App.css';
import {BrowserRouter as Router,Routes, Route,} from 'react-router-dom'
import Home from './pages/Home';
import CityList from './pages/CityList';

export default class App extends React.Component{
    render(){
        return (
          <Router>  
            <div className='App'>
              <Routes>
                <Route path='/home/*' element = {<Home />}></Route>
                <Route path='/cityList' element = {<CityList />}></Route>
              </Routes>
            </div>
          </Router> 
        )
    }
}
