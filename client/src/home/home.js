import React, { Component } from 'react';
//import axios from 'axios';
import { Switch, Route } from 'react-router-dom';
import Navigation from './home-components/navigation';
import Tools from './home-components/tools';
import UserPlaylists from './home-components/playlists/user_playlists';
import UserArticles from './home-components/articles/user-articles';

class Home extends Component {

  constructor(props) {

    super(props);
    this.state = {

      loading: false,

    }

  }

  render() {

        const { match, location } = this.props;

        return (<div className="babylon-container">
          <Navigation location={this.props.history.location.pathname} path={match.path}/>
          <div className="navigation-standin"></div>
          <Switch>
          <Route exact path={`${match.path}`} render={(props) => {

              return <Tools location={location} history={this.props.history} id={this.props.id} username={this.props.username}  />;

          }}/>
		  <Route exact path={`${match.path}playlists`} render={(props) => {

              return <UserPlaylists location={location} history={this.props.history} scope="user" id={this.props.id} username={this.props.username}  />;

          }}/>
	   <Route exact path={`${match.path}articles`} render={(props) => {

              return <UserArticles location={location} history={this.props.history} scope="user" id={this.props.id} username={this.props.username}  />;

          }}/>
          </Switch>  
              </div>)
          
  }

}

export default Home;
