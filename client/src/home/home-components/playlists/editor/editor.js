import React, { Component } from 'react';
import axios from 'axios';
import './editor.css';
import { connect } from "react-redux";
import _ from 'underscore';
import EditorHead from './edit-head';
import Search from '../../tools/search/search';
import PlaylistItem from './playlist-item';


const mapStateToProps2 = state => {

    return {

              editor: state.editorVideos,

            };

};

class DatabasePlaylist2 extends Component {
	
	constructor(props) {
		
		super(props);
		this.state = {
	
			videos: [],
			length: 0,
			playlist: {},
			url_id: null,
			nextPage: null,
			onepage: null,
			total: 0,
			waiting: false
		
		};

		this.isElementInViewPort = this.isElementInViewPort.bind(this);
                this.onVisibilityChange = this.onVisibilityChange.bind(this);
		this.messiah = this.messiah.bind(this);
		this.throttle3 = _.throttle(this.messiah, 250);
		this.scrollRef = React.createRef();
		

		}


	  static getDerivedStateFromProps(nextProps, prevState) {

            return {

            length: nextProps.editor.length,
            videos: nextProps.editor.videos,
		    playlist: nextProps.playlist,
		    onepage: nextProps.editor.onepage,
		    nextPage: nextProps.editor.nextPage,
		    total: nextProps.editor.total

            }

    }

	componentWillUnmount() {

		if (this.state.videos[0]) {

			this.props.dispatch({type: "CHANGE_PLAYLIST_PREVIEW", firstVideo: this.state.videos[0], url_id: this.props.url_id})

		}

		window.removeEventListener("scroll", this.throttle3);
		window.removeEventListener("resize", this.throttle3);


	}

	

	
	messiah() {
		 
		 let target = this.scrollRef.current;
		 let realThis = this;

		 if (target) {

		this.onVisibilityChange(target, function() {
 			
		   realThis.setState({waiting: true});		

		axios.post("/playlist/getplaylist", {

			reason: "items",
			user: realThis.props.id,
			playlist: realThis.props.url_id,
			current_page: realThis.state.nextPage,
			per_page: 50

		}).then((res) => {

			realThis.setState({waiting: false}); 
		if (res.data.page.last_page === res.data.page.current_page) {  

			realThis.props.dispatch({total: res.data.page.total, type: 'OPEN_EDITOR', onepage: true, nextPage: res.data.page.current_page + 1, url_id: realThis.props.url_id, videos: res.data.data});

	}

	else {

	realThis.props.dispatch({type: 'OPEN_EDITOR', total: res.data.page.total, onepage: false, nextPage: res.data.page.current_page + 1, url_id: realThis.props.url_id, videos: res.data.data});

	}

	}).catch((e) => {console.log(e)});

		}, realThis);
		
		 }
		
	 };


	componentDidMount() {

		axios.post("/playlist/getplaylist", {

			reason: "items",
			user: this.props.id,
			playlist: this.props.url_id,
			current_page: 1,
			per_page: 50

		}).then((res) => {
				
			if (res.data.page.last_page === res.data.page.current_page) {  

			this.props.dispatch({total: res.data.page.total ,type: 'OPEN_EDITOR', onepage: true, nextPage: res.data.page.current_page + 1, url_id: this.props.url_id, videos: res.data.data});

}

else {

	this.props.dispatch({total: res.data.page.total, type: 'OPEN_EDITOR', onepage: false, nextPage: res.data.page.current_page + 1, url_id: this.props.url_id, videos: res.data.data});

		window.addEventListener("scroll", this.throttle3);
		window.addEventListener("resize", this.throttle3);

}

		}).catch((e) => {console.log(e)});;


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


		
	render() {
		
		let moreResults;
		let waiting;
		let total = 0;

		if (this.state.total) {

			total = this.state.total;

		}
	


		if (this.state.onepage) {

		     moreResults = undefined;

		}

		if (!this.state.onepage) {

		     moreResults = <div ref={this.scrollRef} style={{opacity:0}} ></div>;
			
		if (this.state.waiting) {

		     waiting = <div className="center"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;

		}

		}

		return(<React.Fragment>
			 <div className="ply-items">{`Items (${total})`}</div>
			{this.state.videos.map((video, index) => {

					let key = video.videoId + video.order;

		return <PlaylistItem username={this.props.id} key={key} index={index} video={video} url_id={this.props.url_id}/>

})} {moreResults}{waiting}</React.Fragment>)



	}

	};

const DatabasePlaylist = connect(mapStateToProps2)(DatabasePlaylist2); 



const mapStateToProps = state => {

    return {

              editor: state.editor,
	      searchResults: state.searchResultsPlaylists.length

            };

};


class Editor2 extends Component {
	
