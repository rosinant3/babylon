import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import "./player.css";
import _ from 'underscore';

const time = {

	transformTime: function transformTime(duration, watched) {

		let splitDuration = duration.split(":");
		let splitWatched = watched.split(":");
		let fullSecondsDuration;
		let fullSecondsWatched;
		
		if (splitDuration.length === 3) {

			let hours = Number(splitDuration[0]);
			let minutes = Number(splitDuration[1]);
			let seconds = Number(splitDuration[2]);

			let hoursToSeconds = hours * 60 * 60;
			let minutesToSeconds = minutes * 60;

			fullSecondsDuration = hoursToSeconds + minutesToSeconds + seconds;



		}


		if (splitDuration.length === 2) {

			let minutes = Number(splitDuration[0]);
			let seconds = Number(splitDuration[1]);

			let minutesToSeconds = minutes * 60;

			fullSecondsDuration = minutesToSeconds + seconds;

		}


		if (splitDuration.length === 1) {

			let seconds = Number(splitDuration[0]);

			fullSecondsDuration = seconds;

		}

		if (splitWatched.length === 3) {

			let hours = Number(splitWatched[0]);
			let minutes = Number(splitWatched[1]);
			let seconds = Number(splitWatched[2]);

			let hoursToSeconds = hours * 60 * 60;
			let minutesToSeconds = minutes * 60;

			fullSecondsWatched = hoursToSeconds + minutesToSeconds + seconds;

		}


		if (splitWatched.length === 2) {

			let minutes = Number(splitWatched[0]);
			let seconds = Number(splitWatched[1]);

			let minutesToSeconds = minutes * 60;

			fullSecondsWatched = minutesToSeconds + seconds;


		}


		if (splitWatched.length === 1) {

			let seconds = Number(splitWatched[1]);

			fullSecondsWatched = seconds;


		}


			return {duration: fullSecondsDuration, watched: fullSecondsWatched};


	}

}

class PlaylistItem extends Component {

	constructor(props) {

		super(props);

		this.state = {

			scrolledIntoView: false,

		}
	
		this.scrollIntoViewRef = React.createRef();

	}

	componentDidUpdate() {

	if (this.props.playedVideo && this.props.video) {

		if (this.props.playedVideo.id === this.props.video.id) {
		
			if (this.scrollIntoViewRef.current && !this.state.scrolledIntoView) {

				this.scrollIntoViewRef.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
				this.setState({scrolledIntoView: true});

			}

		}

	}



	}

	render() {

	let title = this.props.video.videoTitle;
	let nr = this.props.index + 1;
	let playerClass = "player-item";
	let duration = this.props.video.duration;
	let watched = this.props.video.watched;
	let computedSolution;
	let thinRedLinePercentage;
	let thinRedLine;

	if (watched !== "yes" && watched !== "no") {

		computedSolution = time.transformTime(duration, watched);

		if (computedSolution.duration > computedSolution.watched) {

			thinRedLinePercentage = `${Math.floor((computedSolution.watched * 100) / computedSolution.duration)}%`;

		}
		
	}

	if (thinRedLinePercentage) {

		thinRedLine = {width: thinRedLinePercentage, opacity: 1};	

	}
	
	if (this.props.video.watched === "yes") {

		playerClass = "player-item player-item-watched";
		thinRedLine = {width: "100%", opacity:1};

	}
	
	if (this.props.playedVideo && this.props.video) {

	if (this.props.playedVideo.id === this.props.video.id) {

		let playingDuration = this.props.video.duration;
		let timestamp = this.props.timestamp;

		computedSolution = time.transformTime(playingDuration, timestamp);

		if (computedSolution.duration > computedSolution.watched) {

			thinRedLinePercentage = `${Math.floor((computedSolution.watched * 100) / computedSolution.duration)}%`;

		}
		
		if (thinRedLinePercentage) {

			thinRedLine = {width: thinRedLinePercentage, opacity: 1};	

		}

		playerClass = "player-item player-item-playing";

	}

	}

	if (this.props.video.videoTitle.length > 50) {

		title = `${this.props.video.videoTitle.slice(0, 50)}...`;

	}


	return (<div title={this.props.video.videoTitle} ref={this.scrollIntoViewRef} onClick={() => {this.props.onClick(this.props)}} className={playerClass}>
	
		<div className="player-item-number">{nr}</div>
		<div className="player-item-thumbnail">
		<img alt={this.props.video.videoTitle} src={this.props.video.thumbnail_default} />
		<span>{this.props.video.duration}</span>
	     <div style={thinRedLine} className="thin-red-line"></div>
		</div>
		<div title={this.props.video.videoTitle} className="player-item-title">{title}</div>
	   
		</div>);

}



}


