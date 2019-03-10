import React, { Component } from 'react';
import '../ptool.css';
import { connect } from "react-redux";

const mapStateToProps = state => {

    return {  
      
            dragged: state.dragDrop.videoBeingDragged,
            overed: state.dragDrop.videoBeingOverEd,

            };
  };
  
class PlaylistItem2 extends Component {

    constructor(props) {

        super(props);
        this.state = {

            		working: false,
            		data: props.data,
			drag: false,
			over: false
            
			
        };

        	this.removeVideo = this.removeVideo.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
		this.onDragEnter = this.onDragEnter.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);

    }

    removeVideo() {

        this.props.dispatch({ 
            
            type: 'REMOVE_VIDEO',
            index: this.props.index
    
        });

    }

	componentDidUpdate() {

		console.log(this.props);


	}
	
	onDragStart(e) {
		
		this.props.dispatch({
			
				type: "DRAG_DROP",
				dragged: {data: this.state.data, index: this.props.index}
				
		});
		
		this.setState({
			
				drag: true 
				
				
		});
		
		
	}
	
	onDragEnd(e) {
		
		
		this.props.dispatch({
			
			type: "ORDER_VIDEO",
			index1: this.props.dragged,
			index2: this.props.overed
			
		});
		
	}
	
	onDragLeave(e) {
		
		if (this.state.over) {
			
			this.setState({
			
				data: this.props.data
			
			});
			
		}
		
		
	}
	
	onDragEnter(e) {
		
		this.props.dispatch({
			
				type: "DRAG_DROP",
				overed: {data: this.state.data, index: this.props.index},
				dragged: this.props.dragged
				
		});
		
		this.setState({
			
			over: true,
			data: this.props.dragged.data
			
			
		});
		
		

	}
	

    render() {

        let nr = `${this.props.index + 1}`;
        let title = this.state.data.info.snippet.title;
			
        return (<div 
        
			draggable="true"
			onDragStart={this.onDragStart}
			onDragLeave={this.onDragLeave}
			onDragEnter={this.onDragEnter}
			onDragEnd={this.onDragEnd}
                    	title="Drag to change position" 
                        className="playlist-item"
        
                    >
                    <span>{nr + "."}</span>
                    <img alt={title} src={this.state.data.info.snippet.thumbnails.default.url} />
                    <h1>{title}</h1>
                    <div><i onClick={this.removeVideo} title="Remove item" className="fas fa-trash"></i></div>
                    </div>)

    }

};

const PlaylistItem = connect(mapStateToProps)(PlaylistItem2);

export default PlaylistItem;
