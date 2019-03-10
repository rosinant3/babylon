import React, { Component } from 'react';
import './ptool.css';
import Search from './search/search';
import Playlist from './playlist/playlist';

class Ptool extends Component {

    constructor(props) {

        super(props);
        this.state = {

            working: true,

        }

    }

    render() {
		
        return (<div className="playlist-complete">
                <Playlist id={this.props.id} username={this.props.username}/>
                <Search />
                </div>)

    }


};

export default Ptool;
