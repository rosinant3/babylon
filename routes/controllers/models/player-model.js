const knex = require('knex')(require('../../../knexfile'));

const playerModel = {}
	
playerModel.getPlaylist = function getPlaylist(playlist) {

				return knex("playlists").select("*").where("playlists.url_id", "=", playlist);



		};

playerModel.changeWatchTime = function changeWatchTime(videoId, user,newTime) {



				return knex("playlistVideos").
						where({"playlistVideos.id": videoId, "playlistVideos.user": user}).update({watched: newTime, updated_at: new Date()});
	


		};


playerModel.postComment = function postComment(note, user, video, timestamp, url_id) {

				return knex("videoComments")
						.insert({
								 
							note: note,
							user: user,
							video: video,
							timestamp: timestamp,
							playlist: url_id
								
						}).debug();
	 

		};

playerModel.countComments = function countComments(video) {


			return knex("videoComments").where("videoComments.video", "=", video).count();


			};

playerModel.getComments = function getComments(video, pag) {

			
				return knex("videoComments").join( 'user', function(builder) {
										
										builder.on("videoComments.user", "=", "user.id");
										
									}).select("videoComments.id", "videoComments.note", "videoComments.timestamp", "videoComments.video", "videoComments.user", "videoComments.created_at", "videoComments.updated_at", "user.username").where("videoComments.video", "=", video).offset(pag.offset).limit(pag.per_page).orderBy("videoComments.id", "desc");


		};

playerModel.updateComment = function updateComment(note, noteId, video, user) {

				return knex("videoComments").
						where({"videoComments.id": noteId, "videoComments.user": user, "videoComments.video": video}).update({note: note, updated_at: new Date()});


		};


playerModel.removeComment = function removeComment(noteId, video, user) {

			return knex("videoComments").
						where({"videoComments.id": noteId, "videoComments.user": user, "videoComments.video": video}).del();

		}
		
module.exports = playerModel;