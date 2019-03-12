import React, { Component } from 'react';
import './articles.css';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'underscore';
import queryString from 'query-string';
import Linkify from "react-linkify";


const mapStateToProps = state => {

    return { 

		articleComments: state.articleComments,
		reader: state.reader

	   };

};

class Comment2 extends Component {

		constructor(props) {
		
			super(props);

			this.state = {

				commentError: false,
				editComment: false,
				textAreaValue: false,
				textAreaCharacters: 0

			};

			this.removeComment = this.removeComment.bind(this);
			this.editComment = this.editComment.bind(this);

			this.sendForm = this.sendForm.bind(this);
			this.textAreaValue = this.textAreaValue.bind(this);


		}

		sendForm(e) {

			e.preventDefault();
		
			let value = e.target.updated_comment.value.trim();

			let body = {};
			    body.reason = "edit_comment"
		            body.commentId = this.props.comment.id;
			    body.user = this.props.id;
			    body.comment = value;
			    body.url_id = this.props.url_id;

			if (value === "" || value.length > 5000) {

				this.setState({ commentError: true });


			}

			else {

				this.setState({ commentError: false });

				if (value !== this.props.comment.comment ) {

					axios.post("/article/edit", body).then((res) => {

						if (res.data.commentError) {

							this.setState({ commentError: true });

						}

						else {

							this.setState({ editComment: false });
							this.props.dispatch({ type: "UPDATE_ONE_ARTICLE_COMMENT", comment: value, id: this.props.comment.id});


						}

					})
					.catch((e) => { console.log(e); });

				}


			}

		}

		textAreaValue(e) {

			e.preventDefault()

			let value = e.target.value.trim();

			this.setState({ textAreaValue: value, textAreaCharacters: value.length });


		}

		editComment() {

			if (this.state.editComment) {

				if (this.state.textAreaValue === false) {

					this.setState({ editComment: false });

				}

				else {


					if (window.confirm("Discard all changes?")) {

						this.setState({ editComment: false });

					}



				}

			}

			if (!this.state.editComment) {


				this.setState({ editComment: true });
				

			}


		}

		removeComment() {

			if (window.confirm("Are you sure?")) {

				let body = {};
				    body.commentId = this.props.comment.id;
				    body.url_id = this.props.url_id;
				    body.user = this.props.id;
				    body.reason = "remove_comment";

				axios.post('/article/edit', body).then((res) => {

					if (res.data.removed === 1) {

					 	this.props.dispatch({ type: "REMOVE_ONE_ARTICLE_COMMENT", id: this.props.comment.id });

					}


				})
				.catch((e) => { console.log(e); });


			}


			else {



			}

		}

		componentDidMount() {

			if (this.props.comment) {

				this.setState({ textAreaCharacters: this.props.comment.comment.length });

			}


		}


		render() {

			let commentError = {};
			let edit;
			let remove;

			if (this.props.comment.user === this.props.id) {

				edit = <i onClick={this.editComment} title={"Edit"} className="fas fa-edit comment-footer-edit"></i>;
				remove = <i onClick={this.removeComment} title={"Remove"} className="fas fa-times comment-footer-remove"></i>
;


			}

			if (this.state.commentError) {

				commentError = {color: "red"};

			}

			let comment = <div title={moment(this.props.comment.updated_at).format('MMMM Do YYYY, h:mm:ss a')} className="comment-article">{this.props.comment.comment}</div>;

			if (this.state.editComment) {

				comment = <form onSubmit={this.sendForm} className="comment-edit-form">
				
						<textarea onKeyUp={this.textAreaValue} name="updated_comment"defaultValue={this.props.comment.comment}></textarea>
						<div style={commentError}>{this.state.textAreaCharacters}/5000</div>
						<button type="submit">Save</button>


					</form>


			}

			return (<div  className="one-comment">
					<Linkify properties={{target: '_blank', rel:"noopener noreferrer"}}>{comment}</Linkify>
					<div className="article-comment-footer">
					<div className="comment-footer-username">{`by ${this.props.comment.username}`}</div>
					{edit}
					{remove}
					</div>
					</div>);

		}
	

}

const Comment = connect(mapStateToProps)(Comment2);

class Comments2 extends Component {

	constructor(props) {

		super(props);
		this.state = {

			characters: 0,
			textAreaError: false,
			fired: false,
			waiting: false

		}
	
		this.sendForm = this.sendForm.bind(this);
		this.count = this.count.bind(this);

		this.getComments = this.getComments.bind(this);

		this.isElementInViewPort = this.isElementInViewPort.bind(this);
        	this.onVisibilityChange = this.onVisibilityChange.bind(this);
		this.messiah = this.messiah.bind(this);
		this.moreArticleComments = _.throttle(this.messiah, 250);
		this.scrollRef = React.createRef();


	} 

