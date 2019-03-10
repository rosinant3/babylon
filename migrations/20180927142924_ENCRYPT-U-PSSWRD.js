// MADE WITH knex migrate:make ENCRYPT-U-PSSWRD
// THIS IS STANDARD CODE FOR PASSWORD ENCRYPTION
// NO NEED TO THINK ABOUT IT, or maybe
// occasionally think about it
// knex migrate:latest when done

const { saltHashPassword } = require('../routes/store');

exports.up = function up (knex) {

  return knex.schema
    .table('user', t => {
      t.string('salt').notNullable()
      t.string('encrypted_password').notNullable()
    })
    .then(() => knex('user'))
    .then(users => Promise.all(users.map(convertPassword)))
    .then(() => {
      
      return knex.schema.table('user', t => {
      t.dropColumn('password')
      })
    })

  function convertPassword (user) {
    const { salt, hash } = saltHashPassword(user.password);
    
    return knex('user')
      .where({ id: user.id })
      .update({

        salt,
        encrypted_password: hash

      })
  }
}

exports.down = function down (knex) {

  return knex.schema.table('user', t => {
    t.dropColumn('salt')
    t.dropColumn('encrypted_password')
    t.string('password').notNullable()
  })
  
}
