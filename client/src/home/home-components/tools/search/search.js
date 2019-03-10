import React, { Component } from 'react';
import './search.css';
import './videos.css';

import VideoSearch from './videos';

class Search extends Component {

    constructor(props) {
  
        super(props);

        this.state = {

            type: false,
            value: false,
            order: false,
            search: false

        }

        this.videos = this.videos.bind(this);
        this.playlists = this.playlists.bind(this);
        this.channels = this.channels.bind(this);
        this.sendForm = this.sendForm.bind(this);

    }

    videos() {

        this.setState({type: "video", search: true})

    }

    playlists() {

        this.setState({type: "playlist", search: true})

    }

    channels() {

        this.setState({type: "channel", search: true})

    }

    sendForm(e) {

        let value = e.target.searchVideo.value;
        let order = e.target.order.value;
 
        this.setState({
    
            value: value,
            order: order,
            type: this.state.type
    
        });

    }

    render() {

        let video =  <span onClick={this.videos}>Videos</span>;
        let playlist = <span onClick={this.playlists}>Playlists</span>;
        let channel =  <span onClick={this.channels}>Channels</span>;
        let videoSearch;
        let type = this.state.type;
        let value = this.state.value;
        let order = this.state.order;
        let search;


        if (this.state.value && this.state.order && this.state.type) {
    
            videoSearch = <VideoSearch url_id={this.props.url_id} id={this.props.id} reason={this.props.reason} value={value} type={type} order={order}/>;
    
        }    

        if (this.state.search === false) {

            search = <p></p>

        }

        if (this.state.search === true) {

            search =  <section className="video-search">
            <form onSubmit={(e) => {e.preventDefault(); this.sendForm(e)}} className="search-form">
            <input name="searchVideo" className="search-form-text" type="text" placeholder={`Search for ${type}...`} />
            <select defaultValue="relevance" name="order" className="video-select">
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="relevance">Relevance</option>
            <option value="title">Title</option>
            <option value="videoCount">Video Count</option>
            <option value="viewCount">View Count</option>
            </select>
            <input  className="search-form-button" type="submit" value="Search" />
            </form>
            {videoSearch}
            </section>

        }

        if (this.state.type === "video") {

            video = <span onClick={this.videos} className="search-selected">Videos</span>

        }

        if (this.state.type === "playlist") {

            playlist = <span className="search-selected" onClick={this.playlists}>Playlists</span>;

        }

        if (this.state.type === "channel") {

            channel = <span className="search-selected" onClick={this.channels}>Channels</span>;

        }

    return <section className="playlist-search">
            <span className="search-title">Search</span>
            <nav className="search-selection"> 
            {video}
            {playlist}
            {channel}
            </nav>
            {search}
            </section>;
    }

};

export default Search;
