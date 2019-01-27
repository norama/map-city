import React, { Component } from 'react';
import WeatherMap from './WeatherMap';
import PhotoList from './PhotoList';

import './Main.css';

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            position: null
        }
    }

    render() {
        return (
            <div className="Main-root">
                <div className="Main-weather-map"><WeatherMap onPositionChange={this.handlePositionChange} /></div>
                <div className="Main-photo-list"><PhotoList position={this.state.position} /></div>
            </div>
        );
    }

    handlePositionChange = (position) => {
        this.setState({ position });
    }
}

export default Main;