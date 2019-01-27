import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { UserCard } from 'react-ui-cards';

import { ReactLeafletSearch } from 'react-leaflet-search';

import MapCard from './MapCard';

import './WeatherMap.css';

import {
    Map,
    TileLayer,
    Marker,
    Popup,
    ZoomControl,
    withLeaflet
} from 'react-leaflet';

import getWeather from '../services/getWeather';

class WeatherMapSearch extends ReactLeafletSearch {

    constructor(props, context) {
        super(Object.assign({ showMarker: false }, props), context);
    }

    latLngHandler(latLng, info) {

        this.setState({ search: latLng, info: info }, () => {

            const latlng = {
                lat: latLng[0],
                lng: latLng[1]
            };

            this.props.addMarker(latlng, true);
        });
    }

    render() {
        return null;
    }
}

const Search = withLeaflet(WeatherMapSearch);

export default class WeatherMap extends Component {

    constructor(props) {
        super(props);

        this.mapRef = React.createRef();

        this.state = {
            markers: [],
            center: {
                lat: 51.505,
                lng: -0.09,
            },
            zoom: 13,
        };
    }

    render() {

        return (
            <div className='weather-Root'>
                <Map
                    className='weather-Root'
                    center={this.state.center} 
                    onLocationfound={this.handleLocationFound}
                    onDragend={this.handleDragEnd}
                    onClick={this.handleClick}
                    ref={this.mapRef}
                    zoomControl={false}
                    zoom={this.state.zoom}>

                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl
                        position="bottomright"
                    />
                    <Search
                        position="topleft"
                        inputPlaceholder="Enter place"
                        provider="OpenStreetMap"
                        showMarker={true}
                        showPopup={true}
                        addMarker={this.addMarker}
                        openSearchOnLoad={true}
                        closeResultsOnClick={true}
                    />
                    <WeatherMarkersList markers={this.state.markers} onDragend={this.updateMarker} />
                </Map>
            </div>
        )
    }

    addMarker = (latlng, centralize) => {
        this.updateMarker(_.uniqueId('marker-'), latlng, centralize);
    };

    updateMarker = (id, latlng, centralize=false) => {
        const self = this;
        getWeather(latlng, (data) => {
            self.setState((prevState) => {
                let markers = _.clone(prevState.markers);

                const index = _.findIndex(markers, {id});
                if (index !== -1) {
                    markers[index].data = data;
                    markers[index].latlng = latlng;
                } else {
                    markers.push({
                        id, data, latlng
                    });
                }

                const center = centralize ? latlng : prevState.center;

                return {
                    markers,
                    center
                };
            }, () => {

                if (centralize) {

                    // centralize workaround, 
                    // for some reason setting state.center is not enough
                    setTimeout(() => {
                        const c = this.state.center;
                        const r = 0.2;

                        this.mapRef.current.leafletElement.fitBounds([
                            { lat: c.lat - r, lng: c.lng - r }, 
                            { lat: c.lat + 4*r, lng: c.lng + r }
                        ]);
                    }, 500);
                }
            });
        });

        this.props.onPositionChange(latlng);

    }

    handleLocationFound = (e) => {
        this.addMarker(e.latlng, true);
    };

    handleDragEnd = (e) => {
        this.mapRef.current.leafletElement.closePopup();
        const latlng = this.mapRef.current.leafletElement.getCenter();
        this.props.onPositionChange(latlng);
    };

    handleClick = (e) => {
        this.addMarker(e.latlng);
    };

    componentDidMount() {
        this.mapRef.current.leafletElement.locate();
    }
}

WeatherMap.propTypes = {
    onPositionChange: PropTypes.func.isRequired
};

class WeatherMarkersList extends Component {
    render() {
        const onDragend = this.props.onDragend;
        const items = this.props.markers.map((marker) => (
            <WeatherMarker
                key={marker.id}
                id={marker.id}
                latlng={marker.latlng}
                data={marker.data}
                onDragend={onDragend}
            />
        ));
        return <div style={{ display: 'none' }}>{items}</div>;   
    }
}

WeatherMarkersList.propTypes = {
    markers: PropTypes.array.isRequired,
};

class WeatherMarker extends Component {

    constructor(props) {
        super(props);

        this.markerRef = React.createRef();
    }

    render() {
        return (
            <Marker
                ref={this.markerRef}
                position={this.props.latlng}
                draggable={true}
                onDragend={this.handleDragend}>

                <Popup className='weather-Popup'>
                    <MapCard weather={this.props.data.weather} photos={this.props.data.photos} />
                </Popup>
            </Marker>
        );
    }

    componentDidMount() {
        this.markerRef.current.leafletElement.openPopup();
    }

    componentDidUpdate(prevProps) {
        if (this.props.latlng !== prevProps.latlng || this.props.weather !== prevProps.weather) {
            this.markerRef.current.leafletElement.openPopup();
        }
    }

    handleDragend = (e) => {
        this.props.onDragend(this.props.id, e.target._latlng);
    };
}
