import React, { Component } from 'react';
import './playlist-add.css';
import gapi from '../api/gapi';
import _ from "underscore";

import SComponent from '../search-component';

class AddPlaylist extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

            channelReady: false,
            playlistChannelId: false,
            results: [],
            videoList: false,
            pageInfo: false,
            nextPageToken: false, 
            searching: false,
	    loading: false

        }


        this.getChannelPlaylist = this.getChannelPlaylist.bind(this);
        this.searchPlaylist = this.searchPlaylist.bind(this);
        this.addPlaylistVideos = this.addPlaylistVideos.bind(this);
        this.moreVideos = this.moreVideos.bind(this);
	this.messiah = this.messiah.bind(this);
        this.closePlaylist = this.closePlaylist.bind(this);

	this.isElementInViewPort = this.isElementInViewPort.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
	this.scrollRef = React.createRef();
	this.scrollable = React.createRef();
	this.channel_search = _.throttle(this.messiah, 250);
 
    }

	messiah() {

		let target = this.scrollRef.current;
		let realThis = this;

		if (target) {

		 let id = this.state.playlistChannelId;


		let nextPageToken = this.state.nextPageToken;

		this.onVisibilityChange(target, () => {

			

				this.setState({loading: true});
	
    				window.gapi.load('client', () => {

        			this.moreVideos(id, nextPageToken);

    					});




			}, realThis);
	
	 }


	}


	onVisibilityChange(el, callback, realThis) {

        let visible = realThis.isElementInViewPort(el);

            if (visible) {
                
                if (typeof callback === "function") {

                    callback();

                }
            }

       };
	
	  isElementInViewPort(el) {
     
        let rect = el.getBoundingClientRect();
        let innHT;
        let innHB;

        if ((window.innerWidth || document.documentElement.clientWidth) <= 900) {

            innHT = 0;
            innHB = (window.innerHeight || document.documentElement.clientHeight) + 50;

        }

        if ((window.innerWidth || document.documentElement.clientWidth) > 900) {

         
            innHT = 0;
            innHB = (window.innerHeight || document.documentElement.clientHeight) + 50;
   
        }

	 return (

            rect.top >= innHT &&
            rect.left >= 0 &&
            rect.bottom <= innHB && 
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) 

        );

}

    closePlaylist() {

        this.setState({

            videoList: false,
            results: [],
            searching: false

        });

    }

    async getChannelPlaylist(id) {

        // 2. Initialize the JavaScript client library.
        let data = await window.gapi.client.init({
            'apiKey': 'AIzaSyC2ug6S36OHIhJ0ndNgm0rkA7dLRCCJ5_0',
            // clientId and scope are optional if auth is not required.
            'clientId': '786495793352-25apkhlgdh2bqld49daa22h8g61ou6va.apps.googleusercontent.com',
            'scope': 'profile',
            }).then(function() {
            // 3. Initialize and make the API request.
            return window.gapi.client.request({ 
                'path': `https://www.googleapis.com/youtube/v3/channels`,
                'params': {
                'part': 'statistics, contentDetails',
                'maxResults': '50',
                'id': `${id}`
            }
            }) 
            }).then((data) => {

              return data;

            }
            ).catch((error) => {console.log(error)});

            return data;

    }

    searchPlaylist(id) {
this.setState({loading: true});
        // 2. Initialize the JavaScript client library.
        window.gapi.client.init({
            'apiKey': 'AIzaSyC2ug6S36OHIhJ0ndNgm0rkA7dLRCCJ5_0',
            // clientId and scope are optional if auth is not required.
            'clientId': '786495793352-25apkhlgdh2bqld49daa22h8g61ou6va.apps.googleusercontent.com',
            'scope': 'profile',
            }).then(function() {
            // 3. Initialize and make the API request.
            return window.gapi.client.request({ 
                'path': `https://www.googleapis.com/youtube/v3/playlistItems`,
                'params': {
                'part': 'snippet, contentDetails',
                'maxResults': '50',
                'playlistId': `${id}`
            }
            }) 
            }).then((data) => {
this.setState({loading: false});
                let items = data.result.items;
                let moreItems = this.state.results;
                items.forEach((item) => {

                    moreItems.push(item);

                })

                if (data.result.nextPageToken) {

                    this.setState({

                        results: moreItems,
                        pageInfo: data.result.pageInfo,
                        nextPageToken: data.result.nextPageToken,
                        videoList: true
    
                    });

		this.scrollable.current.addEventListener("scroll", this.channel_search);


                }

                else {

                    this.setState({

                        videoList: true,
                        pageInfo: data.result.pageInfo,
                        nextPageToken: false

                    });

		this.scrollable.current.removeEventListener("scroll", this.channel_search);


                }

            }
            ).catch((error) => {console.log(error)});

    }


    moreVideos(id, nextPageToken) {
this.scrollable.current.removeEventListener("scroll", this.channel_search);
 this.setState({loading: true});
        // 2. Initialize the JavaScript client library.
        window.gapi.client.init({
            'apiKey': 'AIzaSyC2ug6S36OHIhJ0ndNgm0rkA7dLRCCJ5_0',
            // clientId and scope are optional if auth is not required.
            'clientId': '786495793352-25apkhlgdh2bqld49daa22h8g61ou6va.apps.googleusercontent.com',
            'scope': 'profile',
             }).then(function() {
            // 3. Initialize and make the API request.
            return window.gapi.client.request({ 
            'path': `https://www.googleapis.com/youtube/v3/playlistItems`,
            'params': {
            'part': 'snippet, contentDetails',
            'maxResults': '50',
            'playlistId': `${id}`,
            'pageToken': `${nextPageToken}`
           }
            })
            }).then((data) => {
this.setState({loading: false});
                let items = data.result.items;
                let moreItems = this.state.results;
                items.forEach((item) => {

                    moreItems.push(item);

                });

                if (data.result.nextPageToken) {

                    this.setState({

                        nextPageToken: data.result.nextPageToken,
			results: moreItems,

                    });

		this.scrollable.current.addEventListener("scroll", this.channel_search);

                }

                else {

                    this.setState({

                        videoList: true,
                        nextPageToken: false,
			results: moreItems

                    });

		this.scrollable.current.removeEventListener("scroll", this.channel_search);


                }
          
                }
            ).catch((error) => {console.log(error)});
    
    }
