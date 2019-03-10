// TABLE CREATION SOFTWARE
// made with knex migrate:make FileName, edit file name as it fits your needs
// for new knex session, create a new database
// knex is now bound to this one
// or delete migration tabels from you database
// knex migrate:latest when done

exports.up = function(knex, Promise) {
  return knex.schema.createTable('articleComments', function (t) {
      t.increments('id').primary();
      t.text('comment').collate('utf8_unicode_ci').notNullable();
      t.integer('user').unsigned().collate('utf8_unicode_ci').notNullable();
      t.string('article').collate('utf8_unicode_ci').notNullable();
      t.foreign('article').references('url_id').inTable('articles');
      t.foreign('user').references('id').inTable('user');
      t.timestamps(false, true);
	  
})};

exports.down = function(knex, Promise) {

      return knex.schema.dropTableIfExists('articleComments');

};
