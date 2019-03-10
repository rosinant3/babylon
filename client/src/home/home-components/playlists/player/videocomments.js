import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import "./player.css";
import _ from 'underscore';
import moment from 'moment';
import Linkify from 'react-linkify';

const mapStateToProps2 = state => {

    return {videoComments: state.videoComments};

};

class ActualComment2 extends Component {

	constructor(props) {

		super(props);
		this.state = {

			seemore: false,
			editable: false,
			value: false,
			characters: 0,

		}

		this.showMore = this.showMore.bind(this);
		this.edit = this.edit.bind(this);
		this.textAreaValue = this.textAreaValue.bind(this);
		this.saveChanges = this.saveChanges.bind(this);
		this.remove = this.remove.bind(this);

		this.skipTo = this.skipTo.bind(this);
		this.transformTime = this.transformTime.bind(this);


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


	remove(e) {

		if (window.confirm("Are you sure you want to delete this note?")) {

		axios.post('/player/note', {

					del: true,
					video: this.props.videoId,
					user: this.props.id,
					noteId: this.props.comment.id

			}).then((res) => {

				if (res.data.removed === 1) {

					this.props.dispatch({type: "ADD_VIDEO_COMMENTS", state: "remove", noteId: this.props.comment.id});
				

				}


			});

		}

		else {



		}


	}
	
	showMore() {

		this.setState({seemore: !this.state.seemore});

	}

	skipTo(e) {

		let seconds = this.transformTime(this.props.comment.timestamp);

		this.props.dispatch({ type:"COMMENT_SEEKED", seconds: seconds.watched, seeked: true });

	}

	saveChanges() {

		if (this.state.value === false || this.state.value === this.props.comment.note) {

				this.setState({editable: false});
		

		}

		else {

			
			axios.post('/player/note', {

					change: true,
					note: this.state.value,
					video: this.props.videoId,
					user: this.props.id,
					noteId: this.props.comment.id

			}).then((res) => {


				if (res.data.updated === 1) {

					this.props.dispatch({type: "ADD_VIDEO_COMMENTS", state: "edit", noteId: this.props.comment.id, updated_at: new Date(), note: this.state.value});
					this.setState({editable: false});

				}


			});



		}



	}

	edit() {

		if (this.state.editable) {

			if (this.state.value === this.props.comment.note) {

				this.setState({editable: false});

			}

			else {
		
				if (window.confirm("You will lose your changes if you perform this action.")) {

					this.setState({editable: false});

				}	


				else {


				}

			}		

		}

		else {
		
			this.setState({editable: true, value: this.props.comment.note});

		}

	}

	textAreaValue(e) {

		this.setState({characters: e.target.value.length, value: e.target.value.trim()});

	}

	render() {

					let username;
					let note = this.props.comment.note;
					let created_at = moment(this.props.comment.created_at).format('MMMM Do YYYY, h:mm:ss a');
					let updated_at = moment(this.props.comment.updated_at).format('MMMM Do YYYY, h:mm:ss a');
					let created;
					let updated;
					let showMore;
					let edit;
					let remove;

					if (this.props.comment.username === this.props.username) {

						username = {fontWeight: "bold"};
						edit = <i onClick={this.edit} title="Edit" className="fas fa-pen-square"></i>;
						remove = <i onClick={this.remove} title="Remove" style={{color: "red", marginLeft: "0.5rem"}} className="fas fa-times"></i>

					}

					if (created_at === updated_at) {

						created = created_at;
						updated = created_at;

					}

					if (created_at !== updated_at) {

						created = `${created_at}*`;
						updated = `Edited: ${updated_at}`;

					}

					if (this.props.comment.note.length > 1000 && !this.state.seemore) {

						note = <p>{`${this.props.comment.note.slice(0,1000)}...`}</p>;
						showMore = <div className="show-more-comments"><span onClick={this.showMore}>Show More</span></div>;

					}

					if (this.state.seemore) {

						note = <p>{this.props.comment.note}</p>;
						showMore = <div className="show-more-comments"><span onClick={this.showMore}>Show Less</span></div>;

					};

					if (this.state.editable) {

						note = <React.Fragment><textarea onKeyUp={this.textAreaValue} defaultValue={this.props.comment.note}className="edit-text-area"></textarea><div className="editor-fivek">{this.state.characters}/5000</div><div className="save-button"><div onClick={this.saveChanges} >Save</div></div></React.Fragment>;
						showMore = <div></div>;

					}

					return (<div className="comment">

						    <div onClick={this.skipTo} className="comment-timestamp"><span>{this.props.comment.timestamp}</span></div>
						    <div className="comment-data">
						    <div className="note">
						    <Linkify properties={{target: '_blank', rel:"noopener noreferrer"}}>{note}</Linkify>
						    {showMore}
						    </div>
						    <div className="comment-footer">
						    <span title={updated}>{created}</span>
						    <span style={username}>{`by ${this.props.comment.username}`}</span>
						    {edit}
						    {remove}
						    </div>
						    </div>						
						    </div>)
	
	}



}

const ActualComment = connect(mapStateToProps2)(ActualComment2);

class VideoComments2 extends Component {
	
