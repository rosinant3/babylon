import React from 'react';
import './home-css/navigation.css';
import { Link } from 'react-router-dom';

function Navigation(props) {

        let home = <Link to={`${props.path}`} className="logo">Babylon</Link>;
        let playlists = <Link to={`${props.path}playlists`}>Playlists</Link>;
        let articles = <Link to={`${props.path}articles`}>Articles</Link>;

        if (props.location === '/playlists') {

            playlists = <Link className="active" to={`${props.path}playlists`}>Playlists</Link>;
            home = <Link to={`${props.path}`} className="logo logo-inactive">Babylon</Link>;

        }

        if (props.location === '/articles') {

            articles = <Link className="active" to={`${props.path}articles`}>Articles</Link>;
	    home = <Link to={`${props.path}`} className="logo logo-inactive">Babylon</Link>;

        }

        return (<header className="header2">
            {home}
            <nav className="navigation">
            {playlists}
            {articles}
            </nav>
            </header>);

    }

export default Navigation;
