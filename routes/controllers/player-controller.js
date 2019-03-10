const playerModel = require("./models/player-model");

const playerController = {};

playerController.loadPlayer = function loadPlayer (req, res) {

		let playlist = req.body.playlist;
   
     		let getPlaylist = playerModel.getPlaylist(playlist);

		getPlaylist.then((row) => {

			res.send({playlist: row});

		}).catch((e) => {console.log(e)});
		

};

playerController.note = function note (req, res) {

		let video = req.body.video;
	
		if (req.body.send) {

		let note = req.body.note.trim();
		let timestamp = req.body.timestamp;
		let user = req.body.user;
		let url_id = req.body.url_id;

		if (note.length > 5000 || note === "") {

			res.send({error: true});

		}

		else {

			let postComment = playerModel.postComment(note, user, video, timestamp, url_id);

		 	postComment.then((row) => {
 
				res.send({posted: row});

			});

		}

		}

		if (req.body.del) {

			let user = req.body.user;
			let noteId = req.body.noteId;
			let video = req.body.video;


			let removeComment = playerModel.removeComment(noteId, video, user);

			removeComment.then((row) => {

				res.send({removed: row});

			});



		}


		if (req.body.change) {

			let note = req.body.note.trim();
			let user = req.body.user;
			let noteId = req.body.noteId;
			let video = req.body.video;

			let updateComment = playerModel.updateComment(note, noteId, video, user);

			updateComment.then((row) => {

		
				res.send({updated: row});
				

			});

		}


		if (req.body.get) {

    			let reqData = req.body;
    			let pagination = {page: {}};
    			let per_page = reqData.per_page || 12;
    			let page = reqData.current_page || 1;
    			if (page < 1) page = 1;
    			let offset = (page - 1) * per_page;
			
			let countComments = playerModel.countComments(video);
			let getComments = playerModel.getComments(video, {offset: offset, per_page: per_page});

		countComments.then((row1) => {

			let count = row1[0]["count(*)"];
			let fixedCount;

			if (count === 0) {

				fixedCount = 1;

			}

			if (count !== 0) {

				fixedCount = count;

			}

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;

				getComments.then((rows) => {

			
			pagination.page.to = offset + rows.length;
			pagination.page.last_page = Math.ceil(fixedCount / per_page);
			pagination.data = rows;
		

				res.send(pagination);
				
			})

			});



		}

};

playerController.updateWatchTime = function updateWatchTime (req, res) {

			let videoId = req.body.videoId;
			let user = req.body.user;
			let newTime = req.body.newTime;

			let changeWatchTime = playerModel.changeWatchTime(videoId, user, newTime);

			changeWatchTime.then((row) => {

				res.send({updated: "updated"});
	

			}).catch((e) => {console.log(e)});


		};

module.exports = playerController;
