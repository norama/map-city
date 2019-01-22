import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import JsonTable from 'ts-react-json-table';

import { ReactLeafletSearch } from 'react-leaflet-search';

import './WeatherMap.css';
import './JsonTable.css';

import {
    Map,
    TileLayer,
    Marker,
    Popup,
    ZoomControl,
    withLeaflet
} from 'react-leaflet';

import getWeather from '../services/WeatherData';

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

        return (<div className='weather-Root'>
        <Map 
            center={this.state.center} 
            onLocationfound={this.handleLocationFound}
            onMoveend={this.handleMoveEnd}
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
        </div>)
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
                    const c = this.state.center;
                    const r = 0.2;
                    this.mapRef.current.leafletElement.fitBounds([
                        { lat: c.lat - r, lng: c.lng - r }, 
                        { lat: c.lat + r, lng: c.lng + r }
                    ]);
                }
            });
        });

    }

    handleLocationFound = (e) => {
        this.addMarker(e.latlng, true);
    };

    handleMoveEnd = (e) => {
        console.log('Moveend');
        console.log(this.mapRef.current.leafletElement.getCenter());
    }

    handleClick = (e) => {
        this.addMarker(e.latlng);
    }

    componentDidMount() {
        this.mapRef.current.leafletElement.locate();
    }
}

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
}

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
                    <Weather
                        weather={this.props.data.weather.weather}
                        caption={this.props.data.weather.name + ' ('+ this.props.data.weather.country +')'}
                    />
                    <Photos photos={this.props.data.photos} />
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

const Weather = ({ weather, caption }) => {
    const w = weather;
    const rows = [{
        name: w.summary, value: w.description
    }, {
        name: w.temperature + ' \u2103', value: ''
    }, {
        name: 'wind speed', value: w.wind.speed + ' m/s'
    }, {
        name: 'wind dir', value: (w.wind.direction ? w.wind.direction + '\u02DA': '')
    }, {
        name: 'pressure', value: w.pressure + ' hPa'
    }];

    return (
        <JsonTable caption={caption} rows={rows} settings={{header: false}} />
    );
};

const Photos = ({ photos }) => (
    <div className="weather-Popup-photos">
        {photos.map((photo) => (<a key={photo} href={photo} target="_blank" rel="noopener noreferrer">Photo nearby </a>))}

        {/*photos.map((photo) => (<img key={photo} src={photo} width={120} height={120} alt="near location" />))*/}
    </div>
);


