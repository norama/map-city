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
          provider="OpenStreetMap"
          showMarker={true}
          showPopup={true}
          addMarker={this.addMarker}
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
      const weather = data.weather;
      self.setState((prevState) => {
        let markers = _.clone(prevState.markers);

        const index = _.findIndex(markers, {id});
        if (index !== -1) {
          markers[index].weather = weather;
          markers[index].latlng = latlng;
        } else {
          markers.push({
            id, weather, latlng
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
      <WeatherMarker key={marker.id} id={marker.id} latlng={marker.latlng} weather={marker.weather} onDragend={onDragend} />
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
          <WeatherPopup weather={this.props.weather} />
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

const WeatherPopup = ({ weather }) => {
  const w = weather;
  const rows = [{
    name: 'position', value: '(lat: '+w.latlon.lat + ', lon: '+w.latlon.lon + ')'
  }, {
    name: 'place', value: w.name + ' ('+ w.country +')'
  }, {
    name: 'weather', value: w.weather.summary + ': ' + w.weather.description
  }, {
    name: 'wind', value: 'speed (m/s): ' + w.weather.wind.speed + (w.weather.wind.direction ? '  direction (degrees): ' + w.weather.wind.direction : '')
  }, {
    name: 'humidity (%)', value: w.weather.humidity
  }, {
    name: 'pressure (hPa)', value: w.weather.pressure
  }, {
    name: 'temperature (\u2103)', value: w.weather.temperature
  }];

  return <JsonTable rows={rows} settings={{header: false}} />;
};
 

