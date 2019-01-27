import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PhotoList extends Component {
    render() {
        return (
            <div>
                {this.props.photos.map((photo) => (
                    <a href={photo.view ? photo.view : photo.url} key={photo.url} target="_blank" rel="noopener noreferrer">
                        <img src={photo.url} alt="" />
                    </a>
                ))}
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