/*
    componentDidUpdate(props, prevState) {

        let id = this.state.playlistChannelId;
        
        let nextPageToken = this.state.nextPageToken;
        let playlistThis = this;

       if (this.state.nextPageToken) {

            gapi.load('client', function() {

                playlistThis.moreVideos(id, nextPageToken)

            })
        }
    }

*/
    addPlaylistVideos() {

        let id;

        if (this.props.info.id.playlistId) {

            id = this.props.info.id.playlistId;

        }

        if (this.props.info.id.channelId) {

            id = this.props.info.id.channelId;

        }

        let channelThis = this;

        this.setState({

            searching: true

        });

        window.gapi.load('client', function() {

        channelThis.getChannelPlaylist(id).then(

            (data) => {

                let id = data.result.items[0].contentDetails.relatedPlaylists.uploads;

                channelThis.setState({

                    playlistChannelId: id

                });

                channelThis.searchPlaylist(id);

            }

        );
                
        });

    }

    render() {

        let videoList;
        let searching;
        let totalResults;
	let ring;
	let trigger = <div ref={this.scrollRef} style={{width: "100px", height: "100px"}} >
		{ring}
            </div>;

	 if (this.state.loading) {

            ring = <div className="center"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;

        }

        if (this.state.searching === false) {

            searching = "See channel videos"

        }

        if (this.state.searching === true) {

            searching = "Searching...";

        }

        if (this.state.videoList) {

            totalResults = `Total videos: ${this.state.pageInfo.totalResults}`;

            videoList = <div ref={this.scrollable} className="playlist-video-list">
	    <i onClick={this.closePlaylist} title="Close playlist" className="fas fa-times close-playlist"></i>
            <div className="playlist-info">
            <h1>{this.props.info.snippet.channelTitle}</h1>
            <span>{totalResults}</span>
            </div>
            <div className="playlist-presentation">
            {this.state.results.map((data, index) => {

            let key = data.id + index;

            return <SComponent 

		url_id = {this.props.url_id}
		id = {this.props.id}
		reason = {this.props.reason}
                key = {key}
                info = {data}
                type = {"video"}

            />;
            })
            }{ring}
            </div>{trigger}
            </div>

        } 

        return (<section><div onClick={this.addPlaylistVideos} className="playlist-overlay">
        <p>{searching}</p>
        </div>{videoList}</section>);



    }

};

export default AddPlaylist;
