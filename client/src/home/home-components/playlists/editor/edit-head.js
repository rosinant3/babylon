import React, { Component } from 'react';
import axios from 'axios';
import './editor.css';
import { connect } from "react-redux";


const mapStateToProps = state => {

    return {

              editor: state.editorVideos,

            };

};

class EditorHead2 extends Component {
	
	constructor(props) {
		
		super(props);
		this.state = {
			
			editTitle: false,
			editCategory: false,
			editDescription: false,
			title: "",
			category: "",
			description: "",
			public: "",
		
		};
		
		this.editTitle = this.editTitle.bind(this);
		this.dontEditTitle = this.dontEditTitle.bind(this);
		this.titleInput = React.createRef();
		this.handleKeyPress = this.handleKeyPress.bind(this);
		

	};


	editTitle(e) {

	let user = this.props.id;
	let playlistId = this.props.url_id;
		
		if (e.target.id === "title") {
			
			this.setState({editTitle: true});
		window.setTimeout(() => {
			
			this.titleInput.current.focus();
			
		}, 1);
			
		}
		
		if (e.target.id === "category") {
			
			this.setState({editCategory: true});
		window.setTimeout(() => {
			
			this.titleInput.current.focus();
			
		}, 1);
			
		}
		
		if (e.target.id === "description") {
			
			this.setState({editDescription: true});
		window.setTimeout(() => {
			
			this.titleInput.current.focus();
			
		}, 1);
			
		}

		if (e.target.name === "isPublic") {
			
			
			if (this.state.public === "1") {
				
				axios.post('/playlist/editplaylist', {

					reason: "isPublic",
      					publicStatus: false,
      					user: user,
      					playlistId: playlistId

    				}).then((data) => {

						this.props.dispatch({type: 'UPDATE_PLAYLISTS_RESULT', public: true, index: playlistId, newValue: "0"});		
				this.setState({public: "0"});				

					}).catch((e) => {console.log(e)});;
				


			}

			if (this.state.public === "0") {
				
				
				axios.post('/playlist/editplaylist', {

					reason: "isPublic",
      					publicStatus: true,
      					user: user,
      					playlistId: playlistId

    				}).then((data) => {

				this.props.dispatch({type: 'UPDATE_PLAYLISTS_RESULT', public: true, index: playlistId, newValue: "1"});				
				this.setState({public: "1"});				

					}).catch((e) => {console.log(e)});;
				


			}
		

		}
		
		
		
		
	};
	
	handleKeyPress (e) {

	let value = e.target.value.trim();
	let user = this.props.id;
	let playlistId = this.props.url_id;
		
	if (e.target.name === "title" && value.length > 0 && value.length < 50) {
		
		 if (e.key === 'Enter') {
		
		if (value === this.state.title) {

				this.setState({editTitle: false, title: value, index: this.props.index});

			}

			else {

				 axios.post('/playlist/editplaylist', {
				
					reason: "title",
      					item: value,
      					user: user,
      					playlistId: playlistId

    				}).then((data) => {

					
				     this.setState({editTitle: false, title: value});
				     this.props.dispatch({type: 'UPDATE_PLAYLISTS_RESULT', title: value, index: playlistId});					

				}).catch((e) => {console.log(e)});;

			}
	  
	  
		}
		
		
	}
	
	if (e.target.name === "category" && value.length > 0 && value.length < 50) {
		
		 if (e.key === 'Enter') {
		
		if (value === this.state.category) {

				this.setState({editCategory: false, category: value});

			}

			else {

				 axios.post('/playlist/editplaylist', {

					reason: "category",
      					item: value,
      					user: user,
      					playlistId: playlistId

    				}).then((data) => {

					
				this.setState({editCategory: false, category: value});	
			this.props.dispatch({type: 'UPDATE_PLAYLISTS_RESULT', category: value, index: playlistId});				

					}).catch((e) => {console.log(e)});;

			}
	  
		}

	}
	
	if (e.target.name === "description" && value.length > 0 && value.length < 5000) {
		
		 if (e.key === 'Enter') {
		
		if (value === this.state.description) {

				this.setState({editDescription: false, description: value, index: this.props.index});

			}

			else {

				axios.post('/playlist/editplaylist', {

					reason: "description",
      					item: value,
      					user: user,
      					playlistId: playlistId

    				}).then((data) => {

					
				this.setState({editDescription: false, description: value});
				this.props.dispatch({type: 'UPDATE_PLAYLISTS_RESULT', description: value, index: playlistId});					

					}).catch((e) => {console.log(e)});;

			}
	  
		}

	}
	
	}
	
