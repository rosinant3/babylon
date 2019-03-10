const knex = require('knex')(require('../../../knexfile'));

const playlistModel = {};

playlistModel.insertPlaylist = function insertPlaylist(items) {
	
							return knex('playlists').insert({
								 
									title: items.title,
									description: items.description,
									public: items.public2, 
									user: items.user,
									category: items.category,
									url_id: items.url_id,
									watched: false
								
								}).debug();

	};
						
playlistModel.insertVideos = async function insertVideos(videos, parent) {

						await videos.map((video) => {

							knex('playlistVideos').insert({
								
								videoTitle: video.title,
								duration: video.duration,
								videoId: video.videoId,
								published: video.published,
								order: video.order,
								playlist: parent.url_id,
								user: parent.user,
								thumbnail_default: video.thumbnails.default.url,
								thumbnail_medium: video.thumbnails.medium.url,
								thumbnail_high: video.thumbnails.high.url,
								watched: "no"
								
							}).debug()
							.then((resolution) =>{
								
								return resolution;
								
							}).catch((e) => {console.log(e)});;
							
							
						});

	};
	
playlistModel.insertVideo = function insertVideo(video, parent) {

					
				return	knex('playlistVideos').insert({
								
								videoTitle: video.title,
								duration: video.duration,
								videoId: video.videoId,
								published: video.published,
								order: video.order,
								playlist: parent.url_id,
								user: parent.user,
								thumbnail_default: video.thumbnails.default.url,
								thumbnail_medium: video.thumbnails.medium.url,
								thumbnail_high: video.thumbnails.high.url,
								watched: "no"
								
							}).debug()
						
	
	};

playlistModel.getPlaylistInfoBasedOnUrl = function getPlaylistInfoBasedOnUrl(url) {

			return knex("playlists").join( 'user', function(builder) {
										
										builder.on("playlists.user", "=", "user.id");
										
									})
					.where({"playlists.url_id": url})
					.select('playlists.title', 'playlists.description', 'playlists.category', 'playlists.created_at' , 'playlists.public', 'playlists.updated_at', 'playlists.url_id', 'user.username' );




	};
	 
playlistModel.getPlaylist = function getPlaylist(user, pag) {
	
						return knex('playlists')
									.join( 'user', function(builder) {
										
										builder.on(user, "=", "user.id");
										
									}).
									leftOuterJoin( 'playlistVideos', function(builder) { 
										      
										builder.on('playlistVideos.playlist', '=', 'playlists.url_id').andOn(user, "=", "playlistVideos.user").andOn('playlistVideos.order', '=', 
										
										knex.raw(`(select min(playlistVideos.order) from playlistVideos where playlistVideos.playlist = playlists.url_id and playlistVideos.user = ${user})`)
										
										);
										    
									}).select('playlistVideos.thumbnail_default', 'playlistVideos.thumbnail_medium', 'playlistVideos.thumbnail_high', "playlistVideos.watched", 'playlistVideos.videoId', 'user.username', 'playlists.url_id', 
									'playlists.title', 'playlists.description', 'playlists.category', 'playlists.created_at' , 'playlists.updated_at', 'playlists.public')
									.offset(pag.offset).limit(pag.per_page).orderBy('playlists.updated_at', 'desc').where("playlists.user","=", user);
									
		};
		
playlistModel.countPlaylist = function countPlaylist(user) {
		 
						return knex('playlists').where({"playlists.user": user})
									.count();
									
		
		};
		
playlistModel.getPlaylistTitle = function getPlaylistTitle(user, search, pag) {
		  
						let search2 = `%${search}%`;
		  
						return knex('playlists')
									.join( 'user', function(builder) {
										
										builder.on(user, "=", "user.id");
										
									}).
									leftOuterJoin( 'playlistVideos', function(builder) { 
										      
										builder.on('playlistVideos.playlist', '=', 'playlists.url_id').andOn(user, "=", "playlistVideos.user").andOn('playlistVideos.order', '=', 
										
										knex.raw(`(select min(playlistVideos.order) from playlistVideos where playlistVideos.playlist = playlists.url_id and playlistVideos.user = ${user})`)
										
										);
										    
									}).select('playlistVideos.thumbnail_default', 'playlistVideos.thumbnail_medium', 'playlistVideos.thumbnail_high', "playlistVideos.watched", 'playlistVideos.videoId', 'user.username', 'playlists.url_id', 
									'playlists.title', 'playlists.description', 'playlists.category', 'playlists.created_at' , 'playlists.updated_at', 'playlists.public' )
									.where("playlists.title", "like", search2)
									.offset(pag.offset).limit(pag.per_page).orderBy('playlists.updated_at', 'desc').andWhere("playlists.user","=", user);
									
		};
		
playlistModel.countPlaylistTitle = function countPlaylistTitle(user, search) {
		  
							let search2 = `%${search}%`;
		  
						return knex('playlists').where({"playlists.user": user})
							.andWhere("playlists.title", "like", search2).count();
									
		};
		
