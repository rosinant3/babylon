import React, { Component } from 'react';
import axios from 'axios';
import './user_playlists.css';
import PlaylistComponent from './playlist-component';
import _ from 'underscore';
import Articles from '../articles/article';


import { connect } from "react-redux";

const mapStateToProps = state => {

    return {

			 public: state.public,
			 publicPlaylists: state.publicPlaylists,
			 player: state.player,
			 reader: state.reader,
			 editor: state.editor

            };

};

class FormComponent2 extends Component {
	
	constructor(props) {
		
		super(props);
		this.state = {
			
				searchForm: "title",
				searchReason: "playlist"
			
		};
		
		this.playlistTitle = this.playlistTitle.bind(this);
		this.playlistCategory = this.playlistCategory.bind(this);
		this.sendForm = this.sendForm.bind(this);
		this.playlists = this.playlists.bind(this);
		this.articles = this.articles.bind(this);
	

	};

   playlists() {

	this.setState({ searchReason: "playlist" });

  }

  articles() {

	this.setState({ searchReason: "article" });

  }
	
	   
   playlistTitle() {
	   
	   this.setState({searchForm: "title"});
	   
   };
   
   playlistCategory() {
	   
	   this.setState({searchForm: "category"});
	   
   };

   componentDidUpdate(prevProps, prevState) {

	if (prevProps.public.globalReason !== this.state.searchReason) {

		this.props.dispatch({form: false, page: {total: 0}, moreWaiting: false, scope: this.props.scope, waiting: true, type: "PUBLIC_ACTION", ran: false, search: null, length: 0, playlists: [], globalReason: this.state.searchReason, nextPage: 1, reason: "all" });

	}


   }

   componentDidMount() {

	this.setState({ searchReason: this.props.public.globalReason });
	document.title = "Babylon";

   }
   
