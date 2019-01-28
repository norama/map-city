import React, { Component } from 'react';
import WeatherMap from './WeatherMap';
import PhotoList from './PhotoList';

import './Main.css';

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            location: null
        }
    }

    render() {
        return (
            <div className="Main-root">
                <div className="Main-weather-map"><WeatherMap onLocationChange={this.handleLocationChange} /></div>
                <div className="Main-photo-list"><PhotoList location={this.state.location} /></div>
            </div>
        );
    }

    handleLocationChange = (location) => {
        this.setState({ location });
    }
}

export default Main;