playlistModel.getPlaylistCategory = function getPlaylistCategory(user, search, pag) {
		  
						let search2 = `%${search}%`;
		  
						return knex('playlists')
									.join( 'user', function(builder) {
										
										builder.on(user, "=", "user.id");
										
									}).
									leftOuterJoin( 'playlistVideos', function(builder) { 
										      
										builder.on('playlistVideos.playlist', '=', 'playlists.url_id').andOn(user, "=", "playlistVideos.user").andOn('playlistVideos.order', '=', 
										
										knex.raw(`(select min(playlistVideos.order) from playlistVideos where playlistVideos.playlist = playlists.url_id and playlistVideos.user = ${user})`)
										
										);
										    
									}).select('playlistVideos.thumbnail_default', 'playlistVideos.thumbnail_medium', 'playlistVideos.thumbnail_high', "playlistVideos.watched", 'playlistVideos.videoId', 'user.username', 'playlists.url_id', 
									'playlists.title', 'playlists.description', 'playlists.category', 'playlists.created_at', 'playlists.updated_at', 'playlists.public')
									.where("playlists.category", "like", search2)
									.offset(pag.offset).limit(pag.per_page).orderBy('playlists.updated_at', 'desc').andWhere("playlists.user","=", user);
									
		};
		
playlistModel.countPlaylistCategory = function countPlaylistCategory(user, search) {
		  
						let search2 = `%${search}%`;
		  
						return knex('playlists').where({"playlists.user": user})
							.andWhere("playlists.title", "like", search2).count();
									
		};
		
playlistModel.getPublic = function getPublic(user, pag) {
		  
						return knex('playlists')
									.join( 'user', function(builder) {
										
										builder.on("playlists.user", "=", "user.id");
										
									}).
									join( 'playlistVideos', function(builder) { 
										      
										builder.on('playlistVideos.playlist', '=', 'playlists.url_id').andOn("playlists.user", "=", "playlistVideos.user").andOn('playlistVideos.order', '=', 
										
										knex.raw(`(select min(playlistVideos.order) from playlistVideos where playlistVideos.playlist = playlists.url_id and playlistVideos.user = playlists.user)`)
										
										);
										    
									}).select('playlistVideos.thumbnail_default', 'playlistVideos.thumbnail_medium', 'playlistVideos.thumbnail_high', "playlistVideos.watched", 'playlistVideos.videoId', 'user.username', 'playlists.url_id', 
									'playlists.title', 'playlists.description', 'playlists.category', 'playlists.created_at', 'playlists.updated_at', 'playlists.public', 'playlists.url_id' )
									.where("playlists.public", "=", 1)
									.offset(pag.offset).limit(pag.per_page).orderBy('playlists.updated_at', 'desc');
									
		};
		
playlistModel.countPublic = function countPublic(user) {
		  
						return  knex('playlists').count().where("playlists.public", "=", 1);
									
		
		};
		
playlistModel.getPublicTitle = function getPublicTitle(user, search, pag) {
		  
						let search2 = `%${search}%`;
		  
						return knex('playlists')
									.join( 'user', function(builder) {
										
										builder.on("playlists.user", "=", "user.id");
										
									}).
									join( 'playlistVideos', function(builder) { 
										      
										builder.on('playlistVideos.playlist', '=', 'playlists.url_id').andOn("playlists.user", "=", "playlistVideos.user").andOn('playlistVideos.order', '=', 
										
										knex.raw(`(select min(playlistVideos.order) from playlistVideos where playlistVideos.playlist = playlists.url_id and playlistVideos.user = playlists.user)`)
										
										);
										    
									}).select('playlistVideos.thumbnail_default', 'playlistVideos.thumbnail_medium', 'playlistVideos.thumbnail_high', "playlistVideos.watched", 'playlistVideos.videoId', 'user.username', 'playlists.url_id', 
									'playlists.title', 'playlists.description', 'playlists.category', 'playlists.created_at', 'playlists.updated_at', 'playlists.public')
									.where("playlists.public", "=", 1).andWhere("playlists.title", "like", search2)
									.offset(pag.offset).limit(pag.per_page).orderBy('playlists.updated_at', 'desc');
									
		};
		
playlistModel.countPublicTitle = function countPublicTitle(user, search) {
		  
						let search2 = `%${search}%`;
		  
						return  knex('playlists').count().where("playlists.public", "=", 1).andWhere("playlists.title", "like", search2);
									
		
		};
		
