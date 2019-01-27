import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { UserCard } from 'react-ui-cards';

class MapCard extends Component {

    constructor(props) {
        super(props);

        this.cardRef = React.createRef();
    }

    render() {

        const weather = this.props.weather.weather;
        const title = this.props.weather.name + ' ('+ this.props.weather.country +')';
        const photo = this.props.photos.length ? this.props.photos[0].url : weather.icon;
        const view = this.props.photos.length ? this.props.photos[0].view : null;
    
        const temperature = weather.temperature + ' \u02DAC';
        const details = weather.summary + ': ' + weather.description;
        const wind = weather.wind.speed + ' m/s' +
                        (weather.wind.direction ? ', ' + weather.wind.direction + '\u02DA': '');
        const pressure = weather.pressure + ' hPa';
    
        return (
            <UserCard
                ref={this.cardRef}
                cardClass='weather-Card'
                header={photo}
                avatar={weather.icon}
                name={temperature}
                positionName={details}
                href={view ? view : photo}
                stats={[{
                    name: 'wind',
                    value: wind
                }, {
                    name: 'pressure',
                    value: pressure
                }]}
            >
                <div className='weather-Card-content'>{title}</div>
            </UserCard>
        );
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.cardRef.current);
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
    }

}

MapCard.propTypes = {
    weather: PropTypes.object,
    photos: PropTypes.array
};

export default MapCard;