	messiah() {
		
		 let target = this.scrollRef.current;
		 let realThis = this;
		 let reason = "all";

		 if (target) {

		this.onVisibilityChange(target, () => {

			this.props.scrollContainer.removeEventListener("scroll", this.moreArticleComments);
			this.setState({waiting: true});
		
			this.getComments();

		},  realThis);
		
		 }
		
	 };

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

	count(e) {

		let value = e.target.value.trim();

		this.setState({ characters: value.length, textAreaError: false });

		if (value.length > 5000) {

			this.setState({textAreaError: true});

		}	

	}

	componentWillUnmount() {

		this.props.dispatch({ type: "CLEAR_ACTICLE_COMMENTS", comments: [], onepage: false, nextPage: 1});


	}

	sendForm(e) {

		e.preventDefault();
		let target = e.target.comment;

		let comment = target.value.trim();
		let body = {};

		if (comment === "" || comment.length > 50000) {


			this.setState({textAreaError: true});

		}


		else {

			body.user = this.props.id;
			body.url_id = this.props.url_id;
			body.comment = comment;
			body.reason = "comment"
			
			this.setState({textAreaError: false});

			axios.post("/article/add", body).then((res) => {

				if (res.data.added[0]) {

				    let newComment = {};
				    newComment.created_at = new Date();
				    newComment.updated_at = new Date();
				    newComment.comment = comment;
				    newComment.username = this.props.username;
				    newComment.user = this.props.id;
				    newComment.id = res.data.added[0]
				
				    target.value = "";
				    this.setState({ characters: 0 });
				    this.props.dispatch({ type: "ADD_ONE_COMMENT",  comment: newComment});

				}

			}).catch((e) => { console.log(e); });

		}

	}

	componentDidUpdate() {

		if (this.props.url_id && !this.state.fired) {
	  
			this.setState({fired: true});
			this.getComments();
			
		}

	}

	getComments() {


			let body = {};
		    	body.url_id = this.props.url_id;
		    	body.per_page = 12;
		    	body.reason = "comments";
			body.current_page = this.props.articleComments.nextPage;

			if (!this.state.waiting) {

				this.setState({ waiting: true });

			}

			axios.post("/article/get", body).then((res) => {

				let onepage;
				let nextPage = res.data.page.current_page;
				let lastPage = res.data.page.last_page;

				this.setState({waiting: false});
				if ( res.data.page.last_page === 0 ) {

					lastPage = 1;

				}

				if ( nextPage === lastPage ) {

					onepage = true;
					this.props.dispatch({ type: "ADD_ACTICLE_COMMENTS", comments: res.data.data, onepage: onepage, nextPage: nextPage});


				}

				if ( nextPage !== lastPage ) {

				
					onepage = false;
					nextPage++;

					this.props.scrollContainer.addEventListener("scroll", this.moreArticleComments);

					this.props.dispatch({ type: "ADD_ACTICLE_COMMENTS", comments: res.data.data, onepage: onepage, nextPage: nextPage});

				}

			}).catch((e) => { console.log(e); });




	}

	render() {

		let textAreaError = {};
		let waiting;
		let moreResults;
		let form;
		
		if (this.state.waiting) {

			waiting = <div className="center"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;

		}

		if (!this.props.articleComments.onepage) {

			moreResults = <div ref={this.scrollRef} className="more-results-article-comments"></div>

		}

		if (this.state.textAreaError) {

			textAreaError = {color: "red"}

		}

		if (this.props.id === this.props.user) {

			form = <form onSubmit={this.sendForm} className="reader-comments-form">
			<textarea onKeyUp={this.count} name="comment" placeholder={`Writing as ${this.props.username}`}></textarea>
			<div style={textAreaError}>{this.state.characters}/5000</div>
			<input type="submit" value="Send"/>
			</form>

		}

		return <div className="reader-comments">
			{form}
			<div className="reader-actual-comments">
			{this.props.articleComments.comments.map((comment) => {
				
				return <Comment key={comment.id} comment={comment} id={this.props.id} url_id={this.props.url_id} />;


			})}
			{waiting}
			{moreResults}
			</div>
			</div>




	}

}

const Comments = connect(mapStateToProps)(Comments2);

class Reader2 extends Component {