   sendForm(e) {
	   
	   e.preventDefault();
	   
	   let target = e.target[this.state.searchForm].value;
	   let getPath;

	   if (this.state.searchReason === "playlist") {

		getPath = '/playlist/getplaylist';

	   }

	    if (this.state.searchReason === "article") {

		getPath = '/article/get';

	   }

	this.props.dispatch({form: false, page: {total: 0}, moreWaiting: false, scope: this.props.scope, waiting: true, type: "PUBLIC_ACTION", ran: false, search: null, length: 0, playlists: [], globalReason: this.state.searchReason, nextPage: 1, reason: "all" });
	   
		  axios.post(getPath, {

                		user: this.props.id,
				current_page: 1,
				per_page: 12,
				search: target,
				reason: this.state.searchForm,
				scope: this.props.scope,

            }).then((res) => {
				
				if (res.data.page.last_page === 0 || res.data.page.last_page === res.data.page.current_page) { 
					
						this.props.dispatch({ globalReason: this.state.searchReason, form: true, page: res.data.page, search: target, waiting: false, scope: this.props.scope, onepage: true, moreWaiting: false, reason: this.state.searchForm, type: "PUBLIC_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page});

				
					}
					
					else {
						
						this.props.dispatch({ globalReason: this.state.searchReason,  form: true, page: res.data.page, search: target, waiting: false, scope: this.props.scope, onepage: false, moreWaiting: false, reason: this.state.searchForm, type: "PUBLIC_ACTION", playlists: res.data.data, nextPage: res.data.page.current_page + 1});

					}
					
			
			}).catch((e) => {console.log(e)});;
	   
	   
   };

	render() {
		
		let placeholder = `Search for ${this.state.searchReason}...`;
		let inputName;
		let titleActive = {backgroundColor: "rgba(114, 29, 114, 0.95)"};
		let categoryActive = {};
		let playlistActive = {};
		let articleActive = {};
		
		if (this.state.searchForm === "title") {
		
			categoryActive = {};
			titleActive = {backgroundColor: "rgba(114, 29, 114, 0.95)"};
			inputName = "title";
			
		}
		
		if (this.state.searchForm === "category") {
	
			titleActive = {};
			categoryActive =  {backgroundColor: "rgba(114, 29, 114, 0.95)"};
			inputName = "category";
			
		}

		if (this.state.searchReason === "playlist") {

			playlistActive = {backgroundColor: "rgba(114, 29, 114, 0.95)"};
			articleActive = {};

		}

		if (this.state.searchReason === "article") {

			articleActive = {backgroundColor: "rgba(114, 29, 114, 0.95)"};
			playlistActive = {};

		}
	
			return (<form onSubmit={this.sendForm} className="library-form">
				<div>
				<label className="left-border-radius" style={playlistActive} onClick={this.playlists}>P</label>
				<label style={articleActive} onClick={this.articles}>A</label>
				<label style={titleActive} onClick={this.playlistTitle}>Title</label>
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

class UserPlaylistsPublic2 extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

			playlists: [],
			searchForm: "title",
			nextPage: 1,
			reason: "all",
			length: false,
			search: false,
			ran: false,
			scope: "public",
			onepage: false,
			moreWaiting: false,
			page: {total: 0},
			editor: {status: false, url_id: null},
			player: {status: false, url_id: null},
			reader: {status: false, url_id: null},
			waiting: true,
			form: false,
			globalReason: "playlist"

        };
		
		this.isElementInViewPort = this.isElementInViewPort.bind(this);
        	this.onVisibilityChange = this.onVisibilityChange.bind(this);
		this.messiah = this.messiah.bind(this);
		this.throttle_public = _.throttle(this.messiah, 250);
		this.scrollRef = React.createRef();

		this.getPlaylistsFunction = this.getPlaylistsFunction.bind(this);

    };
	
	    static getDerivedStateFromProps(nextProps, prevState) {

		 if (nextProps.publicPlaylists.playlists.length !== prevState.playlists.length || nextProps.public.waiting !== prevState.waiting || nextProps.public.form !== prevState.form || nextProps.public.moreWaiting !== prevState.moreWaiting || nextProps.public.globalReason !== prevState.globalReason || nextProps.player.status !== prevState.player.status || nextProps.reader.status !== prevState.reader.status || nextProps.editor.status !== prevState.editor.status) {

            return {

				playlists: nextProps.publicPlaylists.playlists,
				nextPage: nextProps.public.nextPage,
				reason: nextProps.public.reason,
				search: nextProps.public.search,
				ran: nextProps.public.ran,
				onepage: nextProps.public.onepage,
				waiting: nextProps.public.waiting,
				scope: nextProps.public.scope,
				moreWaiting: nextProps.public.moreWaiting,
				page: nextProps.public.page,
				form: nextProps.public.form,
				globalReason: nextProps.public.globalReason,
				player: nextProps.player,
				reader: nextProps.reader,
				editor: nextProps.editor
				
			 
            }

  	
	}

        else {

            return null;

        }

    }

	componentDidMount() {

		if (this.state.playlists.length > 0 && !this.state.onepage) {

			window.addEventListener("scroll", this.throttle_public);
			window.addEventListener("resize", this.throttle_public);

		}

		if (this.state.playlists.length === 0) { 

			this.getPlaylistsFunction();

		}

	};

	componentDidUpdate(prevProps, prevState) {

		if (prevState.globalReason !== this.state.globalReason) {

			this.getPlaylistsFunction();
			

		}


		if (this.state.playlists.length > 0 && !this.state.onepage) {

			window.addEventListener("scroll", this.throttle_public);
			window.addEventListener("resize", this.throttle_public);

		}

	}
	
	componentWillUnmount() {
		
		window.removeEventListener("scroll", this.throttle_public);
		window.removeEventListener("resize", this.throttle_public);

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

		 if (target) {

		this.onVisibilityChange(target, () => {
		window.removeEventListener("scroll", this.throttle_public);
	
		this.props.dispatch({type: 'MORE_WAITING_PUBLIC'});

		this.getPlaylistsFunction();



		},  this);
		
		 }
		
	 };

	getPlaylistsFunction() {

	        let body;
		let getPath;

		if (this.state.globalReason === "playlist") {

			getPath = '/playlist/getplaylist';

		}

		if (this.state.globalReason === "article") {

			getPath = '/article/get';

		}

		if (this.state.form) {

			body = {user: this.props.id,
				current_page: this.state.nextPage,
				per_page: 12,
				search: this.state.search,
				reason: this.state.reason,
				scope: this.state.scope};

		}

		if (!this.state.form) {

			body = {user: this.props.id,
				current_page: this.state.nextPage,
				per_page: 12,
				reason: this.state.reason,
				scope: this.state.scope}

		}

		  axios.post(getPath, body).then((res) => {
		
if (res.data.page.last_page === 0 || res.data.page.last_page === res.data.page.current_page) {
				
				this.props.dispatch({type: 'ADD_NEW_PUBLIC_SEARCH_RESULT', page: res.data.page, playlists: res.data.data, nextPage: res.data.page.current_page, onepage: true, moreWaiting: false, waiting: false});
				
			window.removeEventListener("scroll", this.throttle_public);



				
			}
			
			else {
				
					 
				this.props.dispatch({type: 'ADD_NEW_PUBLIC_SEARCH_RESULT', page: res.data.page, playlists: res.data.data, nextPage: res.data.page.current_page + 1, onepage: false, moreWaiting: false, waiting: false});
				window.addEventListener("scroll", this.throttle_public);
				

			}
			
			}).catch((error) => {console.log(error)});



	}

    render() {
		
		let moreResults;
		let content;
		let waiting;
		let moreWaiting;
		let library = `Public Library (${this.state.page.total})`;
		let grid;
	
		if (!this.state.onepage) {

			moreResults = <div style={{ width: "100%", height: "50px" }} ref={this.scrollRef} ></div>;
		
		}

		if (this.state.waiting) {
			
			waiting = <div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>;
			
		}

		if (this.state.moreWaiting) {

			moreWaiting = <div className="center"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;

		}

		if (!this.state.editor.status && !this.state.player.status && !this.state.reader.status && this.state.globalReason === "playlist") {
			
		content = <React.Fragment>
		<div className="user-library">
		{library}
		<FormComponent scope={this.state.scope} id={this.props.id}/>
		{waiting}
		</div>
		<div className="user-playlists">
		{this.state.playlists.map((playlist, index) => {
						
						let key = playlist.url_id + playlist.numberofvideos;

						return <PlaylistComponent location={this.props.location} history={this.props.history} id={this.props.id} username={this.props.username} scope={this.state.scope} info={playlist} key={key} />
						
		})}

         </div>
			{moreWaiting}
	{moreResults}	
		</React.Fragment>;
			
		}

		if (!this.state.editor.status && !this.state.player.status && !this.state.reader.status && this.state.globalReason === "article") {
			
		content = <React.Fragment>
		<div className="user-library">
		{library}
		<FormComponent scope={this.state.scope} id={this.props.id}/>
		{waiting}
		</div>
		<div className="article-container">
		{this.state.playlists.map((article) => {
						
				return <Articles location="public" history={this.props.history} key={article.url_id} article={article} user={this.props.id} />;
						
		})}

         </div>
		{moreWaiting}
	        {moreResults}	
	 	</React.Fragment>;
			
		}

        return (<div>{content}</div>);
            
    };
  
};

const UserPlaylistsPublic = connect(mapStateToProps)(UserPlaylistsPublic2);

export default UserPlaylistsPublic;
