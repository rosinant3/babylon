import React, { Component } from 'react';
import axios from 'axios';
import login from '../redux/actionTypes';
import { connect } from "react-redux";


class SingUp extends Component {

  constructor(props) {
		super(props);
		this.state = {
  
      password: '',
      characters: '',
      email: '',
      visibleEmail: false,
      visiblePassword: false,
      visibleUsername: false, 
      visible: false,
      exists: '',

    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.passwordValidation = this.passwordValidation.bind(this);
    this.userValidation = this.userValidation.bind(this);
    this.emailValidation = this.emailValidation.bind(this);

  }

	handleSubmit(event) {
    event.preventDefault();
    let usernameInfo = {

      target: {value: event.target.elements.username.value}

    }

    let emailInfo = {

      target: {value: event.target.elements.email.value}

    }

    let passwordInfo = {

      target: {value: event.target.elements.password.value}

    }
    //request to server to add a new username/password
    let username = usernameInfo;
    let email = emailInfo;
    let password = passwordInfo;

    let valusername = this.userValidation(username);
    let valemail = this.emailValidation(email);
    let valpassword = this.passwordValidation(password);

   if (valusername && valemail && valpassword) {

    this.setState({visible: false,});

    // POST REQUEST

    axios.post('/user/join', {

      username: username.target.value,
      email: email.target.value,
      password: password.target.value

    })
    .then(response => {

      if (response.data.valemail === true) {

        this.setState({email:'', visibleEmail: false, visible: false});

      }

      if (response.data.valpassword === true) {

        this.setState({password:'', visiblePassword: false, visible: false});
        
      }

      if (response.data.valusername === true) {

        this.setState({characters: '', visibleUsername: false, visible: false});
        
      }

      if (response.data.valemail !== true) {

        this.setState(response.data.valemail);

      }

      if (response.data.valpassword !== true) {

        this.setState(response.data.valpassword);
        
      }

      if (response.data.valusername !== true) {

        this.setState(response.data.valusername);
        
      }

      if (response.data) {
        
        this.setState({exists: response.data.exists, visible: response.data.visible});

      }

      if (response.data === "USER_CREATED") {

        this.setState({visible: false});
        axios.post('/user/login', {

          email: email.target.value,
          password: password.target.value

        }).then((log) => {
   
          this.props.dispatch({ type: 'LOGIN_ACTION', 
          login: {
            
                  email: log.data.login.email,
                  username: log.data.login.username, 
                  verified: log.data.login.verified,
				  id: log.data.login.id
                
                }});
       
      }).catch(error => {

        console.log('Singup-Login error: ');
        console.log(error);

      })


      }


    })
    .catch(error => {

      console.log('Singup error:');
      console.log(error);
      
    })

  }

}
  
passwordValidation(password2) {

    let password = password2.target.value.trim();

    let rules = {

      oneNumberEx: /\d{1}/, // at least one number
      oneLowerCase: /[a-z]{1}/, // at least one lowercase
      oneUpperCase: /[A-Z]{1}/, // at least one uppercase
      character: 6,

    }

    if (password === "") {

      this.setState({password: `Password can't be 
      blank.`, visiblePassword: true, visible: true});
      return false;

    }

    if (rules.oneNumberEx.test(password) === false) {

      this.setState({password:`Password must 
      have at least one number.`, visiblePassword: true, visible: true});
      return false;

    }

    if (rules.oneLowerCase.test(password) === false) {
      
      this.setState({password:`Password must have at least 
      one lowercase character.`, visiblePassword: true, visible: true});
      return false;

    }

    if (rules.oneUpperCase.test(password) === false) {
     
      this.setState({password:`Password must have 
      at least one uppercase character.`, visiblePassword: true, visible: true});
      return false;

    }


    if (password.length - 1 < rules.characters) {

      this.setState({characters: `Password can't have
       less than ${rules.characters} characters.`, visiblePassword: true, visible: true});
      return false;
   
    }

    else {

      this.setState({password: "", visiblePassword: false, visible: false});
      return true;
  
    }

}

  emailValidation(email2) {

    let email = email2.target.value.trim();

    let emailRegEx = /^([^\s-])+([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

    if (email === "") {
      
      this.setState({email: `E-mail can't be blank.`, visibleEmail: true, visible: true});
      return false;

    }

    if (email.length > 244) {
      
      this.setState({email: `E-mail too long.`, visibleEmail: true, visible: true});
      return false;
  
    }
    
  
    if (emailRegEx.test(email) === false) {
      emailRegEx.test(email)
      this.setState({email: `Invalid E-mail.`, visibleEmail: true, visible: true});
      return false;

    }

  else {

    this.setState({email: "", visibleEmail: false, visible: false})
    return true;

  }

}

    userValidation(username2) {

      let username = username2.target.value.trim();

      let userRules = {

        characters: 15,

      }

      if (username === "") {

        this.setState({characters: `Username can't be blank.`, visibleUsername: true, visible: true});
        return false;

      }

      if (username.length - 1 > userRules.characters) {

        this.setState({characters: `Username character limit 
        is ${userRules.characters}.`,  visibleUsername: true, visible: true});
        return false;
     
      }

      else {

        this.setState({characters: "",  visibleUsername: false, visible: false});
        return true;

      }
}
    
  render() {
    return (
      <div  className="CreateUser">
      <div>
    <form 
    onSubmit={this.handleSubmit}>
    <label>
        <input 
              onBlur={this.userValidation}
              className={this.state.visibleUsername?'emailerror':' '} type="text"
							name="username"
							placeholder="Username"
							/>
        <input 
              onBlur={this.emailValidation}
              className={this.state.visibleEmail?'emailerror':' '} type="text"
							name="email"
							placeholder="E-mail"
							/>
        <input 
              onBlur={this.passwordValidation}
              className={this.state.visiblePassword?'emailerror':' '}
							placeholder="Password"
							type="password"
							name="password"
							/>
          <input 
            className="singupb"
            type="submit" 
            value="Join"/>
     </label>
    </form>
    </div>
    <div className={this.state.visible?'fadeIn errorHandler':'fadeOut errorHandler'} >
        <p>{this.state.characters}</p>
        <p>{this.state.email}</p>
        <p>{this.state.password}</p>
        <p className={this.state.visible?'fadeIn':'fadeOut'}>
        {this.state.exists}</p>
    </div>
    <div>
       
    </div>
</div>
    );
  }
}
const SingUp2 = connect(login)(SingUp);

export default SingUp2;
