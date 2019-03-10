import React, { Component } from 'react';
import axios from 'axios';
import './user_playlists.css';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { connect } from "react-redux";
import queryString from 'query-string';

const mapStateToProps = state => {

    return {};

};

class PlaylistComponent2 extends Component {

    constructor(props) {
  		
        super(props);
		this.state = {ran: false, video: {}, info: {}, editor: {}, player:{}, count: 0, numberofvideos: 0}
		this.openEditor = this.openEditor.bind(this);
		this.openPlayer = this.openPlayer.bind(this);

		this.showComponent = this.showComponent.bind(this);
		
    };

	
	componentDidMount() {

		

		let values = queryString.parse(this.props.location.search);

		if (values.edit && !values.play) {

			this.props.dispatch({type: 'FIRE_EDITOR', status: true, url_id: values.edit});

		}


		if (values.play && !values.edit) {


			this.props.dispatch({type: 'FIRE_PLAYER', status: true, url_id: values.play});

		}


		if (!("numberofvideos" in this.props.info)) { 

		axios.post('/playlist/editplaylistitems', {

                user: this.props.id,
				reason: "count",
				playlist: this.props.info.url_id		

            	}).then((res) => {
		
			if (this.props.scope === "user") {

			   this.props.dispatch({type: "UPDATE_NUMBER_OF_VIDEOS", index: this.props.info.url_id, numberofvideos: res.data.allVideos, watchedVideos: res.data.watchedVideos});


			}

			if (this.props.scope === "public") {

this.props.dispatch({type: "UPDATE_NUMBER_OF_VIDEOS_PUBLIC", index: this.props.info.url_id, numberofvideos: res.data.allVideos});

}

			  

		}).catch((error) => {console.log(error)});

}

		
	};
	
	openEditor() {
			
			this.props.history.push(`/playlists?edit=${this.props.info.url_id}`);
			this.props.dispatch({type: 'FIRE_EDITOR', status: true, url_id: this.props.info.url_id});
		
	}

	openPlayer() {
				
			if (this.props.info.numberofvideos > 0) {			

				this.props.history.push(`/playlists?play=${this.props.info.url_id}`);
				this.props.dispatch({type: 'FIRE_PLAYER', scope: this.props.scope, status: true, url_id: this.props.info.url_id});

			}
		
	}

	showComponent() {

			if ("numberofvideos" in this.props.info) {

				this.setState({ran: true});

			}

	}


    render() {

		let thumbnail;
		let info = this.props.info;
		let hidden;
		let isPublic; 
		let updatedAt = moment(info.updated_at).format("MMM Do YY");
		let createdAt = moment(info.created_t).format("MMM Do YY");  
		let editor;
		let bold = {};
		let boldVideoZero = {};
		let title = info.title;
		let category = info.category;
		let description;
		let notplayable = {};
		let link;
		let numberOfVideos;

		if (this.props.scope === "user") {
			
			editor = <Link onClick={this.openEditor} title="Edit" to={`/playlists?edit=${this.props.info.url_id}`}><i  className="fas fa-edit"></i></Link>;
			
		}
		
		if (this.props.scope === "public" && this.props.username !== info.username) {
			
			editor = <i title="Add" className="fas fa-plus"></i>
			
		}
		
				
		if (this.props.scope === "public" && this.props.username === info.username) {
			
			bold = {fontWeight: "bold"};
			
		}
		
		if (this.state.ran) {
			
			hidden = {animation: "slideIn 1s forwards"};
			
		}

		if (!info.thumbnail_medium) {

			thumbnail = "/placeholder.jpg";
			boldVideoZero = {fontWeight: "bold", color: "red"};

		}

		if (info.thumbnail_medium) {

			thumbnail = info.thumbnail_medium;

		}


		if (this.state.video.snippet) {
			
			thumbnail = this.state.video.snippet.thumbnails.medium.url;
			
		}

		if (info.public === "0") {
			
			isPublic = "No";
			
		}
		
		if (info.public === "1") {
			
			isPublic = "Yes";
			
		}

		if (info.description.length >= 500) {

			description = `${info.description.slice(0, 500)}...`;

		}

		if (info.description.length < 500) {

			description = info.description;

		}

		if (info.numberofvideos === 0) {

			thumbnail = "/placeholder.jpg";
			notplayable = {backgroundColor: "rgb(192,192,192,0.5)"};
			boldVideoZero = {fontWeight: "bold", color: "red"};
			link = <div className="play-link" style={notplayable}><i className="fas fa-play"></i></div>

		}

		if (info.numberofvideos > 0) {

			boldVideoZero = {};
			thumbnail = info.thumbnail_medium;
			link = <Link className="play-link" style={notplayable}  title="Play" onClick={this.openPlayer} to={`/playlists?play=${this.props.info.url_id}`}><i className="fas fa-play"></i></Link>;

		}

		if (info.numberofwatchedvideos === info.numberofvideos && info.numberofwatchedvideos > 0 && info.numberofvideos > 0) {

			boldVideoZero = {fontWeight: "bold", color: "green"};

		}

		if (this.props.scope === "public") {

			numberOfVideos = `Videos: ${info.numberofvideos}`;

		}

		if (this.props.scope === "user") {

			numberOfVideos = `Videos: ${info.numberofwatchedvideos}/${info.numberofvideos}`;

		}
	 
        return (<div style={hidden} className="playlist-full">
				
				<div title={description} className="playlist-image">
					{editor}
                <img  onLoad={this.showComponent} alt={info.title} src={thumbnail} />
				<div>{link}</div>
				</div>
				
				<div>
				
				<div className="playlist-info">

				<div title={info.title} className="p-title">{title}  <div style={boldVideoZero} className="p-videos">{numberOfVideos}</div></div>
				
				<div title={info.category} className="p-category">{category}</div>
				<div className="p-created"><span title={updatedAt}>{`Created at ${createdAt} by`}</span><span style={bold} > {info.username}</span></div>

				</div>
				</div>
				</div>);
            
    };
  
};

const PlaylistComponent = connect(mapStateToProps)(PlaylistComponent2);


export default PlaylistComponent;
