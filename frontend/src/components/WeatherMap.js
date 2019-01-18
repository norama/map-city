import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
      this.flyTo();

      const latlng = {
        lat: latLng[0],
        lng: latLng[1]
      };

      this.props.addMarker(latlng);
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

  addMarker = (latlng) => {
    this.updateMarker(_.uniqueId('marker-'), latlng);
  };

  updateMarker = (id, latlng) => {
    const self = this;
    getWeather(latlng, (weather) => {
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

        return {
          markers
        };
      });
    });

  }

  handleLocationFound = (e) => {
    this.setState({
      center: e.latlng
    }, () => {
      this.addMarker(this.state.center);
    });
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
        position={[this.props.latlng.lat, this.props.latlng.lng]}
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
    name: 'position', value: '(lat: '+w.coord.lat + ', lon: '+w.coord.lon + ')'
  }, {
    name: 'place', value: w.name + ' ('+ w.sys.country +')'
  }, {
    name: 'weather', value: w.weather[0].main + ': ' + w.weather[0].description
  }, {
    name: 'wind', value: 'speed (m/s): ' + w.wind.speed + (w.wind.deg ? '  direction (degrees): ' + w.wind.deg : '')
  }, {
    name: 'humidity (%)', value: w.main.humidity
  }, {
    name: 'pressure (hPa)', value: w.main.pressure
  }, {
    name: 'temperature (\u2103)', value: w.main.temp
  }];

  return <JsonTable rows={rows} settings={{header: false}} />;
};
 