playlistModel.getPublicCategory = function getPublicCategory(user, search, pag) {
		  
						let search2 = `%${search}%`;
		  
						return knex('playlists')
									.join( 'user', function(builder) {
										
										builder.on("playlists.user", "=", "user.id");
										
									}).
									join( 'playlistVideos', function(builder) { 
										      
										builder.on('playlistVideos.playlist', '=', 'playlists.url_id').andOn("playlists.user", "=", "playlistVideos.user").andOn('playlistVideos.order', '=', 
										
										knex.raw(`(select min(playlistVideos.order) from playlistVideos where playlistVideos.playlist = playlists.url_id and playlistVideos.user = playlists.user)`)
										
										);
										    
									}).select('playlistVideos.thumbnail_default', 'playlistVideos.thumbnail_medium', 'playlistVideos.thumbnail_high', "playlistVideos.watched", 'playlistVideos.videoId', 'user.username', 'playlists.url_id', 
									'playlists.title', 'playlists.description', 'playlists.category', 'playlists.created_at', 'playlists.updated_at', 'playlists.public' )
									.where("playlists.public", "=", 1).andWhere("playlists.category", "like", search2)
									.offset(pag.offset).limit(pag.per_page).orderBy('playlists.updated_at', 'desc');
									
		};
		
playlistModel.countPublicCategory = function countPublicCategory(user, search) {
		  
						let search2 = `%${search}%`;
		  
						return  knex('playlists').count().where("playlists.public", "=", 1).andWhere("playlists.category", "like", search2);
									
		
		};

playlistModel.editPlaylistTitle = function editPlaylistTitle(title, playlistId, userId) {

				return knex("playlists")
					.update({"playlists.title": title, "playlists.updated_at": new Date()}).
					where({url_id: playlistId, user: userId});


		};

playlistModel.editPlaylistCategory = function editPlaylistCategory(category, playlistId, userId) {

				return knex("playlists")
					.update({"playlists.category": category, "playlists.updated_at": new Date()}).
					where({url_id: playlistId, user: userId});


		};

playlistModel.editPlaylistDescription = function editPlaylistDescription(description, playlistId, userId) {

              
				return knex("playlists")
					.update({"playlists.description": description, "playlists.updated_at": new Date()}).
					where({url_id: playlistId, user: userId});


		};

playlistModel.editPlaylistPublicStatus = function editPlaylistPublicStatus(isPublic, playlistId, userId) {


				return knex("playlists")
					.update({"playlists.public": isPublic, "playlists.updated_at": new Date()}).
					where({url_id: playlistId, user: userId});


		};

playlistModel.getPlaylistItems = function getPlaylistItems(playlist, user, pag) { 
 
				return knex("playlistVideos").select("playlistVideos.user", "playlistVideos.duration", "playlistVideos.thumbnail_default", "playlistVideos.thumbnail_medium", "playlistVideos.watched", "playlistVideos.thumbnail_high", "playlistVideos.videoTitle", "playlistVideos.videoId", "playlistVideos.order", "playlistVideos.id").where({playlist: playlist}).orderBy("playlistVideos.order", "asc").offset(pag.offset).limit(pag.per_page);


		};

playlistModel.deletePlaylistItem = function deletePlaylistItem(item, user, playlist) {


			return knex("videoComments").where("videoComments.video", "=", item).andWhere("videoComments.user", "=", user).del().then((row) => {

			return knex("playlistVideos").where("playlistVideos.id", "=", item).andWhere("playlistVideos.user", "=", user).andWhere("playlistVideos.playlist", "=", playlist).del();

		});

		};

playlistModel.countPlaylistItems = function countPlaylistItems(user, playlist) {

			return knex("playlistVideos").where("playlistVideos.playlist", "=", playlist).count().then((res) => {

				return knex("playlistVideos").where("playlistVideos.watched", "=", "yes").andWhere("playlistVideos.playlist", "=", playlist).count()
				.then((res2) => {

					return {allVideos: res, watchedVideos: res2};

					});

		}).catch((e) => {console.log(e)});

		};

playlistModel.switchItems = function switchItems(item1, item2, playlist, user) {

				return knex("playlistVideos").
						where({"playlistVideos.id": item1.id, "playlistVideos.playlist": playlist, "playlistVideos.user": user}).update({order: item2.order, updated_at: new Date()}).then((row)=>{

				return knex("playlistVideos").where({"playlistVideos.id": item2.id, "playlistVideos.playlist": playlist, "playlistVideos.user": user}).update({order: item1.order, updated_at: new Date()});

	}).catch((e) => {console.log(e)});
		},

playlistModel.deleteAllPlaylistItems = function deleteAllPlaylistItems(user, playlist) {

			return knex("videoComments").where("videoComments.playlist", "=", playlist).andWhere("videoComments.user", "=", user).del().then((row) => {
			
			return knex("playlistVideos").where("playlistVideos.user", "=", user).andWhere("playlistVideos.playlist", "=", playlist).del();

	});

		};

playlistModel.deletePlaylist = function deletePlaylist(user, playlist) {


			return knex("playlists").where("playlists.user", "=", user).andWhere("playlists.url_id", "=", playlist).del();

		};

playlistModel.getMaxOrderValue = function getMaxOrderValue(playlist, user) {


			return knex("playlistVideos").where("playlistVideos.playlist", "=", playlist).andWhere("playlistVideos.user", "=", user).max("playlistVideos.order as max");

		}
	
module.exports = playlistModel;