	dontEditTitle(e) {

	let user = this.props.id;
	let playlistId = this.props.url_id;
	let value = e.target.value.trim();

		if (e.target.name === "title" && value.length > 0 && value.length < 100) {
		
			
			if (value === this.state.title) {

				this.setState({editTitle: false, title: value});

			}

			else {

				 axios.post('/playlist/editplaylist', {

					reason: "title",
      					item: value,
      					user: user,
      					playlistId: playlistId

    				}).then((data) => {

					
				this.setState({editTitle: false, title: value});					
				this.props.dispatch({index: playlistId, type: 'UPDATE_PLAYLISTS_RESULT', title: value});					

					}).catch((e) => {console.log(e)});;

			}
	  

		}
	
		if (e.target.name === "category" && value.length > 0 && value.length < 100) {
		
			if (value === this.state.category) {

				this.setState({editCategory: false, category: value});

			}

			else {

				 axios.post('/playlist/editplaylist', {

					reason: "category",
      					item: value,
      					user: user,
      					playlistId: playlistId

    				}).then((data) => {

					
				this.setState({editCategory: false, category: value});					
				this.props.dispatch({index: playlistId, type: 'UPDATE_PLAYLISTS_RESULT', category: value});

					}).catch((e) => {console.log(e)});;

			}
			
	  
		}
		
		if (e.target.name === "description" && value.length > 0 && value.length < 5000) {
		
			if (value === this.state.description) {

				this.setState({editDescription: false, description: value});

			}

			else {

				axios.post('/playlist/editplaylist', {

					reason: "description",
      					item: value,
      					user: user,
      					playlistId: playlistId

    				}).then((data) => {

					
				this.setState({editDescription: false, description: value});					
				this.props.dispatch({index: playlistId, type: 'UPDATE_PLAYLISTS_RESULT', description: value});

					}).catch((e) => {console.log(e)});;

			}
			
	  
		}
		
		
		
	};

		componentDidMount() {

		axios.post("/playlist/editplaylist", {

			playlistId: this.props.url_id,
			reason: "getInfo",	
			user: this.props.id



		}).then((res) => {

			this.setState({id: res.data.id, category: res.data.category, title: res.data.title, description: res.data.description, public: res.data.public});

		}).catch((error) => {console.log(error)});

		}

		

	render() {
			
			let title = <span id="title" onClick={this.editTitle} >{this.state.title}</span>;
			let category = <span id="category" onClick={this.editTitle} >{this.state.category}</span>;
			let description = this.state.description;
			let isPublic;
			
			if (this.state.description.length > 100) {
				
				description = `${this.state.description.slice(0, 100)}...`;
				
			}
			
			if (this.state.editTitle) {
				
				title = <input ref={this.titleInput} name="title" onKeyPress={this.handleKeyPress} onBlur={this.dontEditTitle} 						type="text" defaultValue={this.state.title} />
				
			}
			
			if (this.state.editCategory) {
				
				category = <input name="category" ref={this.titleInput} onKeyPress={this.handleKeyPress} 							onBlur={this.dontEditTitle} type="text" defaultValue={this.state.category} />
				
			}
			
			if (this.state.editDescription) {
				
				description = <textarea name="description" ref={this.titleInput} onKeyPress={this.handleKeyPress} 					onBlur={this.dontEditTitle} defaultValue={this.state.description} ></textarea>
				
				
			}
			
			if (!this.state.editDescription) {
				
				description =  <span title={this.state.description} id="description" onClick={this.editTitle} >{description}</span>;
				
			}
			
			
			if (this.state.public === "1") {
				
				
				isPublic = <input type="checkbox" name="isPublic" onChange={this.editTitle} checked={true} />;


			}

			if (this.state.public === "0") {
				
				
				isPublic = <input type="checkbox" name="isPublic" onChange={this.editTitle} checked={false} />


			}

			return (
			
				<React.Fragment>
					<b>Editor</b>
					<span>{title}</span>
					<span>{category}</span>
					<div>{description}</div>
					<div>{isPublic}
					<span>Public</span>
					</div>
				</React.Fragment>
					
			);

	}
	
}
 
const EditorHead = connect(mapStateToProps)(EditorHead2);
 
export default EditorHead;
