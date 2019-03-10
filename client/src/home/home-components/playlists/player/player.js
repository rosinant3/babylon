import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import "./player.css";
import moment from 'moment';
import PlayerPlaylist from './player-item';
import YouTube from 'react-youtube';

import VideoComments from "./videocomments";

const mapStateToProps = state => {

    return {playerSeekTo: state.playerSeekTo, currentVideoBeingPlayed: state.playerCurrentVideo.video, scope: state.player.scope, status: state.player.status, searchResults: state.searchResultsPlaylists.playlists};

};
  
class Player2 extends Component {

    constructor(props) {

        super(props);
        this.state = {

		playlist: {},
		playerTime: "00:00",
		fullDescription: false,
		played: false,
		seeked: false
			
        };

	this.getBackToPlaylistsPage = this.getBackToPlaylistsPage.bind(this);
	this.closePlayer = this.closePlayer.bind(this);
	this.youtubePlayer = React.createRef();
	this.getPlayerTime = this.getPlayerTime.bind(this);

	this.startInterval = this.startInterval.bind(this);
	this.toggleDescription = this.toggleDescription.bind(this);
	this.updateVideoWatchValue = this.updateVideoWatchValue.bind(this);

	this.transformTime = this.transformTime.bind(this);
	this.playNextVideo = this.playNextVideo.bind(this);




    }


	playNextVideo(event) {

		if (event.data === 0) {

			this.props.dispatch({type: "UPDATE_CURRENT_PLAYER_VIDEO", video: this.props.currentVideoBeingPlayed, role: "end"});


		}

	}

     transformTime(watched) {

		let splitWatched = watched.split(":");
		let fullSecondsWatched;

		if (splitWatched.length === 3 && watched !== "no" && watched !== "yes") {

			let hours = Number(splitWatched[0]);
			let minutes = Number(splitWatched[1]);
			let seconds = Number(splitWatched[2]);

			let hoursToSeconds = hours * 60 * 60;
			let minutesToSeconds = minutes * 60;

			fullSecondsWatched = hoursToSeconds + minutesToSeconds + seconds;

		}


		if (splitWatched.length === 2 && watched !== "no" && watched !== "yes") {

			let minutes = Number(splitWatched[0]);
			let seconds = Number(splitWatched[1]);

			let minutesToSeconds = minutes * 60;

			fullSecondsWatched = minutesToSeconds + seconds;


		}


		if (splitWatched.length === 1 && watched !== "no" && watched !== "yes") {

			let seconds = Number(splitWatched[1]);

			fullSecondsWatched = seconds;


		}


			return {watched: fullSecondsWatched};


	}

    startInterval() {


	this.intervalId = setInterval(()=> {

		this.getPlayerTime();

	}, 1000);




   }

    getPlayerTime() {

	this.youtubePlayer.current.internalPlayer.getCurrentTime().then((res)=>{

				let time = Math.floor(res);
				let duration = moment.duration(time, "seconds");
				let seconds = duration.seconds();
				let minutes = duration.minutes();
				let hours = duration.hours();
				let transformedDuration = this.transformTime(this.props.currentVideoBeingPlayed.duration);
				let lastFive = transformedDuration.watched * 0.05;
				let triggerPoint = transformedDuration.watched - lastFive;

				if (seconds < 10 && !isNaN(seconds)) {

					seconds = `0${duration.seconds()}`;

				}

				if (minutes < 10 && !isNaN(minutes)) {

					minutes = `0${duration.minutes()}`;

				}

				if (hours !== 0 && !isNaN(hours)) {

					if (hours < 10) {

						let transformedTimestamp = this.transformTime(`0${hours}:${minutes}:${seconds}`);

						if (transformedTimestamp.watched > triggerPoint) {

						this.updateVideoWatchValue("yes", this.props.currentVideoBeingPlayed.id);
						

						}
			
						this.setState({ playerTime: `0${hours}:${minutes}:${seconds}` });


					}

					else {

						let transformedTimestamp = this.transformTime(`${hours}:${minutes}:${seconds}`);

						if (transformedTimestamp.watched > triggerPoint) {

						this.updateVideoWatchValue("yes", this.props.currentVideoBeingPlayed.id);
						

						}
			

						this.setState({ playerTime: `${hours}:${minutes}:${seconds}` });


					}
				}

				if (hours === 0 && !isNaN(seconds) && !isNaN(minutes)) {

					
					let transformedTimestamp = this.transformTime(`${minutes}:${seconds}`);

					if (transformedTimestamp.watched > triggerPoint) {

						this.updateVideoWatchValue("yes", this.props.currentVideoBeingPlayed.id);
					

					}
			
					this.setState({ playerTime: `${minutes}:${seconds}` });

				}

				
				
			});


    }

