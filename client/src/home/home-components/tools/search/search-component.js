import React, { Component } from 'react';
import './search-component.css'
import gapi from './api/gapi';
import moment from 'moment';

import AddPlaylist from './playlist-adder/playlist-add';
import AddVideo from './playlist-adder/add-video';
import AddChannel from './playlist-adder/add-channel';


const Duration = function Duration(props) {

    let invisible = {display: 'block'};

    if (props.type !== 'video') {

            invisible = {display: "none"};
     
    }


    if (props.duration === false) {

        invisible = {display: "none"};

    }

    return <span style={invisible}>{props.duration}</span>

}

const Views = function Views(props) {

    let invisible = {display: 'block'};

    if (props.type !== 'video') {


        invisible = {display: "none"};

    }

    return <span style={invisible}>  {`${props.views} views`}  </span>

}

class SComponent extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

            duration: false,
            views: 0,
            channelTitle: false,
	    ready: false

        }
	this._isMounted = false;
        this.searchVideo = this.searchVideo.bind(this);

	this.showComponent = this.showComponent.bind(this);

    }

    searchVideo(id, type) {

        // 2. Initialize the JavaScript client library.
        window.gapi.client.init({
            'apiKey': 'AIzaSyC2ug6S36OHIhJ0ndNgm0rkA7dLRCCJ5_0',
            // clientId and scope are optional if auth is not required.
            'clientId': '786495793352-25apkhlgdh2bqld49daa22h8g61ou6va.apps.googleusercontent.com',
            'scope': 'profile',
            }).then(function() {
            // 3. Initialize and make the API request.
            return window.gapi.client.request({ 
                'path': `https://www.googleapis.com/youtube/v3/${type}s`,
                'params': {
                'part': 'snippet, contentDetails, statistics',
                'id': `${id}`,
                'videoEmbeddable': 'true'
            }
            })
            }).then((data) => {

            let rawViews = data.result.items[0].statistics.viewCount;
            let views = rawViews;

            if (rawViews > 999) {

                views = `${rawViews.slice(0, -3)}k`;

            }

            if (rawViews > 999999) {

                views = `${rawViews.slice(0, -6)}M`;

            }

            if (rawViews > 999999999) {

                views = `${rawViews.slice(0, -9)}B`;

            }
         
            let format = moment.duration(data.result.items[0].contentDetails.duration);
            let hours = "";
            let minutes = format._data.minutes;
            let seconds = format._data.seconds;

            if (format._data.hours !== 0) {

                hours = `${format._data.hours}:`;

            }

            if (format._data.minutes < 10) {

                minutes = `0${format._data.minutes}`

            }

            if (format._data.seconds < 10) {

                seconds = `0${format._data.seconds}`
                
            }
            
            let duration = `${hours}${minutes}:${seconds}`;

            let published = data.result.items[0].snippet.publishedAt;
            let publishedAt = moment(published).fromNow();

            this.setState({

                duration: duration,
                views: views,
                channelTitle: data.result.items[0].snippet.channelTitle,
                publishedAt: publishedAt,
		ready: true

            })
}
            
            ).catch((error) => {console.log(error)});

        }


    componentDidMount() {

        let componentThis = this;
        let id;
        let type = this.props.type;

        if (this.props.info.id) {

            id = this.props.info.id.videoId;

        }

        if (this.props.info.contentDetails) {

            id = this.props.info.contentDetails.videoId;

        }

        if (type === "video") {

            window.gapi.load('client', function() {

        componentThis.searchVideo(id, type);
        
            });

        }  

    }

    showComponent() {

	let type = this.props.type;

	if (!this.state.ready) {	

		this.setState({ready: true});		

	}


    }

    render() {

        let overlay;
        let thumbnail;
        let title;
        let channelTitle = this.state.channelTitle;
        let publishedAt = this.state.publishedAt;
        let description;
	let cosmetic;

            if (this.props.info.snippet.title.length > 55) {

                title = `${this.props.info.snippet.title.slice(0, 56)}...`;

            }

            if (this.props.info.snippet.title.length <= 55) {

                title = this.props.info.snippet.title;

            }

            if (!this.props.info.snippet.thumbnails) {

                thumbnail = '/placeholder.jpeg';

            }

            if (this.props.info.snippet.thumbnails) {

                    thumbnail = this.props.info.snippet.thumbnails.medium.url;

            }
        
            if (this.props.type === "video") {

            overlay = <AddVideo url_id={this.props.url_id} id={this.props.id} reason={this.props.reason} duration={this.state.duration} views={this.state.views} info={this.props.info} />
 
            }

            if (this.props.type === "playlist") {

                let published = this.props.info.snippet.publishedAt;
                overlay = <AddPlaylist url_id={this.props.url_id} id={this.props.id} reason={this.props.reason}  type={this.props.type} order={this.props.order} info={this.props.info} />
                publishedAt = moment(published).fromNow();
                channelTitle = this.props.info.snippet.channelTitle;

            }
    
            if (this.props.type === "channel") {

                let published = this.props.info.snippet.publishedAt;
                overlay = <AddChannel url_id={this.props.url_id} id={this.props.id} reason={this.props.reason}  info={this.props.info} />;
                description = this.props.info.snippet.description;
                publishedAt = moment(published).fromNow();
                channelTitle = this.props.info.snippet.channelTitle;
                
            }

	    if (this.state.ready) {

		cosmetic = {opacity: 1};


		}

        return (<div style={cosmetic} className="search-component">
                    {overlay}
                    <div className="snippet-container">
                    <Duration type={this.props.type} duration={this.state.duration}></Duration>
                    <img onLoad={this.showComponent} alt={title} src={thumbnail} />
                    </div>
                    <div className="search-component-info">
                    <h1 title={this.props.info.snippet.title}>{title}</h1>
                    <div className="little-things">
                    <span>{channelTitle}</span>
                    <Views type={this.props.type} views={this.state.views}></Views>
                    <span> {publishedAt}</span>
                    </div>
                    <span>{description}</span>
                    </div>
                    </div>);
            }

};

export default SComponent;
