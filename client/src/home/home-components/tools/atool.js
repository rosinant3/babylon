import React, { Component } from 'react';
import './atool.css';
import axios from 'axios';
import { connect } from "react-redux";

const mapStateToProps = state => {

    return {  };

};

class Atool2 extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

            working: true,
	    iframeReference: "https://harpers.org/archive/1998/08/torch-song-2/",
	    titleError: false,
	    linkError: false,
	    thumbnailValidation: false,
	    categoryError: false

        }

	this.sendForm = this.sendForm.bind(this);
	this.updateLink = this.updateLink.bind(this);
	
	this.titleValidation = this.titleValidation.bind(this);
	this.categoryValidation = this.categoryValidation.bind(this);
	this.linkValidation = this.linkValidation.bind(this);
	this.thumbnailValidation = this.thumbnailValidation.bind(this);

    }

	thumbnailValidation(thumbnail) {

		let expression = `(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))`;
		let regex = new RegExp(expression);

		if (thumbnail === "" || thumbnail.length > 5000 || !regex.test(thumbnail)) {

			this.setState({thumbnailError: true});
			return false;
		}

		else {

			this.setState({thumbnailError: false});
			return true;

		}

	}

	linkValidation(link) {

		let expression = `(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})`;
		let regex = new RegExp(expression);

		if (link === "" || link.length > 5000 || !regex.test(link)) {

			this.setState({linkError: true});
			return false;

		}

		else {

			this.setState({linkError: false});
			return true;

		}



	}

	titleValidation(title) {

		if (title === "" || title.length > 255) {

			this.setState({titleError: true});
			return false;

	
		}

		else {

			this.setState({titleError: false});
			return true;

		}


	}

	categoryValidation(category) {

		if (category === "" || category.length > 255) {

			this.setState({categoryError: true});
			return false;

	
		}

		else {

			this.setState({categoryError: false});
			return true;

		}


	}


	sendForm(e) {

		e.preventDefault();
		let titleClear = e.target.title;
		let categoryClear = e.target.category;
		let thumbnailClear = e.target.thumbnail;
		let linkClear = e.target.link;
		let title = e.target.title.value.trim();
		let category = e.target.category.value.trim();
		let link = e.target.link.value.trim();
		let thumbnail = e.target.thumbnail.value.trim();
		let isPublic = e.target.public2;
	
		if (this.thumbnailValidation(thumbnail) && this.titleValidation(title) && this.categoryValidation(category) && this.linkValidation(link)) {

			let body = {isPublic: isPublic.checked, reason: "article", thumbnail: thumbnail, title: title, link: link, user: this.props.id, category: category};
		
			axios.post("/article/add", body).then((res) => {

				if (res.data.titleError) {

					this.setState({titleError: true});

				}


				else if (res.data.linkError) {

					this.setState({linkError: true});

				}

				else if (res.data.categoryError) {

					this.setState({categoryError: true});

				}

				else if (res.data.thumbnailError) {

					this.setState({thumbnailError: true});

				}

				else {

				
					this.setState({iframeReference: "https://harpers.org/archive/1998/08/torch-song-2/"});
					titleClear.value = "";
					categoryClear.value = "";
					linkClear.value = "";
					thumbnailClear.value = "";
					this.props.dispatch({ type: "ARTICLE_ADDED", newadded: true});


				}

			}).catch((e) => { console.log(e) });

		}

	}

	updateLink(e) {

		e.preventDefault();

		let link = e.target.value.trim();
		let expression = `(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})`;
		let regex = new RegExp(expression);

		if (link === "" || link.length > 5000 || !regex.test(link)) {


			this.setState({linkError: true});

		}

		else {

			this.setState({ iframeReference: link, linkError: false });

		}


	}

    render() {

		let linkError;
		let titleError;
		let categoryError;
		let thumbnailError;

		if (this.state.linkError) {

			linkError = {color: "red"};

		}

		if (this.state.titleError) {

			titleError = {color: "red"};

		}

		if (this.state.categoryError) {

			categoryError = {color: "red"};

		}

		if (this.state.thumbnailError) {

			thumbnailError = {color: "red"};

		}


    return (<section className="article-tool">
	    <div>

		<form onSubmit={this.sendForm} className="article-add-form">

		<input style={titleError} name="title" className="article-add-form-text" type="text" placeholder="Title" />
		<input style={categoryError} name="category" className="article-add-form-text" type="text" placeholder="Category" />
		<input style={thumbnailError} name="thumbnail" className="article-add-form-text" type="text" placeholder="Thumbnail" />
		<input style={linkError} onBlur={this.updateLink} name="link" className="article-add-form-text" type="text" placeholder="Link" />
		<div className="article-public" >
		<input type="checkbox" name="public2"/>
		<label>Public</label>
		</div>
		<input className="article-add-form-button" type="submit" value="Send" />

		</form>
		
	    </div>
		 <div className="iframe-container"><iframe src={this.state.iframeReference}></iframe></div>
            </section>);
    }

};

const Atool = connect(mapStateToProps)(Atool2);

export default Atool;
