const store = require('../store');
const playlistModel = require('./models/playlist-model');
const uuidv1 = require('uuid/v1');

const playlistController = {};
    
playlistController.postPlaylist = function postPlaylist(req, res) {
   
        let title = req.body.title.trim();
	let description = req.body.description.trim();
	let videos = req.body.videos;
	let user_id = req.body.user_id;
	let public2 = req.body.public2;
	let category = req.body.category.trim();

if (store.validationTitle(category)  && store.validationTitle(title) && store.validationDescription(description) 
	&& videos.length > 0 && (public2 === true || public2 === false) && user_id) {
	
		let items = {
			
				title: title,
				description: description,
				user: user_id,
				public2: public2,
				category: category,
				url_id: uuidv1()
			
		};
  
		let insertPly = playlistModel.insertPlaylist(items);
		
		insertPly.then( function(result) {
			 
			let childVideos = playlistModel.insertVideos(videos, {url_id: items.url_id, user: user_id});
			
			childVideos.then((response) => {
						
				return res.send({ok: true});
						
			}).catch((e) => {console.log(e)});;
					
			
		}).catch((e) => {console.log(e)});
			
}

else {
	
	   res.send({ok: false});
	
}

};

playlistController.editPlaylistItems = function editPlaylistItems (req, res) {

	let user = req.body.user;
	let playlist = req.body.playlist;

		if (req.body.reason === "delete") {

			let deleteVideo = playlistModel.deletePlaylistItem(req.body.item, user, playlist);
			
			deleteVideo.then((row) => {


				res.send({ok: row});

			}).catch((e) => {console.log(e)});;

		}

		if (req.body.reason === "count") {

			let countItems = playlistModel.countPlaylistItems(user, playlist);
			
			countItems.then((row) => {

			res.send({allVideos: row.allVideos[0]["count(*)"], watchedVideos: row.watchedVideos[0]["count(*)"]});

			}).catch((e) => {console.log(e)});;

		}

		if (req.body.reason === "switch") {

			let item1 = req.body.item;
			let item2 = req.body.item2;

			let switchItems = playlistModel.switchItems(item1, item2, playlist, user);

			switchItems.then((row) => {
 
				res.send({ok: true});
			
			}).catch((e) => {console.log(e)});;

		}
	
		
	if (req.body.reason === "add") {

		let video = req.body.video;
		let maxPlaylistOrder = playlistModel.getMaxOrderValue(playlist, user);

			maxPlaylistOrder.then((row) => {
				
				
				let order = row[0]["max"] + 1;
					
				    video.order = order;
		
				let childVideos = playlistModel.insertVideo(video, {url_id: playlist, user: user});
				childVideos.then((row2) => {
						
				return res.send({ok: row2, order: order});
						
				}).catch((e) => {console.log(e)});;	

			}).catch((e) => {console.log(e)});;
			
	}
  
};

playlistController.editPlaylist = function editPlaylist(req, res) {

	let userId = req.body.user;
	let playlistId = req.body.playlistId;

	if (req.body.reason === "getInfo") {

		let getInfo = playlistModel.getPlaylistInfoBasedOnUrl(playlistId);

		getInfo.then((row) => {
 
			return res.send(row[0]);

		}).catch((e) => {console.log(e)});;

	}

	if (req.body.reason === "title") {

	let item = req.body.item.trim();

	if (store.validationTitle(item)) {

		
		let editTitle = playlistModel.editPlaylistTitle(item, playlistId, userId);
			
		editTitle.then((response) => {

			res.send({ok: true}); 

		}).catch((e) => {console.log(e)});;

	}

	else {

		res.send({ok: false});	
		
	}
	

	}

	if (req.body.reason === "category") {

	let item = req.body.item.trim();

	if (store.validationTitle(item)) {

		let editCategory = playlistModel.editPlaylistCategory(item, playlistId, userId);
			
		editCategory.then((response) => {

			res.send({ok: true}); 

		}).catch((e) => {console.log(e)});;
		

	}

	else {

		res.send({ok: false});	
		
	}
	

	}

	if (req.body.reason === "description") {

	let item = req.body.item.trim();

	if (store.validationDescription(item)) {

		let editDescription = playlistModel.editPlaylistDescription(item, playlistId, userId);
			
		editDescription.then((response) => {

			res.send({ok: true}); 

		}).catch((e) => {console.log(e)});;
		

	}

	else {

		res.send({ok: false});	
		
	}
	

	}

	if (req.body.reason === "isPublic") {
	
		let status = req.body.publicStatus;
	
		let editPublicStatus = playlistModel.editPlaylistPublicStatus(status, playlistId, userId);
			
		editPublicStatus.then((response) => {

			res.send({ok: true}); 

		}).catch((e) => {console.log(e)});;
	}

	if (req.body.reason === "delete") {

		let remove = playlistModel.deleteAllPlaylistItems(userId, playlistId);
		let removePlaylist = playlistModel.deletePlaylist(userId, playlistId);


		remove.then((row) => {

			removePlaylist.then((row2) => {
		
				return res.send({deleted: true});

			});


		}).catch((error)=> {console.log(error)});


	}


};

playlistController.getPlaylist = function getPlaylist (req, res) {
    
	let user = req.body.user;
	let reason = req.body.reason;
	let scope = req.body.scope;

	if (reason === "title" && scope === "user") {
		
		
    	let reqData = req.body;
    	let pagination = {page: {}};
    	let per_page = reqData.per_page || 5;
    	let page = reqData.current_page || 1;
    	if (page < 1) page = 1;
    	let offset = (page - 1) * per_page;
	let search = req.body.search.trim();
	
	let getPlaylist = playlistModel.getPlaylistTitle(user, search, {offset: offset, per_page: per_page});
	let countPlaylist = playlistModel.countPlaylistTitle(user, search);

	countPlaylist.then((count2) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;
		
	getPlaylist.then((rows) => {

		pagination.page.to = offset + rows.length;
		pagination.page.last_page = Math.ceil(count / per_page);
		pagination.data = rows;
		
		return res.send(pagination);
						
	}).catch((e) => {console.log(e)});;
	
	}).catch((error) => {console.log(error)});
	
}

