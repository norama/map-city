import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PhotoList extends Component {
    render() {
        return (
            <div>
                {this.props.photos.map((photo) => (<img src={photo.url} alt="" key={photo.url} />))}
            </div>
        );
    }
}

PhotoList.propTypes = {
    photos: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        width: PropTypes.string,
        height: PropTypes.string
    }))
};

export default PhotoList;