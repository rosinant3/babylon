const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const knex = require('knex')(require('./knexfile'));
const KnexSessionStore = require('connect-session-knex')(session);
const uuid = require('uuid/v4');
 
// ROUTES 
  
const user = require('./routes/user-routes');
const playlist = require('./routes/playlist-routes');
const player = require('./routes/player-routes');
const article = require('./routes/article-routes');

   
// Express ACCESS-CONTROL CORS ACTIVATION
 
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
  "Origin, X-Requested-With, Content-Type, Accept");
  next();

});

// SESSION (Needs to be above router calls, else it won't work.)

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// knex session store

const store = new KnexSessionStore({

  knex: knex,
  tablename: 'sessions' // optional. Defaults to 'sessions'

});

let geheim = uuid();
// passport-session 

app.use(session({
  
  genid: (req) => {

    return uuid(); // use UUIDs for session IDs
     
  },
  secret: geheim, //pick a random string to make 
  // the hash that is generated secure
  resave: false, //required
  saveUninitialized: false, //required
  store: store

})
);
 
app.use('/user/', user);
app.use('/playlist/', playlist);
app.use('/player/', player);
app.use('/article/', article);

// PORT

app.listen(5000, () => { console.log(`Server 
running on http://localhost:5000`)});
app.use(express.static('public'));

// ROUTES
