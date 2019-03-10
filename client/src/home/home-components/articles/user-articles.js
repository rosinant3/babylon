import React, { Component } from 'react';
import './articles.css';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'underscore';
import queryString from 'query-string';

import Article from './article';

import Reader from './reader';

const mapStateToProps = state => {

    return { 

		newadded: state.article.newadded,
		userArticles: state.userArticles,
		reader: state.reader

	   };

};

class UserArticles2 extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

		search: "title",
		searchStatus: false,
	            

        }


	this.getUserArticles = this.getUserArticles.bind(this);

	this.searchTitle = this.searchTitle.bind(this);
	this.searchCategory = this.searchCategory.bind(this);
	this.sendForm = this.sendForm.bind(this);

	this.isElementInViewPort = this.isElementInViewPort.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
	this.messiah = this.messiah.bind(this);
	this.moreArticles = _.throttle(this.messiah, 250);
	this.scrollRef = React.createRef();


    }

	messiah() {
		
		 let target = this.scrollRef.current;
		 let realThis = this;
		 let reason = "all";

		 if (target) {

		if (this.props.userArticles.reason === "title") {

			reason = "title";

		}

		if (this.props.userArticles.reason === "category") {

			reason = "category";

		}

		this.onVisibilityChange(target, () => {

			window.removeEventListener("scroll", this.moreArticles);
		
			this.setState({waiting: true});
		
			this.getUserArticles(this.props.userArticles.search, reason, false, false, true);

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

	sendForm(event) {

		event.preventDefault();
		let input = event.target.sInput.value.trim();
		let reason = "all";

		if (this.props.userArticles.reason === "title" || this.state.search === "title") {

			reason = "title";

		}

		if (this.props.userArticles.reason === "category" || this.state.search === "category") {

			reason = "category";

		}

		
		this.getUserArticles(input, reason, 1, true);	


	}

	searchTitle() {

		this.setState({ search: "title", searchStatus: true });
	
	}

	searchCategory() {

		this.setState({ search: "category", searchStatus: true });
	
	}

	componentWillUnmount() {

		window.removeEventListener("scroll", this.moreArticles);


	}
	

	getUserArticles(search, reason, page, fresh = false, moreResults) {

		let currentPage = page || this.props.userArticles.nextPage;

		if (this.props.newadded) {

			currentPage = 1;

		}

		let body = {};
		body.user = this.props.id;
		body.reason = reason;
		body.per_page = 16;
		body.current_page = currentPage;
		body.search = search;
		body.scope = "user";

		if (search !== this.props.userArticles.search || moreResults || this.props.newadded) {

		axios.post('/article/get', body)
		.then((res) => {

			let onepage;
			let nextPage = res.data.page.current_page;
			let lastPage = res.data.page.last_page;
			
			this.setState({waiting: false});
			if ( res.data.page.last_page === 0 ) {

				lastPage = 1;

			}

			if ( nextPage === lastPage ) {

				onepage = true;
				this.props.dispatch({ fresh: fresh, newadded: false, reason: reason, type: "FETCHED_ARTICLES", onepage: onepage, nextPage: nextPage, total: res.data.page.total, articles: res.data.data, search: search});


			}

			if ( nextPage !== lastPage ) {

				
				onepage = false;
				nextPage++;

				window.addEventListener("scroll", this.moreArticles);

				this.props.dispatch({ fresh: fresh, newadded: false, reason: reason, type: "FETCHED_ARTICLES", onepage: onepage, nextPage: nextPage, total: res.data.page.total, articles: res.data.data, search: search});

			}
	


		})
		.catch((e) => { console.log(e) });
	
}

	}


	componentDidMount() {

		const values = queryString.parse(this.props.location.search);
		document.title = "Babylon | Articles";

		if (values.read) {

			this.props.dispatch({type: 'READ', status: true, url_id: values.read, location: "inherit"});

		}

		if ( this.props.newadded || this.props.userArticles.len === 0 ) {

			this.getUserArticles(false, "all");			

		}

		if ( !this.props.userArticles.onepage) {

			window.addEventListener("scroll", this.moreArticles);

		}

	}
	

    render() {

		let activeT = { cursor: "pointer" };
		let activeC = { cursor: "pointer" };
		let placeholder;
		let waiting;
		let moreResults;
		let content;

		if (this.props.userArticles.reason === "title" || this.state.search === "title") {

			activeT = { color: "black", cursor: "pointer" };
			activeC = { cursor: "pointer" };
			placeholder = "Search Title";

		}

		if (this.props.userArticles.reason === "category" || this.state.search === "category") {

			activeC = { color: "black", cursor: "pointer" };
			activeT = { cursor: "pointer" };
			placeholder = "Search Category";

		}

		if (this.state.waiting) {


			waiting = <div className="center"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;


		}

		if (!this.props.userArticles.onepage)  {

			moreResults = <div ref={this.scrollRef} className="user-articles-more-results" >{waiting}</div>;


		}

		if (this.props.reader.status) {

			content = <Reader location={this.props.location} history={this.props.history} username={this.props.username} id={this.props.id} url_id={this.props.reader.url_id}/>;


		}

		if (!this.props.reader.status) {

			content = <React.Fragment><div className="article-container">
		<div className="form-container">
		<form onSubmit={this.sendForm} className="article-search-form">
		<div className="article-search-form-text">
		<div>{this.props.username}</div>
		<div>{this.props.userArticles.total}</div>
		<div onClick={this.searchTitle} style={activeT} >T</div>
		<div onClick={this.searchCategory} style={activeC} >C</div>
		</div>
		<div className="article-input-submit">
		<input name="sInput" type="text" placeholder={placeholder} />
		<button type="submit"><i onClick={this.search} className="fas fa-search"></i></button>
		</div>
		</form>
		</div>
                {this.props.userArticles.articles.map((article, index) => {

			return <Article location="user" history={this.props.history} key={article.url_id} article={article} user={this.props.id} />	;


		})}
		</div>
		{moreResults}</React.Fragment>;


		}


        return (<div>
		{content}
                </div>);
            
    };
  
};

const UserArticles = connect(mapStateToProps)(UserArticles2);

export default UserArticles;