const mapStateToProps2 = state => {

    return {

              currentVideoBeingPlayed: state.playerCurrentVideo.video,
	      storePlayerVideos: state.playerVideos

            };

};

class PlayerPlaylist2 extends Component {
	
	constructor(props) {
		
		super(props);
		this.state = {

			found: false, 
			onepage: true, 
			nextPage: 1, 
	
		};

		this.isElementInViewPort = this.isElementInViewPort.bind(this);
                this.onVisibilityChange = this.onVisibilityChange.bind(this);
		this.messiah = this.messiah.bind(this);
		this.get_new_results = _.throttle(this.messiah, 250);
		this.scrollRef = React.createRef();
		this.scrolling = React.createRef();

		this.makeAjaxCall = this.makeAjaxCall.bind(this);
		this.focus = this.focus.bind(this);
		

		}

	componentWillUnmount() {

		window.removeEventListener("scroll", this.get_new_results);
		window.removeEventListener("resize", this.get_new_results);

	}

	

	
	messiah() {
		 
		 let target = this.scrollRef.current;
		 let realThis = this;

		 if (target) {

		this.onVisibilityChange(target, () => {
 		
			this.makeAjaxCall();
	

		}, realThis);
		
		 }
		
	 };


	componentDidMount() {

		this.makeAjaxCall();

		
	};

	focus(e) {

		this.props.dispatch({type: "UPDATE_CURRENT_PLAYER_VIDEO", video: e.video, role: "click"});


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

            innHT = 0
            innHB = (window.innerHeight || document.documentElement.clientHeight) + 10;

        }

        if ((window.innerWidth || document.documentElement.clientWidth) > 900) {

         
            innHT = 0;
            innHB = (window.innerHeight || document.documentElement.clientHeight) + 10;
   
        }
      
        return (

            rect.top >= innHT &&
            rect.left >= 0 &&
            rect.bottom <= innHB && 
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) 

        );
    };


	makeAjaxCall() {

		let container = this.scrolling.current;
		this.setState({waiting: true});

	container.removeEventListener("scroll", this.get_new_results);
	container.removeEventListener("resize", this.get_new_results);

		axios.post("/playlist/getplaylist", {

			reason: "items",
			user: this.props.id,
			playlist: this.props.url_id,
			current_page: this.props.storePlayerVideos.nextPage,
			per_page: 12

		}).then((res) => {

			let videos = this.props.storePlayerVideos.videos.slice();

			res.data.data.forEach((video) => {


				videos.push(video);
				if (!this.state.found && video.watched !== "yes") {

					this.setState({found: true});
					this.props.dispatch({type: "UPDATE_CURRENT_PLAYER_VIDEO", video: video, role: "click"})


				}


			});

			if (res.data.page.last_page === res.data.page.current_page) {  

			this.props.dispatch({type: "ADD_PLAYER_VIDEOS", total: res.data.page.total, onepage: true, nextPage: res.data.page.current_page, videos: videos});

			if (!this.state.found) {

				this.props.dispatch({type: "UPDATE_CURRENT_PLAYER_VIDEO", video: videos[0], role: "click"});
				this.setState({found: true});

			}
			

			container.removeEventListener("scroll", this.get_new_results);
			container.removeEventListener("resize", this.get_new_results);


			}

else {

		this.props.dispatch({type: "ADD_PLAYER_VIDEOS", total: res.data.page.total, onepage: false, nextPage: res.data.page.current_page + 1, videos: videos});

		if (!this.state.found) {

			this.makeAjaxCall();

		}
			

		container.addEventListener("scroll", this.get_new_results);
		container.addEventListener("resize", this.get_new_results);

			

}

		}).catch((e) => {console.log(e)});;

	}
	
	render() {
		
		let moreResults;
		let waiting;
		let videos;

		if (this.props.storePlayerVideos.onepage) {

		     moreResults = undefined;

		}

		if (this.props.storePlayerVideos.videos.length > 0) {

			videos = this.props.storePlayerVideos.videos.map((video, index) => {

					let key = video.videoId + video.order + video.watched;

		return <PlaylistItem timestamp={this.props.timestamp} playedVideo={this.props.currentVideoBeingPlayed} onClick={this.focus} id={this.props.id} key={key} index={index} video={video} url_id={this.props.url_id}/>;

});


		}

	

		if (!this.props.storePlayerVideos.onepage) {

		     moreResults = <div ref={this.scrollRef} style={{opacity:0}} ></div>;
			
		if (this.state.waiting) {

		     waiting = <div className="center player-waiting"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;

		}

		}

		return(<div ref={this.scrolling} className="scroll-items">
			{videos}{moreResults}{waiting}</div>)



	}

	};

const  PlayerPlaylist = connect(mapStateToProps2)(PlayerPlaylist2);

export default PlayerPlaylist;