    getBackToPlaylistsPage() {

	if (this.props.searchResults.length === 0) {


		this.makeAjaxCall();


	} else {

		if (this.props.scope === "public") {

			this.props.history.push("/");

		}

		if (this.props.scope === "user") {

			this.props.history.push("/playlists");

		}

		this.props.dispatch({type: 'CLEAR_PLAYER'});
		this.props.dispatch({type: 'FIRE_PLAYER', status: false, url_id: null, scope: "not important"});	

	}



    }


    componentDidMount() {

	let body = {

		playlist: this.props.url_id,

	};

	this.startInterval();

	axios.post("/player/loadplayer", body)
	     .then((res) => {

		if (res.data.playlist[0].public === "0") {

			if (res.data.playlist[0].user === this.props.id) {
				
				this.setState({playlist: res.data.playlist[0]});

			}

			else {

				this.getBackToPlaylistsPage();

			}
			

		}

		else {

			this.setState({playlist: res.data.playlist[0]});

		}
		

	     
	      }).catch((error) => {console.log(error)});
	
    }

    
    componentWillUnmount() {

		this.props.dispatch({type: "FIRE_PLAYER", status: false, url_id: false});
		clearInterval(this.intervalId);
		this.updateVideoWatchValue(this.state.playerTime, this.props.currentVideoBeingPlayed.id);
		this.props.dispatch({type: "ADD_PLAYER_VIDEOS", length: 0, total: 0, onepage: false, nextPage: 1, videos: []})
		this.props.dispatch({type: 'CLEAR_PLAYER'});

    }

	updateVideoWatchValue(newTime, currentVideo) {

		if (this.props.currentVideoBeingPlayed.watched !== "yes") {
		
		axios.post('/player/updatewatchtime', {

				    videoId: currentVideo,
				    user: this.props.id,
				    newTime: newTime
				    
		

				}).then((res) => {

			this.props.dispatch({ type: "UPDATE_WATCHED_OF_ONE_VIDEO", time: newTime, video: currentVideo});
				
		if (newTime === "yes") {

			this.props.dispatch({type: "UPDATE_PLAYLISTS_RESULT", watched: true, index: this.props.url_id});

		}



				}).catch((e) => { console.log(e) });

	}


    	}



	
    componentDidUpdate(prevProps, prevState) {

	if (this.props.currentVideoBeingPlayed && prevProps.currentVideoBeingPlayed) {

		document.title = `Babylon | ${this.props.currentVideoBeingPlayed.videoTitle}`;

		if (this.props.currentVideoBeingPlayed.videoId !== prevProps.currentVideoBeingPlayed.videoId) {
			
			let skipTo = {watched: 0};
			
			
			if (this.props.currentVideoBeingPlayed.watched !== "no") {

			  skipTo = this.transformTime(this.props.currentVideoBeingPlayed.watched);

			}	
			
			this.youtubePlayer.current.internalPlayer.loadVideoById(this.props.currentVideoBeingPlayed.videoId, skipTo.watched);
			this.props.dispatch({ type: "UPDATE_WATCHED_OF_ONE_VIDEO", time: prevState.playerTime, video: prevProps.currentVideoBeingPlayed.id});	


		}

		if (!this.state.played) {

			let skipTo = {watched: 0};
			
			if (this.props.currentVideoBeingPlayed.watched !== "no") {

			  skipTo = this.transformTime(this.props.currentVideoBeingPlayed.watched);

			}			

			this.youtubePlayer.current.internalPlayer.loadVideoById(this.props.currentVideoBeingPlayed.videoId, skipTo.watched);

			this.setState({played: true});			

		}


		if (this.props.currentVideoBeingPlayed.videoId === prevProps.currentVideoBeingPlayed.videoId && this.props.playerSeekTo.seeked) {
				this.youtubePlayer.current.internalPlayer.seekTo(this.props.playerSeekTo.seconds);
				this.props.dispatch({ type: "COMMENT_SEEKED", seeked: false, seconds: 0 });

		}

	}


    }


