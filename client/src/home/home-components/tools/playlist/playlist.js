import React, { Component } from 'react';
import '../ptool.css';
import { connect } from "react-redux";
import PlaylistItem from "./playlist-item";
import axios from 'axios';

const mapStateToProps = state => {

    return {

              playlistVideos: state.playlistVideos

            };

};
 
class Playlist2 extends Component {

    constructor(props) {

        super(props);
        this.state = {

            working: true,
            error: false,
            playlistVideos: {length: 0, videos: []},
	    characters: 0

        };

        this.sendPlaylist = this.sendPlaylist.bind(this);
        this.validationTitle = this.validationTitle.bind(this);
	this.validationDescription = this.validationDescription.bind(this);
	this.checkTitle = this.checkTitle.bind(this);
	this.checkDescription = this.checkDescription.bind(this);
	this.countCharacters = this.countCharacters.bind(this);

    }
	
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.playlistVideos.length !== prevState.playlistVideos.length) {

            return {

                playlistVideos: {

                    length: nextProps.playlistVideos.length,
                    videos: nextProps.playlistVideos.videos

                }

            }

        }

        else {

            return null;

        }

    }

    sendPlaylist(e) {

		e.preventDefault();

        	let title = e.target.title;
		let public2 = e.target.public2;
        	let description = e.target.description;
		let category = e.target.category;
		let user_id = this.props.id;
		let videos = [];

        if (this.validationTitle(category.value.trim())  && this.validationTitle(title.value.trim()) && this.validationDescription(description.value.trim()) && this.state.playlistVideos.length > 0 ) {

            this.setState({

                error: false

            });
			
			this.state.playlistVideos.videos.forEach((video, index) => {
				
					let snippet = {};
					snippet.duration = video.duration;
					snippet.title = video.info.snippet.title;
					snippet.published =  video.info.snippet.publishedAt;
					snippet.order = index + 1;
					snippet.thumbnails = video.info.snippet.thumbnails;

					if (video.info.contentDetails) {
						
						snippet.videoId = video.info.contentDetails.videoId;
						
					}
					
					else {
						
							snippet.videoId = video.info.id.videoId;
						
						
					}

				videos.push(snippet);
				
				
			});

	

            axios.post('/playlist/postplaylist', {

                		title: title.value.trim(),
				description: description.value.trim(),
				videos: videos,
				user_id: user_id,
				public2: public2.checked,
				category: category.value.trim()

            })
            .then(log => {

               if (log.data.ok) {

                title.value = '';
                description.value = '';
		category.value = '';

                this.props.dispatch({

                    type: 'CLEAR_VIDEO',
		    newadded: true

                })

                this.setState({

                    error: false,
		    characters: 0

                });

               }
			   
			   else {
				   
				    this.setState({

						error: true

					})

				   
			   }

            }).catch(error => {



            });

        }

        else {

            this.setState({

                error: true

            })

        }

    }

    validationTitle(username) {

        let userRules = {

          characters: 255,

        }

        if (username === "" || username.length === 0 || username.length - 1 > userRules.characters || isNaN(username[0]) === false) {

          return false;

        }

        else {

          return true;

        }
    }
	
	    validationDescription(username) {

        let userRules = {

          characters: 5000,

        }

        if (username === "" || username.length === 0 || username.length - 1 > userRules.characters || isNaN(username[0]) === false) {

          return false;

        }

        else {

          return true;

        }
    }
	
	checkTitle(e) {
		
		if (this.validationTitle(e.target.value)) {
			
			 this.setState({

                error: false

            });
			
		}
		
		else {
			
			 this.setState({

                error: true

            });
			
		}
		
	}
	
	checkDescription(e) {
		
		if (this.validationDescription(e.target.value)) {
			
			 this.setState({

                error: false

            });
			
		}
		
		else {
			
			 this.setState({

                error: true

            });
			
		}
		
	}


	countCharacters(e) {


		this.setState({characters: e.target.value.length});

	}


    render() {

        let errorStyle;

        if (this.state.error) {

            errorStyle = {color: "red"};
		

        }

        return (<div className="real-playlist">
                <span  style={errorStyle} >Playlist</span>
                <form className="playlist-form" onSubmit={this.sendPlaylist}>
                    <input onBlur={this.checkTitle} type="text" name="title" placeholder="Playlist Title" />
		    <input onBlur={this.checkTitle} type="text" name="category" placeholder="Category" />
                    <textarea onKeyUp={this.countCharacters} onBlur={this.checkDescription} name="description" placeholder="Short description..." ></textarea>
			<div style={{textAlign: "center", padding: "0.5rem"}}>{this.state.characters}/5000</div>
					<div className="radio">
					<input type="checkbox" name="public2"/>
					<label>Public</label>
					</div>
                    <input style={{cursor: 'pointer', fontWeight: "bold", backgroundColor: "purple", color: "white"}}type="submit" value="Send" />
			
                </form>
		
                <span className="ply-items">Items</span>
                {this.state.playlistVideos.videos.map((data, index) => {

                       let key = data.info.id.videoId;

			if (data.info.contentDetails) {

				key = data.info.contentDetails.videoId;

			}

                    return <PlaylistItem key={key} index={index} data={data} />;

                    })}

                </div>)

    }

};

const Playlist = connect(mapStateToProps)(Playlist2);

export default Playlist;
