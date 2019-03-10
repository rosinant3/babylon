// TABLE CREATION SOFTWARE
// made with knex migrate:make FileName, edit file name as it fits your needs
// for new knex session, create a new database
// knex is now bound to this one
// or delete migration tabels from you database
// knex migrate:latest when done

exports.up = function (knex) {
    return knex.schema.createTable('user', function (t) {
      t.increments('id').primary();
      t.string('email').collate('utf8_unicode_ci').notNullable();
      t.string('username').collate('utf8_unicode_ci').notNullable();
      t.string('password').collate('utf8_unicode_ci').notNullable();
      t.string('verified').collate('utf8_unicode_ci').notNullable();
      t.timestamps(false, true)
    })
  }
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user')
  }