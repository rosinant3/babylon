import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from 'axios';

const mapStateToProps = state => {

    return {  
      
            dragged: state.dragDropEditor.videoBeingDragged,
            overed: state.dragDropEditor.videoBeingOverEd,

            };
  };
  
class PlaylistItem2 extends Component {

    constructor(props) {

        super(props);
        this.state = {

	    thumbnail: null,
	    dragged: null,
	    overed: null,
	    oldthumbnail: null, 
	    drag: false,
	    data: {},
	    title: false,
	    over: false,
	    fix: false, 
			
        };

        this.removeVideo = this.removeVideo.bind(this);
	this.onDragLeave = this.onDragLeave.bind(this);
	this.onDragEnter = this.onDragEnter.bind(this);
	this.onDragStart = this.onDragStart.bind(this);
	this.onDragEnd = this.onDragEnd.bind(this);

    }

    removeVideo() {

	if (window.confirm("Are you sure?")) {

	axios.post("/playlist/editplaylistitems", {

			reason: "delete",
			user: this.props.username,
			playlist: this.props.url_id,
			item: this.props.video.id

	}).then((res) => {

	

	if (res.data.ok === 1) {

	this.props.dispatch({ 
            
            type: 'REMOVE_VIDEO_EDITOR',
            index: this.props.index
    
        }); 

	this.props.dispatch({

		type: 'UPDATE_PLAYLISTS_RESULT',
		index: this.props.url_id,
		delete: true
	
	});


	}
	

    	}).catch((e) => { console.log(e) });

	}

	else {



	}
}
	
	onDragStart(e) {
		
		this.props.dispatch({
			
				type: "DRAG_DROP_EDITOR",
				dragged: {dragged: true, data: this.props.video, thumbnail: this.props.video.thumbnail_default, index: this.props.index}
				
		});
		
		this.setState({
			
				drag: true 
				
				
		}); 
		
		
	}

	onDragEnd(e) {

	if (this.props.dragged.data.order !== this.props.overed.data.order) {
		axios.post("/playlist/editplaylistitems", {

			reason: "switch",
			user: this.props.username,
			playlist: this.props.url_id,
			item: this.props.dragged.data,
			item2: this.props.overed.data

		}).then((res) => {


		if (res.data.ok) {

		this.props.dispatch({
			
			type: "ORDER_VIDEO_EDITOR",
			index1: this.props.dragged,
			index2: this.props.overed
			
		}); 

		}


		}).catch((error) => {console.log(error)});

	}
		
	}
	
	onDragLeave(e) {
		
		if (this.state.over) {
			
			this.setState({
			
				data: this.state.data,
				thumbnail: this.props.video.thumbnail_default,
				title: false,
			
			});
			
		} 
		
		
	}

	onDragEnter(e) {

		this.props.dispatch({
			
				type: "DRAG_DROP_EDITOR",
				overed: {data: this.props.video, thumbnail: this.props.video.thumbnail_default, index: this.props.index},
				dragged: this.props.dragged
				
		}); 

		this.setState({thumbnail: this.props.dragged.thumbnail, over: true, title: this.props.dragged.data.videoTitle});

	}

    render() {

        let nr = `${this.props.index + 1}`;
	let thumbnail;
	let draggable;
	let title = this.props.video.videoTitle;

	if (this.state.title) {

		title = this.state.title;

	}

	if (!this.state.fix) {

		draggable = "true";

	}

	if (this.state.fix) {

		draggable = "false";

	}


	if (this.state.thumbnail) {

		thumbnail = this.state.thumbnail;


	}

	if (!this.state.thumbnail) {

		thumbnail = this.props.video.thumbnail_default;

	}

        return (<div		
        
			draggable={draggable}
			onDragStart={this.onDragStart}
			onDragLeave={this.onDragLeave}
			onDragEnter={this.onDragEnter}
			onDragEnd={this.onDragEnd}
                        title="Drag to change position" 
                        className="playlist-item"
        
                    >
                    <span>{nr + "."}</span>
                    <img alt={this.props.video.videoTitle} src={thumbnail} />
                    <h1>{title}</h1>
                    <div ><i onClick={this.removeVideo} title="Remove item" className="fas fa-trash"></i></div>
                    </div>)

    }

};

const PlaylistItem = connect(mapStateToProps)(PlaylistItem2);

export default PlaylistItem;
