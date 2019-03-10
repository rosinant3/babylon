// knex establish connection with the database
// enter your username and password
// don't forget to change the database name

module.exports = {

  client: 'mysql',
  connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'password',
      database: 'babel'
  }
}