	constructor(props) {
		
		super(props);
		this.state = {
			
			playlist: {
	
				category: "",
				title: "",
				description: "",
				public: "",
				id: ""

			}
	
		
		};

		this.classicalRemoval = this.classicalRemoval.bind(this);
		this.closeEditor = this.closeEditor.bind(this);

	};

	componentWillUnmount() {

		this.props.dispatch({type: "FIRE_EDITOR", status: false, url_id: null});
		

	this.props.dispatch({
			
				type: "CLEAR_EDITOR",
	
		});

	}

	classicalRemoval() {

			if (window.confirm("Do you really want to erase the playlist?")) {

				axios.post("/playlist/editplaylist", {

					playlistId: this.props.url_id,
					reason: "delete",	
					user: this.props.id

		}).then((res) => {

				if (res.data.deleted) {


	if (this.props.searchResults === 0) {

			 axios.post('/getplaylist', {

                user: this.props.id,
				current_page: 1,
				per_page: 12,
				reason: "all",
				scope: "user"

            }).then((res) => {
		
				if (res.data.page.last_page === res.data.page.current_page) { 
					
								this.props.dispatch({ page: res.data.page, waiting: false, scope: this.state.scope, onepage: true, reason: this.state.reason, type: "SEARCH_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page + 1});
this.props.history.push("/playlists");
			this.props.dispatch({type: 'CLEAR_EDITOR'});
			this.props.dispatch({type: 'FIRE_EDITOR', status: false, url_id: null});

				
					}
					
					else {
						
								this.props.dispatch({ page: res.data.page, waiting: false, scope: this.state.scope, onepage: false, reason: this.state.reason, type: "SEARCH_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page + 1});
this.props.history.push("/playlists");
			this.props.dispatch({type: 'CLEAR_EDITOR'});
			this.props.dispatch({type: 'FIRE_EDITOR', status: false, url_id: null});
			

					}

});} else {

			this.props.dispatch({type: "REMOVE_SEARCH_RESULT", url_id: this.props.url_id});
			this.props.history.push("/playlists");
			this.props.dispatch({type: 'CLEAR_EDITOR'});
			this.props.dispatch({type: 'FIRE_EDITOR', status: false, url_id: null});
		
			

	}
		
			

				}
				
				else {

					//setstate error

				}

		}).catch((error) => {console.log(error)});

			} 

			else {



			}


		}

		closeEditor() {

	if (this.props.searchResults === 0) {

			 axios.post('/playlist/getplaylist', {

                user: this.props.id,
				current_page: 1,
				per_page: 12,
				reason: "all",
				scope: "user"

            }).then((res) => {
		
				if (res.data.page.last_page === res.data.page.current_page) { 
					
								this.props.dispatch({ page: res.data.page, waiting: false, scope: this.state.scope, onepage: true, reason: this.state.reason, type: "SEARCH_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page + 1});
this.props.history.push("/playlists");
		this.props.dispatch({type: 'CLEAR_EDITOR'});
		this.props.dispatch({type: 'FIRE_EDITOR', status: false, url_id: null});

				
					}
					
					else {
						
								this.props.dispatch({ page: res.data.page, waiting: false, scope: this.state.scope, onepage: false, reason: this.state.reason, type: "SEARCH_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page + 1});
this.props.history.push("/playlists");
		this.props.dispatch({type: 'CLEAR_EDITOR'});
		this.props.dispatch({type: 'FIRE_EDITOR', status: false, url_id: null});

					}

}).catch((e) => {console.log(e)});

} else {

		this.props.history.push("/playlists");
		this.props.dispatch({type: 'CLEAR_EDITOR'});
		this.props.dispatch({type: 'FIRE_EDITOR', status: false, url_id: null});	



	}
					

		}

	render() {

		let editorhead;
		let databaseplaylist;

		if (this.props.url_id) {

			editorhead = <EditorHead url_id={this.props.url_id} id={this.props.id} username={this.props.username}/>;
			databaseplaylist = <DatabasePlaylist url_id={this.props.url_id} id={this.props.id} username={this.props.username}/>;

		}

		
			return (
			
				<div className="editor">
					<div className="editor-header">
					{editorhead}
					<div>
					<i title="Close Editor" onClick={this.closeEditor} className="fas fa-times closeEditor"></i>
					<i title="Remove Playlist" onClick={this.classicalRemoval} className="fas remove-button fa-trash"></i>
					</div>
					</div>
					<div className="edit-videos">
					<div className="editor-items">
					{databaseplaylist}
					</div>
					<Search url_id={this.props.url_id} id={this.props.id} reason="editor"/>
					</div>
				
				</div>
			
			);

	}
	
}

const Editor = connect(mapStateToProps)(Editor2);
 

export default Editor;
