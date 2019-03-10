// TABLE CREATION SOFTWARE
// made with knex migrate:make FileName, edit file name as it fits your needs
// for new knex session, create a new database
// knex is now bound to this one
// or delete migration tabels from you database
// knex migrate:latest when done

exports.up = function(knex, Promise) {
  return knex.schema.createTable('playlistVideos', function (t) {
      t.increments('id').primary();
      t.string('videoTitle').collate('utf8_unicode_ci').notNullable();
      t.string('duration').collate('utf8_unicode_ci').notNullable();
      t.string('videoId').collate('utf8_unicode_ci').notNullable();
      t.string('thumbnail_default').collate('utf8_unicode_ci').notNullable();
	t.string('thumbnail_medium').collate('utf8_unicode_ci').notNullable();
t.string('thumbnail_high').collate('utf8_unicode_ci').notNullable();
	  t.string('published').collate('utf8_unicode_ci').notNullable();
	  t.integer('order').collate('utf8_unicode_ci').notNullable();
	  t.string('playlist').collate('utf8_unicode_ci').notNullable();
	  t.string('watched').collate('utf8_unicode_ci').notNullable();
	  t.integer('user').unsigned().collate('utf8_unicode_ci').notNullable();
      t.timestamps(false, true);
	  t.foreign('playlist').references('url_id').inTable('playlists');
	  t.foreign('user').references('id').inTable('user');
	  
})};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('playlistVideos');
};
