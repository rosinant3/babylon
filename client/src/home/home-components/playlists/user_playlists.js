import React, { Component } from 'react';
import axios from 'axios';
import './user_playlists.css';
import PlaylistComponent from './playlist-component';
import _ from 'underscore';
import { connect } from "react-redux";
import queryString from 'query-string';

import Player from "./player/player";

import Editor from "./editor/editor";

const mapStateToProps = state => {

    return {

            searchResults: state.searchResults,
	     	searchResultsPlaylists: state.searchResultsPlaylists,
			editor: state.editor,
			player: state.player,
			newadded: state.playlistVideos.newadded

            };

};

class FormComponent2 extends Component {
	
	constructor(props) {
		
		super(props);
		this.state = {
			
				searchForm: "title"
			
		};
		
		this.playlistTitle = this.playlistTitle.bind(this);
		this.playlistCategory = this.playlistCategory.bind(this);
		this.sendForm = this.sendForm.bind(this);

	};
	
	   
   playlistTitle() {
	   
	   this.setState({searchForm: "title"});
	   
   };
   
   playlistCategory() {
	   
	   this.setState({searchForm: "category"});
	   
   };
   
   sendForm(e) {
	   
	   e.preventDefault();
	   
	   let target = e.target[this.state.searchForm].value;

	   if (this.props.searchResults.search !== target) {
	   
			this.props.dispatch({ form: true, page: {total: 0}, scope: this.props.scope, moreWaiting: false, waiting: true, type: "SEARCH_ACTION", ran: false, search: null, length: 0, playlists: [], nextPage: null, reason: "all" });

			
		  axios.post('/playlist/getplaylist', {

                		user: this.props.id,
				current_page: 1,
				per_page: 12,
				search: target,
				reason: this.state.searchForm,
				scope: this.props.scope,

            }).then((res) => {
				
				if (res.data.page.last_page === 0 || res.data.page.last_page === res.data.page.current_page) { 
					
								this.props.dispatch({ form: true, page: res.data.page, search: target, waiting: false, scope: this.props.scope, onepage: true, reason: this.state.rsearchForm, type: "SEARCH_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page});

				
					}
					
					else {
						
								this.props.dispatch({ form: true, page: res.data.page, search: target, waiting: false, scope: this.props.scope, onepage: false, moreWaiting: false, reason: this.state.searchForm, type: "SEARCH_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page + 1});

					}
				
			}).catch((e) => {console.log(e)});

	}
	   
	   
   };

	render() {
		
		let placeholder;
		let inputName;
		let titleActive = {backgroundColor: "rgba(114, 29, 114, 0.95)"};
		let categoryActive = {};
		
		if (this.state.searchForm === "title") {
			
			placeholder = "Search for playlist...";
			categoryActive = {};
			titleActive = {backgroundColor: "rgba(114, 29, 114, 0.95)"};
			inputName = "title";
			
		}
		
		if (this.state.searchForm === "category") {
			
			placeholder = "Search for category...";
			titleActive = {};
			categoryActive =  {backgroundColor: "rgba(114, 29, 114, 0.95)"};
			inputName = "category";
			
		}
	
			return (<form onSubmit={this.sendForm} className="library-form">
				<div>
				<label className="left-border-radius" style={titleActive} onClick={this.playlistTitle}>Title</label>
				<label className="right-border-radius" style={categoryActive} onClick={this.playlistCategory}>Category</label>
				</div>
				<div>
				<input type="text" placeholder={placeholder} name={inputName} />
				<input className="button-form-library" type="submit" value="Search"/>
				</div>
			</form>);

	}
	
}

const FormComponent = connect(mapStateToProps)(FormComponent2);

class UserPlaylists2 extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

			playlists: [],
			searchForm: "title",
			nextPage: 1,
			reason: "all",
			length: null,
			search: null,
			ran: null,
			scope: "user",
			onepage: null,
			editor: {status: false, url_id: null},
			player: {status: false, url_id: null},
			waiting: true,
			moreWaiting: false,
			page: {total: 0},
			form: false,
			newadded: false

        };
		
		this.isElementInViewPort = this.isElementInViewPort.bind(this);
                this.onVisibilityChange = this.onVisibilityChange.bind(this);
		this.messiah = this.messiah.bind(this);
		this.throttle = _.throttle(this.messiah, 250);
		this.scrollRef = React.createRef();

		this.getPlaylistsFunction = this.getPlaylistsFunction.bind(this);

    };
	
	    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.searchResults.length !== prevState.playlists.length || nextProps.searchResults.waiting !== prevState.waiting || nextProps.searchResults.form !== prevState.form || nextProps.newadded !== prevState.newadded  || nextProps.searchResults.moreWaiting !== prevState.moreWaiting) {

            return {

                		playlists: nextProps.searchResultsPlaylists.playlists,
				nextPage: nextProps.searchResults.nextPage,
				reason: nextProps.searchResults.reason,
				search: nextProps.searchResults.search,
				ran: nextProps.searchResults.ran,
				onepage: nextProps.searchResults.onepage,
				editor: nextProps.editor,
				player: nextProps.player,
				scope: nextProps.searchResults.scope,
				waiting: nextProps.searchResults.waiting,
				moreWaiting: nextProps.searchResults.moreWaiting,
				page: nextProps.searchResults.page,
				form:nextProps.searchResults.form,
				newadded: nextProps.newadded

            }

        }
	
