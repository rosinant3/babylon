import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import login from '../redux/actionTypes';
import { connect } from "react-redux";

class Login extends Component {

  constructor(props) {
    
      super(props)
      this.state = {
        
        characters: '',
        firstchars: '',
        visible: false,
        visible2: false,
        redirectTo: null,
        loggedIn: false
        
      };

      this.handleSubmit = this.handleSubmit.bind(this);
      this.emailValidation = this.emailValidation.bind(this);
      this.passwordValidation = this.passwordValidation.bind(this);

  }

  handleSubmit(event) {

    event.preventDefault();

    let email = event.target.elements.email.value.trim();
    let password = event.target.elements.password.value.trim();
    let checkpass = this.passwordValidation(password);
    let checkemail = this.emailValidation(email);

    if(checkemail === true && checkpass === true) {

        this.setState({visible: false,});
        // POST REQUEST
        axios.post('/user/login', {

            email: email,
            password: password

        })
        .then(log => {

            if (log.status === 200) {
     
               this.props.dispatch({ type: 'LOGIN_ACTION',
                login: {
                  
                        email: log.data.login.email,
                        username: log.data.login.username,
                        verified: log.data.login.verified,
						id: log.data.login.id
                        
                        }});
            }
            
            else {

              

            }

        }).catch(error => {

          this.setState({visible: true});
          this.setState({visible2: true,});
          console.log(error);
            
        })
    }

}

  emailValidation(email) {

    let emailRegEx = /^([^\s-])+([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;
  
    if (emailRegEx.test(email) === false) {

      this.setState({visible: true});
      return false;

  }

  if (email.length > 244) {
    
    this.setState({visible: true});
    return false;

  }

    else {

    this.setState({visible: false});
    return true;

    }

  }

  passwordValidation(password) {

    if (password.length === 0 || password === "") {

      this.setState({visible2: true,});
      return false;

    }

    else {

      this.setState({visible2: false});
      return true;
  
    }

  }
  
  render() {
     if (this.state.redirectTo) {
        return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else { 
      return  <div className="Login">
      <form  onSubmit={this.handleSubmit}>
      <label>
      <input 
        className={this.state.visible?'emailerror':' '}
        type="text"
        name="email"
        placeholder="E-mail"
        />
      <input 
        className={this.state.visible2?'emailerror':' '} 
        placeholder="Password"
        type="password"
        name="password"
        />
      </label>
      <input 
        type="submit" 
        value="Login" 
        />
    </form>
    </div>
      
    }
  
  }

}

const Login2 = connect(login)(Login);

export default Login2;
