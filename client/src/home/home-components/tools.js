import React, { Component } from 'react';
import './home-css/tools.css';
import Ptool from './tools/ptool';
import Atool from './tools/atool';
import UserPlaylistsPublic from './playlists/user_playlists_public';

class Tools extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

            playlist: false,
            article: false

        }

        this.makePlaylist = this.makePlaylist.bind(this);
        this.makeArticle = this.makeArticle.bind(this);
	this.clear = this.clear.bind(this);

    }
	
	clear() {
		
		this.setState({

                    playlist: false,
                    article: false

                });

		
		
	};
  
    makePlaylist() {

                this.setState({

                    playlist: true,
                    article: false

                });

        
    };

    makeArticle() {

                this.setState({

                    playlist: false,
                    article: true

                });


    };

    render() {

       let tool; 
       let playlistOpacity;
       let articleOpacity;

       if (this.state.playlist === true) {

            tool = <Ptool id={this.props.id} username={this.props.username}/>;
            playlistOpacity = 0.7;
            articleOpacity = '';

       }

       if (this.state.article === true) {

            tool = <Atool id={this.props.id} username={this.props.username} compiler="TypeScript" framework="React" />;
            playlistOpacity = '';
            articleOpacity = 0.7;

       }

       if (this.state.playlist === false && this.state.article === false) {

            tool = <UserPlaylistsPublic location={this.props.location} history={this.props.history} username={this.props.username} id={this.props.id} />;
            playlistOpacity = '';
            articleOpacity = '';

       }

        return (<section className="tools">
                <div className="controllers">
                <p onClick={this.makePlaylist} style={{opacity: playlistOpacity}}>Add Playlist</p>
                <span style={{   cursor: "pointer"     }} onClick={this.clear}><i className="fas fa-home"></i></span>
                <p onClick={this.makeArticle} style={{opacity: articleOpacity}}>Add Article</p>
                </div>
                <div className="tools-container">
                {tool}
                </div>
                </section>);
            
    };
  
};

export default Tools;
