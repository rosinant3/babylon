// TABLE CREATION SOFTWARE
// made with knex migrate:make FileName, edit file name as it fits your needs
// for new knex session, create a new database
// knex is now bound to this one
// or delete migration tabels from you database
// knex migrate:latest when done

exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', function (t) {
	  
      t.increments('id').primary();
      t.string('title').collate('utf8_unicode_ci').notNullable();
      t.string('category').collate('utf8_unicode_ci').notNullable();
      t.string('thumbnail').collate('utf8_unicode_ci').notNullable();
      t.string('public').collate('utf8_unicode_ci').notNullable();
      t.text('link').collate('utf8_unicode_ci').notNullable();
      t.string("url_id").unique().collate('utf8_unicode_ci').notNullable();
      t.integer('user').unsigned().collate('utf8_unicode_ci').notNullable();
      t.foreign('user').references('id').inTable('user');
      t.timestamps(false, true);
	  
})};
 
exports.down = function(knex, Promise) {
	
  return knex.schema.dropTableIfExists('articles');
  
};
