import React, { Component } from 'react';
import './articles.css';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'underscore';
import queryString from 'query-string';

import Reader from './reader';

const mapStateToProps = state => {

    return { 

		newadded: state.article.newadded,
		userArticles: state.userArticles,
		reader: state.reader

	   };

};

class Article2 extends Component {

	constructor(props) {

		super(props);
		this.state = {

			loaded: false,
			waiting: false

		}

		this.showArticle = this.showArticle.bind(this);
		this.read = this.read.bind(this);


	}

	showArticle() {

		this.setState({ loaded: true });

	}

	read() {

		this.props.history.push(`/articles?read=${this.props.article.url_id}`);
		this.props.dispatch({type: 'READ', status: true, url_id: this.props.article.url_id, location: this.props.location});

	}


	render() {

		let title = this.props.article.title;
		let category = this.props.article.category;
		let opacity;
		let updatedAt = moment(this.props.article.updated_at).format("MMM Do YY");
		let createdAt = moment(this.props.article.created_at).format("MMM Do YY");
		let username = this.props.article.username;

		if (this.props.article.title.length > 50) {

			title = `${this.props.article.title.slice(0, 50)}...`;

		}

		if (this.props.article.category.length > 25) {

			category = `${this.props.article.category.slice(0, 25)}...`;

		}

		if (this.state.loaded) {

			opacity = { animation: "slideIn 1s forwards" }

		}

		return (

			<div style={opacity} className="article-component">
			<div className="article-component-backgroud"  style={{ backgroundImage: `url("${this.props.article.thumbnail}")` }} />
			<img onError={(e)=>{ if (e.target.src !== "/article.jpeg"){
                    e.target.onerror = null;
                     e.target.src="/article.jpeg";}
                }
           } alt={this.props.article.title} onLoad={this.showArticle} src={this.props.article.thumbnail} />
			<div className="article-created_at" title={updatedAt}>{createdAt}</div>
			<div className="article-username" title={username}>{username}</div>
			<div onClick={this.read} title="Read" className="article-title-category-container">
			<div title={this.props.article.title} className="article-title">{title}</div>
			<div title={this.props.article.category} className="article-category">{category}</div>
			</div>
			</div>


			)



	}

}

const Article = connect(mapStateToProps)(Article2);

export default Article;