	constructor(props) {

		super(props);
		this.state = {

			article: {},
			editTitle: false,
			editCategory: false,
			editThumbnail: false,
			loaded: false,
			waiting: false

		}

		this.showArticle = this.showArticle.bind(this);
		this.closeReader = this.closeReader.bind(this);
		this.removeArticle = this.removeArticle.bind(this);
	
		this.toggleEditTitle = this.toggleEditTitle.bind(this);
		this.toggleEditCategory = this.toggleEditCategory.bind(this);
		this.toggleEditThumbnail = this.toggleEditThumbnail.bind(this);

		this.doneEditing = this.doneEditing.bind(this);
		this.doneEditingEnter = this.doneEditingEnter.bind(this);
		this.editor = this.editor.bind(this);

		this.titleInput = React.createRef();
		this.categoryInput = React.createRef();
		this.thumbnailInput = React.createRef();

		this.scrollContainer = React.createRef();

		this.scrollToComments = this.scrollToComments.bind(this);

	}

	scrollToComments() {

		this.scrollContainer.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});

	}

	toggleEditThumbnail() {

		if (this.state.article.user === this.props.id) {

		this.setState({editThumbnail: true});

		window.setTimeout(() => {
			
			this.thumbnailInput.current.focus();
			
		}, 1);

		}
	

	}


	toggleEditTitle() {

		if (this.state.article.user === this.props.id) {

		this.setState({editTitle: true});

		window.setTimeout(() => {
			
			this.titleInput.current.focus();
			
		}, 1);

		}

	
	

	}

	toggleEditCategory() {

		if (this.state.article.user === this.props.id) {

		this.setState({editCategory: true});

		window.setTimeout(() => {
			
			this.categoryInput.current.focus();
			
		}, 1);

		}

	}

	showArticle() {

		this.setState({ loaded: true });

	}

	closeReader() {

		let location;

		if (this.props.reader.location === "public") {

			location = `/`;

		}

		if (this.props.reader.location === "user") {

			location = `/articles`;

		}

		this.props.history.push(location);
		this.props.dispatch({type: 'READ', status: false, url_id: false, location: false});

	}

	componentWillUnmount() {

		
		this.props.dispatch({type: 'READ', status: false, url_id: false, location: false});

	}

	removeArticle() {
	
		let body = {};
		    body.url_id = this.props.url_id;
		    body.user = this.props.id;
		    body.reason = "remove_article";

		if (window.confirm("Are you sure?")) {

			axios.post('/article/edit', body).then((res) => {

			    if (res.data.removed === 1) {

				this.props.history.push(`/articles`);
				this.props.dispatch({type: "REMOVE_USER_ARTICLE", url_id: this.props.url_id});
				this.props.dispatch({type: 'READ', status: false, url_id: false, location: false});

			     }
				

			})
			.catch((e) => {console.log(e)});

		}

		else {



		}

	}

	componentDidMount() {

		let body = {};
		    body.url_id = this.props.url_id;
		    body.user = this.props.id;
		    body.reason = "url";

		axios.post('/article/get', body).then((res) => {

			if (res.data[0].user === this.props.id || res.data[0].public === "1") {

				this.setState({article: res.data[0]});
				document.title = `Babylon | ${res.data[0].title}`;

			}

			else {

				this.props.history.push(`/articles`);
				this.props.dispatch({type: 'READ', status: false, url_id: false, location: false});

			}


		})
		.catch((error) => {console.log(error)});




	}

	doneEditing(e) {

		e.preventDefault();

		this.editor(e);



	}


	doneEditingEnter(e) {

		if (e.key === 'Enter') {

			this.editor(e);

		}


	}

	editor(e) {

		let value = e.target.value.trim();
		let name = e.target.name;
		let body = {};
		    body.reason = name;
		    body.url_id = this.state.article.url_id;
		    body.user = this.props.id;
		let expression = `(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))`;
		let regex = new RegExp(expression);
		    

		if (name === "title" && value !== this.state.article.title && value !== "" && value.length < 500) {

			body.title = value;

			axios.post("/article/edit", body)
			.then((res) => {

				if ( res.data.edited === 1 ) {

					this.setState({ article: { ...this.state.article, title: value }});
					this.setState({ editTitle: false });
					this.props.dispatch({ type: "UPDATE_ARTICLE", what: name, url_id: this.state.article.url_id, title: value });

				}


			})
			.catch((e) => { console.log(e) });

		} 


		if (name === "category" && value !== this.state.article.category && value !== "" && value.length < 500) {

			body.category = value;

			axios.post("/article/edit", body)
			.then((res) => {
			
				if ( res.data.edited === 1 ) {

					this.setState({ article: { ...this.state.article, category: value }});
					this.setState({ editCategory: false });
					this.props.dispatch({ type: "UPDATE_ARTICLE", what: name, url_id: this.state.article.url_id, category: value });

				}



			})
			.catch((e) => { console.log(e) });



		}

		if (name === "thumbnail" && value !== this.state.article.thumbnail && value !== "" && value.length < 500 && regex.test(value)) {

			body.thumbnail = value;

			axios.post("/article/edit", body)
			.then((res) => {
			
				if ( res.data.edited === 1 ) {

					this.setState({ article: { ...this.state.article, thumbnail: value }});
					this.setState({ editThumbnail: false });
					this.props.dispatch({ type: "UPDATE_ARTICLE", what: "thumbnail", url_id: this.state.article.url_id, thumbnail: value });

				}



			})
			.catch((e) => { console.log(e) });



		}

		if (name === "isPublic") {

			body.isPublic = e.target.checked;
			let value;

			if (body.isPublic === true) {
		
				value = "1";

			}

			if (body.isPublic === false) {

				value = "0";

			}

			axios.post("/article/edit", body)
			.then((res) => {
			
				if ( res.data.edited === 1 ) {

					this.setState({ article: { ...this.state.article, public: value }});
					this.props.dispatch({ type: "UPDATE_ARTICLE", what: "isPublic", url_id: this.state.article.url_id, isPublic: e.target.checked });

				}



			})
			.catch((e) => { console.log(e) });



		}

		if (name === "title" && value === this.state.article.title) {

			this.setState({ editTitle: false });

		}

		if (name === "category" && value === this.state.article.category) {

			this.setState({ editCategory: false });

		}

		if (name === "thumbnail" && value === this.state.article.thumbnail) {

			this.setState({ editThumbnail: false });

		}

	}

	render() {

		let link;
		let title;
		let category;
		let created_at;
		let thumbnail;
		let isPublic;
		let username;
		let remove;

		if (this.state.article.link) {

			link = this.state.article.link;
			title = <span onClick={this.toggleEditTitle}>{this.state.article.title}</span>;
			category = <span onClick={this.toggleEditCategory}>{this.state.article.category}</span>;
			created_at = moment(this.state.article.created_at).format("MMM Do YY");
			username = this.state.article.username;

			if (this.state.editTitle) {

				title = <input ref={this.titleInput} name="title" onKeyDown={(e)=>{this.doneEditingEnter(e)}} onBlur={this.doneEditing} className="reader-input-title" defaultValue={this.state.article.title} type="text" />;

			}

			if (this.state.editCategory) {

				category = <input ref={this.categoryInput} name="category" onKeyDown={(e)=>{this.doneEditingEnter(e)}} onBlur={this.doneEditing} className="reader-input-category" defaultValue={this.state.article.category} type="text" />;

			}

			if (this.state.editThumbnail) {

				thumbnail = <input ref={this.thumbnailInput} name="thumbnail" onKeyDown={(e)=>{this.doneEditingEnter(e)}} onBlur={this.doneEditing} className="reader-input-category" defaultValue={this.state.article.thumbnail} type="text" />;

			}

			if (this.state.article.public === "1" && this.state.article.user === this.props.id) {
				
				isPublic = <React.Fragment><input type="checkbox" name="isPublic" onChange={this.doneEditing} checked={true} /><label>Public</label></React.Fragment>;

			}

			if (this.state.article.public === "0" && this.state.article.user === this.props.id) {
				
				isPublic = <React.Fragment><input type="checkbox" name="isPublic" onChange={this.doneEditing} checked={false} /><label>Public</label></React.Fragment>;

			}

			if (this.state.article.user === this.props.id) {

				remove = <div className="reader-remove"><i onClick={this.removeArticle} className="fas fa-trash"></i></div>;
				thumbnail = <i onClick={this.toggleEditThumbnail} title={this.state.article.thumbnail} className="fas fa-image"></i>;

			}

		}
	
		return (

			<div className="reader">
			<div onClick={this.scrollToComments} className="small-comments-icon"><i className="fas fa-comment"></i></div>
			<iframe className="reader-iframe" src={link}></iframe>
			<div ref={ this.scrollContainer } className="reader-info">
			<div className="reader-header">
			<div className="reader-title">{title}</div>
			<div className="reader-category">{category}</div>
			<div className="reader-thumbnail">{thumbnail}</div>
			<div className="reader-created-at">{created_at}</div>
			<div className="reader-username">{username}</div>
			{remove}
			</div>
			<div className="reader-isPublic">	
			{isPublic}
			</div>
			<i onClick={this.closeReader} className="fas fa-times reader-close"></i>
			<Comments scrollContainer={ this.scrollContainer.current } username={this.props.username} id={this.props.id} url_id={this.state.article.url_id} user={this.state.article.user} />	
			</div>
					
			</div>


			)



	}

}

const Reader = connect(mapStateToProps)(Reader2);

export default Reader;