        else {

            return null;

        }

    }
	
	componentDidMount() {

		const values = queryString.parse(this.props.location.search);
		document.title = "Babylon | Playlists";

		if (values.edit && !values.play) {

			this.props.dispatch({type: 'FIRE_EDITOR', status: true, url_id: values.edit});

		}


		if (values.play && !values.edit) {


			this.props.dispatch({type: 'FIRE_PLAYER', status: true, url_id: values.play, scope: this.state.player.scope});

		}

		if (this.state.playlists.length > 0 && !this.state.onepage) {

			window.addEventListener("scroll", this.throttle);
				
		}



		if (this.state.playlists.length === 0 || this.state.newadded) { 


			this.getPlaylistsFunction();


		}

		 
		 

	};
	
	componentWillUnmount() {
		
		window.removeEventListener("scroll", this.throttle);

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
      
	 messiah() {
		
		 let target = this.scrollRef.current;
		 let realThis = this;

		 if (target) {

		this.onVisibilityChange(target, () => {

			window.removeEventListener("scroll", this.throttle);

			realThis.props.dispatch({type: 'MORE_WAITING'});
		
			this.getPlaylistsFunction();

		},  realThis);
		
		 }
		
	 };


	getPlaylistsFunction() {

		let body;
		let currentPage = this.state.nextPage;

		if (this.state.newadded || this.state.playlists.length === 0) {

			currentPage = 1;
			

		}
		
		if (this.state.form) {

			body = {user: this.props.id,
				current_page: currentPage,
				per_page: 12,
				search: this.state.search,
				reason: this.state.reason,
				scope: this.state.scope};

		}

		if (!this.state.form) {

			body = {user: this.props.id,
				current_page: currentPage,
				per_page: 12,
				reason: this.state.reason,
				scope: "user"}

		}

	 axios.post('/playlist/getplaylist', body).then((res) => {

				let newplaylists = res.data.data;
   		
				if (!this.state.newadded) {

					newplaylists =  this.state.playlists.slice();
	
					res.data.data.forEach((playlist) => {

						newplaylists.push(playlist);

					});

				}

				this.props.dispatch({type: "CLEAR_VIDEO", nedadded: false});
		
				if (res.data.page.last_page === 0 || res.data.page.last_page === res.data.page.current_page) { 
					
								this.props.dispatch({ form: false, page: res.data.page, waiting: false, scope: this.state.scope, onepage: true, reason: this.state.reason, type: "SEARCH_ACTION", playlists: newplaylists, nextPage: res.data.page.current_page + 1});

	
			window.removeEventListener("scroll", this.throttle);
		

					}
					
					else {
						
		this.props.dispatch({ form: false, page: res.data.page, waiting: false, scope: this.state.scope, onepage: false, moreWaiting: false, reason: this.state.reason, type: "SEARCH_ACTION", playlists: newplaylists, nextPage: res.data.page.current_page + 1});
		window.addEventListener("scroll", this.throttle);
	
				

					}
				
	
			}).catch((error) => {console.log(error)});



	}


    render() {
		
		let moreResults;
		let content;
		let waiting;
		let moreWaiting;
		let library = `${this.props.username}'s Library (${this.state.page.total})`;

		if (!this.state.onepage) {

			moreResults = <div ref={this.scrollRef} ></div>;
		
			
		}

		if (this.state.editor.status) {
			
			moreResults = "";
			content = <Editor location={this.props.location} history={this.props.history} username={this.props.username} id={this.props.id} url_id={this.state.editor.url_id} />;
			
		}

		if (this.state.player.status) {

			moreResults = "";
			content = <Player location={this.props.location} history={this.props.history} username={this.props.username} id={this.props.id} url_id={this.state.player.url_id}/>;

		}
		
		if (this.state.waiting) {
			
			waiting = <div className="center"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;
			
		}

		if (this.state.moreWaiting) {
			
			moreWaiting = <div className="center"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;

		}

		if (!this.state.editor.status && !this.state.player.status) {
			
		content = <React.Fragment>
		<div className="user-library">
		{library}
		<FormComponent scope={this.state.scope} id={this.props.id}/>
		{waiting}
		</div>
		<div className="user-playlists">
		{this.state.playlists.map((playlist, index) => {
						
						let key = playlist.url_id + playlist.numberofvideos + playlist.numberofwatchedvideos;

						return <PlaylistComponent location={this.props.location} history={this.props.history} id={this.props.id} username={this.props.username} scope={this.state.scope} info={playlist} key={key} />
						
		})}

         </div>
			{moreWaiting}
	{moreResults}	
		</React.Fragment>;
			
		}

        return (<div>{content}</div>);
            
    };
  
};

const UserPlaylists = connect(mapStateToProps)(UserPlaylists2);

export default UserPlaylists;