	constructor(props) {
		
		super(props);
		this.state = {

			textTooLong: false,
			characters: 0,
			started: false,
			waiting: false
	
		};

		this.countTextArea = this.countTextArea.bind(this);

		this.submitForm = this.submitForm.bind(this);
		this.addCommentsToState = this.addCommentsToState.bind(this);

		this.isElementInViewPort = this.isElementInViewPort.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
		this.messiah = this.messiah.bind(this);
		this.more_video_comments = _.throttle(this.messiah, 250);

		this.moreComments = React.createRef();

	}

	addCommentsToState(state) {

			window.removeEventListener("scroll", this.more_video_comments);
			window.removeEventListener("resize", this.more_video_comments);
			this.setState({waiting: true});

			axios.post('/player/note', {

				get: true,
				video: this.props.video.id,
				current_page: this.props.videoComments.nextPage

			}).then((res) => {

				if (res.data.page.current_page === res.data.page.last_page) {

				this.props.dispatch({type: "ADD_VIDEO_COMMENTS", total: res.data.page.total, state: state, comments: res.data.data, nextPage: res.data.current_page, onepage: true});
				this.setState({waiting: false});
				window.removeEventListener("scroll", this.more_video_comments);
				window.removeEventListener("resize", this.more_video_comments);


		}

		else {

			this.props.dispatch({type: "ADD_VIDEO_COMMENTS", total: res.data.page.total, state: state, comments: res.data.data, nextPage: res.data.page.current_page + 1, onepage: false});
			this.setState({waiting: false});
			window.addEventListener("scroll", this.more_video_comments);
			window.addEventListener("resize", this.more_video_comments);



		}

			});


	}

	submitForm(e) {

		e.preventDefault();

		let note = e.target.note;

		this.setState({ waiting: true });

		axios.post("/player/note", {

				note: note.value,
				timestamp: this.props.timestamp,
				user: this.props.id,
				video: this.props.video.id,
				username: this.props.username,
				send: true,
				url_id: this.props.url_id
				
			}).then((res) => {

				if (res.data.error === true) {

					this.setState({textTooLong: true, waiting: false});

				}

			
				else {

					
					this.props.dispatch({type: "ADD_VIDEO_COMMENTS", state: "one", comment: {id: res.data.posted[0], note: note.value, username: this.props.username, created_at: new Date(), updated_at: new Date(), timestamp: this.props.timestamp}});
					note.value = "";
					this.setState({ characters: 0, waiting: false });

				}


			}).catch((e) => {console.log(e)});


	}

	countTextArea(e) {

		let target = e.target;

		this.setState({characters: e.target.value.length});

		if (e.target.value.length > 5000 || e.target.value.trim() === "") {

			this.setState({textTooLong: true});
			return false;

		}

		else {


			this.setState({textTooLong: false});
			return true;

		}



	}

	componentDidUpdate(prevProps, prevState)  {

		if (prevProps.video && this.props.video) {

			if (this.state.started) {

				if (prevProps.video.id !== this.props.video.id) {

					this.addCommentsToState("initial");				 

				}

			}


			if (!this.state.started) {

				this.setState({started: true});
				this.addCommentsToState("initial");


			}



		}


	}

	componentDidMount() {

			



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


	
	messiah() {
		 
		 let target = this.moreComments.current;
		 let realThis = this;

		 if (target) {

		this.onVisibilityChange(target, () => {
 		
			this.addCommentsToState("additional");
	

		}, realThis);
		
		 }
		
	 };


	
	render() {
		
		let form;
		let textTooLong;
		let title = "";
		let comments;
		let waiting;
		let moreResults;

		if (this.state.textTooLong) {


			textTooLong = {color: "red"}

		}

		if (!this.props.videoComments.onepage) {

		     moreResults = <div ref={this.moreComments} style={{opacity:0}} ></div>;
		

		if (this.state.waiting) {

		     waiting = <div className="center player-waiting"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;

		}

		}

		if (this.props.video) {


			if (this.props.video.user === this.props.id) {

				
				if (this.props.video) {

					title = `Notes for "${this.props.video.videoTitle}"`;


				}

				form = <div className="form-wrapper">
					<form onSubmit={this.submitForm} className="comments-form">
					<label>{this.props.timestamp}</label>
					<textarea placeholder={`Writing as ${this.props.username}`}name="note" onKeyUp={this.countTextArea} ></textarea>
					<input type="submit" value="Send"/>
					</form>
					<div className="charactersfivethousand" style={textTooLong}>{this.state.characters}/5000</div>
					</div>;

			}

		}

		if (this.props.videoComments) {


			comments = this.props.videoComments.comments.map((comment, index) => {

			return < ActualComment id={this.props.id} videoId={this.props.video.id} username={this.props.username} key={comment.id} comment={comment} />;				

				})

		}

		
		return (<div className="comments-section">
				<div className="comments-title">{title}</div> 
				{form}
				<div className="comments-container">
				{comments}
				{moreResults}
				{waiting}
				</div>
			</div>

)



	}

	};

const VideoComments = connect(mapStateToProps2)(VideoComments2);

export default VideoComments;
