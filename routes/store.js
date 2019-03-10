const knex = require('knex')(require('../knexfile'));
// establish connection with the knex file
// then use it to creatue user with knex('user')
// write .debug() at the end for debugging purposes
const crypto = require('crypto');
// password encryption, it's native to node

module.exports = {
  saltHashPassword,
  // EXISTING USERNAME / EMAIL 
  searchUser,
  getUsername,
  getCookie,
    //USER CREATION
  createUser ({ email, username, password }) {

    const { salt, hash } = saltHashPassword({ password });
   
    return knex('user').insert({

      salt,
      encrypted_password: hash,
      username,
      email,
      verified: false,

    }).debug();
  },
  // FORM VALIDATION
  formValidation({email, password, username}) {

    let valemail = emailValidation(email);
    let valpassword = passwordValidation(password);
    let valusername = userValidation(username);

    if (valemail === true && valpassword === true && valusername === true) {

      return true;

    }

    else {

      let response = {valemail, valpassword, valusername};
      return response;

    }

  },
  // PASSWORD AUTHENTICATION
  authenticate ({ email, password }) {

    return knex('user').where({ email })
      .then(([user]) => {
        if (!user) return { success: false }

        const { hash } = saltHashPassword({

          password,
          salt: user.salt

        })

        return { success: hash === user.encrypted_password };

      }).catch((e) => {console.log(e)});
  },
  
  
    validationTitle(username) {

        let userRules = {

          characters: 255,

        }

        if (username.length === 0 || username === "") {

          return false;

        }

        if (username.length - 1 > userRules.characters) {

          return false;

        }

        else if (isNaN(username[0]) === false) {

          return false;

        }

        else {

          return true;

        }
    },
	
	validationDescription(username) {

        let userRules = {

          characters: 5000,

        }

        if (username.length === 0 || username === "") {

          return false;

        }

        if (username.length - 1 > userRules.characters) {

          return false;

        }

        else if (isNaN(username[0]) === false) {

          return false;

        }

        else {

          return true;

        }
    }

  
}

function saltHashPassword ({ password, salt = randomString()}) {

  const hash = crypto
    .createHmac('sha512', salt)
    .update(password)

  return {

    salt,
    hash: hash.digest('hex')

  }

};

function randomString () {

  return crypto.randomBytes(4).toString('hex');

};

function passwordValidation(password) {

  let rules = {

    oneNumberEx: /\d{1}/, // at least one number
    oneLowerCase: /[a-z]{1}/, // at least one lowercase
    oneUpperCase: /[A-Z]{1}/, // at least one uppercase
    character: 6,

  }

  if (password === "") {

    let response = {password: `Password can't
     be blank.`, visiblePassword: true, visible: true};
    return response;

  }

  if (rules.oneNumberEx.test(password) === false) {
    
    let response = {password:`Password must have 
    at least one number.`, visiblePassword: true, visible: true};
    return response;

  }

  if (rules.oneLowerCase.test(password) === false) {

    let response =  {password:`Password must have at least 
    one lowercase character.`, visiblePassword: true, visible: true};
    return response;

  }

  if (rules.oneUpperCase.test(password) === false) {

    let response = {password:`Password must have at least one 
    at least one uppercase character.`, visiblePassword: true, visible: true};
    return response;

  }


  if (password.length - 1 < rules.characters) {
    
    let response =  {characters: `Password can't have less 
    than ${rules.characters} characters.`, visiblePassword: true, visible: true};
    return response;
  }

  else {

    return true;

  }

};

function emailValidation(email) {

  let emailRegEx = /^([^\s-])+([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

  if (email === "") {
    
    let response = {email: `E-mail can't be blank.`, visibleEmail: true, visible: true};
    return response;

  }

  if (email.length > 244) {
    
    let response = {email: `E-mail too long.`, visibleEmail: true, visible: true};
    return response;

  }
  

  if (emailRegEx.test(email) === false) {

    let response = {email:`Invalid E-mail.`, visibleEmail: true, visible: true};
    return response;

  }

  else {

    return true;

  }

};

function userValidation(username) {

  let userRules = {

    characters: 15,

  }

  if (username === "") {

    let response = {characters: `Username can't be blank.`, visibleUsername: true, visible: true};
    return response;
    
  }

  if (username.length - 1 > userRules.characters) {

    let response = {characters: `Username character limit is
    ${userRules.characters}.`,  visibleUsername: true, visible: true};
    return response;

  }

  else {

    return true;

  }


};

async function searchUser({username, email}) {

  let queryUsername = await knex('user').where({

    username: username,


  }).select('username').then((result) => {

        return result;
    
  }).catch((e) => {console.log(e)});;

    let queryEmail = await knex ('user').where({

    email: email

  }).select('email').then((result) => {

    return result;

  }).catch((e) => {console.log(e)});;

            let responseU;
            let responseE;

  for (let j = 0; j < queryUsername.length; j++) {
    
    if (queryUsername[j].username === username) {

      responseU = {exists: `Username already exists.`, visibleUsername: true, visible: true};
      break;

    }

  }

  for (let i = 0; i < queryEmail.length; i++) {
   
    if (queryEmail[i].email === email) {

      responseE = {exists: `Email already exists.`, visibleEmail: true, visible: true};
      break;
  
    }

  }

  if (responseU && responseE) {

    let responseB = {exists: `Email and Username already exist.`, visibleUsername: true, visibleEmail: true, visible: true}
    return responseB;

  }

  if (responseU) {

    return responseU;

  }

  if (responseE) {

    return responseE;

  }

  if (responseU === undefined && responseE === undefined) {
    
    return {status: true};

  }

}

async function getUsername({email}) {

    let getter = await knex('user').where({

      email: email

    }).select('username', 'verified', 'id').then(([result]) => {

      if (result) {
        return { 
          
                  username:result.username, 
                  verified: result.verified,
				  id: result.id};
                
                }
  }).catch((e) => {console.log(e)});
  
  if (getter) {

    return getter;

  }

  else {
    
    return {username: false, verified: false}

  }


};

async function getCookie(id) {
  
  if (!("connect.sid" in id)) {

    return false;

  }

  else {

    let improvedID = id['connect.sid'].slice(2,38);

    let getter = await knex('sessions').where({

      sid: improvedID
  
    }).select('sess').then(([result]) => {
  
     
        if (result) {
  
            return result;
  
        }
  
    }).catch((e) => {console.log(e)});;

    if (getter) {
      
      let parsedMail = JSON.parse(getter.sess);
  
      return parsedMail.email;
  
    }

  }

};
