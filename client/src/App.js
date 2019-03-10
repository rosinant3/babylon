import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import axios from 'axios';
// components
import Screen from './components/screen';
import { connect } from "react-redux";
import Waiting from './components/waiting';
import Home from './home/home';


const mapStateToProps = state => {

  return {  
    
            email: state.login.email, 
            username: state.login.username, 
            verified: state.login.verified,
	    id: state.login.id
          
          };
};

class App extends Component {

    constructor(props) {
      super(props);
      this.state = {  
        
                      email: this.props.email, 
                      username: this.props.username,
                      verified: this.props.verified,
					  id: this.props.id
                    
                    };

    }

    static getDerivedStateFromProps(nextProps, prevState) {

     if (nextProps.email !== prevState.email) {

        return {
          
                  email: nextProps.email, 
                  username: nextProps.username,
                  verified: nextProps.verified,
				  id: nextProps.id

                };

      };

      return null;

    };

    componentDidMount() {
      
      axios.get('/user/session').then(log => {
       
        this.props.dispatch({ type: 'LOGIN_ACTION', 
                            login: {
                              
                                email: log.data.login.email,
                                username: log.data.login.username, 
                                verified: log.data.login.verified,
				id: log.data.login.id
                              
                              }});

       });

    };

  render() {
    return (
    <Route  path="/" render={(props) => {

      if (  this.state.email === "initial" &&
            this.state.username === "initial" &&
            this.state.verified === "initial"  )   {

              return <p></p>

      }

      if (this.state.email === false && this.state.username === false) {

          return (<Screen {...props}/>);

      }

      if (this.state.email && this.state.verified === "1") {

        return (<Waiting username={this.state.username} {...props} />); 

      }

      if (this.state.email && this.state.username && this.state.verified === '0') {

        return <Home id={this.state.id} email={this.state.email} username={this.state.username} {...props}/>

      }


    }
    } />
    );
  };
};


const App2 = connect(mapStateToProps)(App);

export default App2;
