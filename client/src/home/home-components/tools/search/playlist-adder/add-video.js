import React, { Component } from 'react';
import './playlist-add.css';
import axios from 'axios';
import { connect } from "react-redux";

function mapStateToProps(state) {

    return { videos: state.editorVideos.videos};

}

class AddVideo2 extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

            added: false

        }

        this.addPlaylistVideo = this.addPlaylistVideo.bind(this);

    }

    addPlaylistVideo() {

        let that = this;
		
	if (this.props.reason === "editor") {

		let videoId;
		let found = false;


		if (this.props.info.kind === "youtube#playlistItem") {

			videoId = this.props.info.snippet.resourceId.videoId;

		}

		if (this.props.info.kind === "youtube#searchResult") {

			videoId = this.props.info.id.videoId;

		}

		let body = {
	

		video: {
			
			title: this.props.info.snippet.title,
			duration: this.props.duration,
			published: this.props.info.snippet.publishedAt,
			videoId: videoId,
			thumbnails: {

				default: {url: this.props.info.snippet.thumbnails.default.url},
				medium: {url: this.props.info.snippet.thumbnails.medium.url},
				high: {url: this.props.info.snippet.thumbnails.high.url}


			}
			

		},
		
		playlist: this.props.url_id,
		user: this.props.id,
		reason: "add"

		};

		for (let i = 0; i < this.props.videos.length; i++) {

			if (this.props.videos[i].videoId === videoId) {

				found = true;
				break;

			}

		}

		if (!found) {

		  
		axios.post('/playlist/editplaylistitems', body).then((res) => {

			if (res.data.ok) {

  		this.props.dispatch({ 
            
            		type: 'ADD_VIDEO_EDITOR',
            		video: {videoTitle: this.props.info.snippet.title, videoId: videoId, id: res.data.ok[0], thumbnail_default: this.props.info.snippet.thumbnails.default.url, thumbnail_medium: this.props.info.snippet.thumbnails.medium.url,thumbnail_high: this.props.info.snippet.thumbnails.high.url, order: res.data.order, }
    
        	});

		this.props.dispatch({

			type: 'UPDATE_PLAYLISTS_RESULT',
			index: this.props.url_id,
			add: true
	
		});

	   this.setState({

            added: true

        })

        window.setTimeout(function() {

            that.setState({

                added: false

            })

        }, 1000)  

			}
		

		}).catch((e) => {console.log(e)});

	}	

            	

	}

	else {

	 this.props.dispatch({ 
            
            type: 'ADD_VIDEO',
            playlistVideos: {info: this.props.info, duration: this.props.duration, views: this.props.views}
    
        })

        this.setState({

            added: true

        })

        window.setTimeout(function() {

            that.setState({

                added: false

            })

        }, 1000)  

       }

    }

    render() {

        let msg = "Add video to playlist.";

        if (this.state.added) {

            msg = "Video added!";

        }

        return (<div onClick={this.addPlaylistVideo} className="playlist-overlay">
        <p>{msg}</p>
        
        </div>);

    }

};

const AddVideo = connect(mapStateToProps)(AddVideo2);

export default AddVideo;
