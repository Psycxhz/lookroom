import React from "react";
import { Map, NavigationControl } from 'react-bmapgl';
import "./index.css"
export default class MyMap extends React.Component {
    render() {
        return (
            <div className="map">
                <Map style={{height: "100%"}} center={{ lng: 116.402544, lat: 39.928216 }}>
                    <NavigationControl />
                </Map>
            </div>
        )
    }
}