if (reason === "all" && scope === "user") {
			
	let reqData = req.body;
    	let pagination = {page: {}};
    	let per_page = reqData.per_page || 5;
    	let page = reqData.current_page || 1;
    	if (page < 1) page = 1;
    	let offset = (page - 1) * per_page;
 
	let getPlaylist = playlistModel.getPlaylist(user, {offset: offset, per_page: per_page});
	let countPlaylist = playlistModel.countPlaylist(user);
  
	countPlaylist.then((count2) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;
		
	getPlaylist.then((rows) => {
     
		pagination.page.to = offset + rows.length;
		pagination.page.last_page = Math.ceil(count / per_page);
		pagination.data = rows;
		
		return res.send(pagination);
						
	}).catch((e) => {console.log(e)});;
	
		
	}).catch((error) => {console.log(error)});

}


	if (reason === "category" && scope === "user") {
		
		
	let reqData = req.body;
    	let pagination = {page: {}};
    	let per_page = reqData.per_page || 5;
    	let page = reqData.current_page || 1;
    	if (page < 1) page = 1;
    	let offset = (page - 1) * per_page;
	let search = req.body.search.trim();
	
	let getPlaylist = playlistModel.getPlaylistCategory(user, search, {offset: offset, per_page: per_page});
	let countPlaylist = playlistModel.countPlaylistCategory(user, search);

	countPlaylist.then((count2) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;
		
	getPlaylist.then((rows) => {

		pagination.page.to = offset + rows.length;
		pagination.page.last_page = Math.ceil(count / per_page);
		pagination.data = rows;
		
		return res.send(pagination);
						
	}).catch((e) => {console.log(e)});;
	
	}).catch((error) => {console.log(error)});
	
}


	if (reason === "all" && scope === "public") {
			
		let reqData = req.body;
    		let pagination = {page: {}};
    		let per_page = reqData.per_page || 5;
    		let page = reqData.current_page || 1;
    		if (page < 1) page = 1;
    		let offset = (page - 1) * per_page;
	
		let getPlaylist = playlistModel.getPublic(user, {offset: offset, per_page: per_page});
		let countPlaylist = playlistModel.countPublic(user);

	countPlaylist.then((count2) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;
		
	getPlaylist.then((rows) => {

		pagination.page.to = offset + rows.length;
		pagination.page.last_page = Math.ceil(count / per_page);
		pagination.data = rows;
		
		return res.send(pagination);
						
	}).catch((e) => {console.log(e)});;
	
		
	}).catch((error) => {console.log(error)});

}

if (reason === "title" && scope === "public") {
			
    	let reqData = req.body;
    	let pagination = {page: {}};
    	let per_page = reqData.per_page || 5;
    	let page = reqData.current_page || 1;
    	if (page < 1) page = 1;
    	let offset = (page - 1) * per_page;
	let search = req.body.search.trim();
	
	let getPlaylist = playlistModel.getPublicTitle(user, search, {offset: offset, per_page: per_page});
	let countPlaylist = playlistModel.countPublicTitle(user, search);

	countPlaylist.then((count2) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;
		
	getPlaylist.then((rows) => {

		pagination.page.to = offset + rows.length;
		pagination.page.last_page = Math.ceil(count / per_page);
		pagination.data = rows;
		
		return res.send(pagination);
						
	}).catch((e) => {console.log(e)});;
	
	}).catch((error) => {console.log(error)});

}

if (reason === "category" && scope === "public") {
			
		
	let reqData = req.body;
    	let pagination = {page: {}};
    	let per_page = reqData.per_page || 5;
    	let page = reqData.current_page || 1;
    	if (page < 1) page = 1;
    	let offset = (page - 1) * per_page;
	let search = req.body.search.trim();
	
	let getPlaylist = playlistModel.getPublicCategory(user, search, {offset: offset, per_page: per_page});
	let countPlaylist = playlistModel.countPublicCategory(user, search);

	countPlaylist.then((count2) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;
		
	getPlaylist.then((rows) => {

		pagination.page.to = offset + rows.length;
		pagination.page.last_page = Math.ceil(count / per_page);
		pagination.data = rows;
		
		return res.send(pagination);
						
	}).catch((e) => {console.log(e)});;
	
	}).catch((error) => {console.log(error)});

}

if (reason === "items") {

    	let playlist = req.body.playlist;
    	let reqData = req.body;
    	let pagination = {page: {}};
    	let per_page = reqData.per_page || 5;
    	let page = reqData.current_page || 1;
    	if (page < 1) page = 1;
    	let offset = (page - 1) * per_page;
	
	let getPlaylist = playlistModel.getPlaylistItems(playlist, user, {offset: offset, per_page: per_page});
	let countPlaylist = playlistModel.countPlaylistItems(user, playlist);

	countPlaylist.then((count2) => {
			
			let count = count2.allVideos[0]["count(*)"];
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

	getPlaylist.then((rows) => {

		pagination.page.to = offset + rows.length;
		pagination.page.last_page = Math.ceil(fixedCount / per_page);
		pagination.data = rows;
		
		return res.send(pagination);
						
	}).catch((e) => {console.log(e)});;
	
	}).catch((error) => {console.log(error)});
	



}

};
	
	
module.exports = playlistController;