	closePlayer() {

	if (this.props.searchResults === 0) {

			this.makeAjaxCall();


	} else {

		if (this.props.scope === "public") {

			this.props.history.push("/");

		}

		if (this.props.scope === "user" || this.props.scope === false) {

			this.props.history.push("/playlists");

		}

		this.props.dispatch({type: 'CLEAR_PLAYER'});
		this.props.dispatch({type: 'FIRE_PLAYER', status: false, url_id: null, scope: "not important"});	



	}

}

    toggleDescription() {


	this.setState({fullDescription: !this.state.fullDescription});

    }

	
	makeAjaxCall() {


			 axios.post('/getplaylist', {

                		user: this.props.id,
				current_page: 1,
				per_page: 12,
				reason: "all",
				scope: "user"

            }).then((res) => {
		
				if (res.data.page.last_page === res.data.page.current_page) { 
					
								this.props.dispatch({ page: res.data.page, waiting: false, scope: this.state.scope, onepage: true, reason: this.state.reason, type: "SEARCH_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page + 1});

		if (this.props.scope === "public") {

			this.props.history.push("/");

		}

		if (this.props.scope === "user") {

			this.props.history.push("/playlists");

		}
		
		this.props.dispatch({type: 'CLEAR_PLAYER'});
		this.props.dispatch({type: 'FIRE_PLAYER', status: false, url_id: null, scope: "not important"});

				
					}
					
					else {
						
						this.props.dispatch({ page: res.data.page, waiting: false, scope: this.state.scope, onepage: false, reason: this.state.reason, type: "SEARCH_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page + 1});

		if (this.props.scope === "public") {

			this.props.history.push("/");

		}

		if (this.props.scope === "user") {

			this.props.history.push("/playlists");

		}

		this.props.dispatch({type: 'CLEAR_PLAYER'});
		this.props.dispatch({type: 'FIRE_PLAYER', status: false, url_id: null, scope: "not important"});

					}

}).catch((error) => {console.log(error)});

	}
	


   
    render() {

	let description = this.state.playlist.description;
	let showmore;
	const opts = {
      		height: '390',
      		width: '640',
      		playerVars: { // https://developers.google.com/youtube/player_parameters
        	autoplay: 1
      		}
    	};

	let player;

	if (this.state.playlist.description && !this.state.fullDescription) {

		 if (description.length > 500) {

			description = `${this.state.playlist.description.slice(0, 500)}...`;
			showmore = <div className="showmore"><span onClick={this.toggleDescription} >Show More</span></div>;

		}

	}

	if (this.state.fullDescription) {

		description = this.state.playlist.description;
		showmore = <div className="showmore"><span onClick={this.toggleDescription} >Show Less</span></div>;

	}

	if (this.props.currentVideoBeingPlayed) {

		player = <YouTube
        			opts={opts}
        			onReady={this._onReady}
				ref={this.youtubePlayer}
				onStateChange={this.playNextVideo}
      			/>;

	}

        return (<React.Fragment>
		<div className="actual-player">
		    <div className="iFrame-player">
			{player}
		    </div>
		    <div className="playlist-list" >
		<div className="player-header">
		<i title="Close Player" onClick={this.closePlayer} className="fas fa-times close-player"></i>
		<span className="player-title">{this.state.playlist.title}</span>
		<span className="player-category">{this.state.playlist.category}</span>
		<div className="sub-info">
		<span className="player-created-at">{moment(this.state.playlist.created_at).format("MMM Do YY")}</span>
		</div>
		</div>
                    <PlayerPlaylist timestamp={this.state.playerTime} id={this.props.id} url_id={this.props.url_id} />
		</div>
		</div>
		<div className="playlist-description">
		<p>{description}</p>
		{showmore}
		</div>
		<VideoComments username={this.props.username} url_id={this.props.url_id} id={this.props.id} video={this.props.currentVideoBeingPlayed} timestamp={this.state.playerTime} />


		</React.Fragment>
	)

    }

};

const Player = connect(mapStateToProps)(Player2);

export default Player;
