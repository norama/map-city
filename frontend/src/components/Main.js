import React, { Component } from 'react';
import WeatherMap from './WeatherMap';
import PhotoList from './PhotoList';
import getPhotos from '../services/getPhotos';

import './Main.css';

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            photos: []
        }
    }

    render() {
        return (
            <div className="Main-root">
                <div className="Main-weather-map"><WeatherMap onPositionChange={this.handlePositionChange} /></div>
                <div className="Main-photo-list"><PhotoList photos={this.state.photos} /></div>
            </div>
        );
    }

    handlePositionChange = (position) => {
        getPhotos(position, (photos) => {
            this.setState({ photos });
        });
    }
}

export default Main;