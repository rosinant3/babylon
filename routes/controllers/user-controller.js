const store = require('../store');

const userControllers = {};

userControllers.sessionController = function sessionController (req, res, next) {

  let cookiedata = store.getCookie(req.cookies);
  
  cookiedata.then((email) => {

    if (email) {

      let username = store.getUsername({email: email});

      username.then((result) => {

        let login = {

                      username: result.username, 
                      email: email, 
                      verified: result.verified,
		      id: result.id
                    
                    };

        if (result.username === false && result.verified === false) {

          let login = {username: false, email: false, verified: false};
          
          res.send({login});

        }

        else {

          res.send({login});

        }


        
      }).catch((e)=>{console.log(e)});

 
    }

    else {

      let login = {username: false, email: false, verified: false};
      
      res.send({login});

    }

  }).catch((e) => {console.log(e)})
  
};

userControllers.joinController = function joinController (req, res) {

  let email = req.body.email.trim();
  let password = req.body.password.trim();
  let username = req.body.username.trim();

  let aut = store.formValidation({

    email: email, 
    password: password, 
    username: username
  
  });

  if (aut) {

    let search = store.searchUser({

      email: email,
      username: username

    });

    search.then((result) => {

    if (result.status === true ) {

      store.createUser({

        username: username,
        password: password,
        email: email
      
      }).then(() => {

        const created = "USER_CREATED";
        req.session.email = email;
        res.send(created);

      });
    }

    else {

      res.send(result);

    }});

  } 

  else {

    res.send(aut);

  }

};

userControllers.loginController = function loginController (req, res) {

  let email = req.body.email.trim();
  let password = req.body.password.trim();
  let aut = store.formValidation({

    email: email, 
    password: password, 
    username: "Gil"
  
  });

  if (aut) {

    store
      .authenticate({

        email: email,
        password: password,
        username: 'Gil'

      })
      .then(({ success }) => {
         
        let username = store.getUsername({email});

        username.then((result) => {

            let login = {

                      username: result.username, 
                      email: email, 
                      verified: result.verified,
		      id: result.id
                    
                    };


          if (success) {

		 req.session.email = email;
		res.send({login})

	 }
	
          else {res.sendStatus(401)};

        }).catch((e) => {console.log(e)})
  
        
      })

  }

  else {

    res.send(aut);

  }

};
  
module.exports = userControllers;
