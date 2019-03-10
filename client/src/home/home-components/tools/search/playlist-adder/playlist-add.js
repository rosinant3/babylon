import React, { Component } from 'react';
import './playlist-add.css';
import _ from "underscore";
import gapi from '../api/gapi';

import SComponent from '../search-component';

class AddPlaylist extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

            results: [],
            videoList: false,
            pageInfo: false,
            nextPageToken: false, 
            searching: false,
	    loading: false

        }

        this.numberOfVideos = React.createRef();


        this.searchPlaylist = this.searchPlaylist.bind(this);
        this.addPlaylistVideos = this.addPlaylistVideos.bind(this);
        this.moreVideos = this.moreVideos.bind(this);
	this.messiah = this.messiah.bind(this);
        this.closePlaylist = this.closePlaylist.bind(this);

	this.isElementInViewPort = this.isElementInViewPort.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
	this.scrollRef = React.createRef();
	this.scrollable = React.createRef();
	this.playlist_search = _.throttle(this.messiah, 250);
 
    }

    closePlaylist() {

        this.setState({

            videoList: false,
            results: [],
            searching: false

        });

    }


    searchPlaylist(id) {

	this.setState({ loading: true });

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

		this.setState({ loading: false });
                let items = data.result.items;
                let moreItems = this.state.results.slice();
                items.forEach((item) => {

                    moreItems.push(item);

                })

                if (data.result.nextPageToken) {
		
                    this.setState({

                        results: moreItems,
                        pageInfo: data.result.pageInfo,
                        nextPageToken: data.result.nextPageToken,
                        videoList: true,
                        
                    });

			
		this.scrollable.current.addEventListener("scroll", this.playlist_search);


                }

                else {

                    this.setState({

                        videoList: true,
                        pageInfo: data.result.pageInfo,
                        nextPageToken: false,
			loading: false,
			results: moreItems

                    });
		
		this.scrollable.current.removeEventListener("scroll", this.playlist_search);

                }

            }
            ).catch((error) => {console.log(error)});

    }

	messiah() {

		let target = this.scrollRef.current;
		let realThis = this;

		if (target) {

		
		let id = this.props.info.id.playlistId;
		let nextPageToken = this.state.nextPageToken;


		this.onVisibilityChange(target, () => {
			
				this.setState({loading: true});
	
    				window.gapi.load('client', () => {

        			this.moreVideos(id, nextPageToken);

    					});




			}, realThis);
	
	 }


	}



    moreVideos(id, nextPageToken) {

		this.scrollable.current.removeEventListener("scroll", this.playlist_search);
		this.scrollable.current.removeEventListener("resize", this.playlist_search);
		this.setState({ loading: true });
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

		this.setState({ loading: false });
                let items = data.result.items;
                let moreItems = this.state.results.slice();
                items.forEach((item) => {

                    moreItems.push(item);

                });

                if (data.result.nextPageToken) {

                    this.setState({

                        nextPageToken: data.result.nextPageToken,
			results: moreItems

                    });

		this.scrollable.current.addEventListener("scroll", this.playlist_search);

                }

                else {

                    this.setState({

                        videoList: true,
                        nextPageToken: false,
			loading: false,
			results: moreItems
			

                    });

		this.scrollable.current.removeEventListener("scroll", this.playlist_search);

                }
          
                }
            ).catch((error) => {console.log(error)});
    
    }

    addPlaylistVideos() {

        let id = this.props.info.id.playlistId; 
        let playlistThis = this;

        this.setState({

            searching: true

        });

        window.gapi.load('client', function() {

        playlistThis.searchPlaylist(id);
                
        });

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


        if (!this.state.searching) {

            searching = "See playlist videos"

        }

        if (this.state.searching) {

            searching = "Searching...";

        }

        if (this.state.videoList) {

            totalResults = `Total videos: ${this.state.pageInfo.totalResults}`;

            videoList = <div ref={this.scrollable} className="playlist-video-list">
            <i onClick={this.closePlaylist} title="Close playlist" className="fas fa-times close-playlist"></i>
            <div className="playlist-info">
            <h1>{this.props.info.snippet.title}</h1>
            <span>{totalResults}</span>
            </div>
            <div ref={this.numberOfVideos} className="playlist-presentation">
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
            </div>
		{trigger}
            </div>

        }

        return (<section><div onClick={this.addPlaylistVideos} className="playlist-overlay">
        <p>{searching}</p>
        </div>{videoList}

        </section>);



    }

};

export default AddPlaylist;
