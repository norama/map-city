import React, { Component } from 'react';
import PropTypes from 'prop-types';

import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from 'react-loader-spinner';

import getPhotos from '../services/getPhotos';

import './PhotoList.css';

const COUNT = 20;

class PhotoList extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            photos: [],
            page: 1,
            hasMore: true
        }
    }

    render() {
        return (
            <div className="PhotoList-root">
                <InfiniteScroll
                    dataLength={this.state.photos.length}
                    next={this.loadMorePhotos}
                    hasMore={this.state.hasMore}
                    loader={<Loader type="ThreeDots" color="green" width={100} height={50} />}
                    height="100vh"
                >
                    {this.state.photos.map((photo) => (
                        <a href={photo.view ? photo.view : photo.url} key={photo.url} target="_blank" rel="noopener noreferrer">
                            <img src={photo.url} alt="" />
                        </a>
                    ))}
                </InfiniteScroll>
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.position) {
            this.loadPhotos();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    } 

    componentDidUpdate(prevProps) {
        if (this.props.position !== prevProps.position) {
            this.loadPhotos();
        }
    }

    loadPhotos() {
        getPhotos(this.props.position, COUNT, 1, (photos) => {

            if (!this._isMounted) {
                return;
            }

            if (!photos) {
                this.handleLoadError();
                return;
            }

            this.setState({
                photos,
                page: 1,
                hasMore: photos.length !== 0
            });
        });
    }

    loadMorePhotos = () => {
        this.setState((prevState) => (
            prevState.hasMore ? {
                page: prevState.page + 1
            } : null
        ), () => {
            if (this.state.hasMore) {
                getPhotos(this.props.position, COUNT, this.state.page, (photos) => {

                    if (!this._isMounted) {
                        return;
                    }

                    if (!photos) {
                        this.handleLoadError();
                        return;
                    }

                    if (photos.length) {
                        this.setState({
                            photos: this.state.photos.concat(photos)
                        });
                    } else {
                        this.setState({
                            hasMore: false
                        });
                    }
                });
            }
        });
    }

    handleLoadError() {
        console.error('Photo loading failed: could not get photos.');
        this.setState({
            hasMore: false
        });
    }
}

PhotoList.propTypes = {
    photos: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string,
        view: PropTypes.string
    }))
};

export default PhotoList;