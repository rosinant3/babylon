const initialState = {
   
  login: {email: 'initial', username: 'initial', verified: 'initial', id: 'initial'},

  playlistVideos: {length: 0, videos: [], newadded: false},
  dragDrop: {videoBeingDragged: false, videoBeingOverEd: false},

  searchResults: {form: null, page: {total: 0}, moreWaiting: false, waiting: true, scope: "user", onepage: false, ran: false, search: false,    nextPage: 1, reason: "all"},
  searchResultsPlaylists: {length: 0, playlists: []},

  editor: {status: false, url_id: null},
  editorVideos: {videos: [], length: 0, total: 0, nextPage: 1, onepage: false},
  dragDropEditor: {videoBeingDragged: false, videoBeingOverEd: false},

  public: {globalReason: "playlist", form: false, page: {total: 0}, moreWaiting: false, waiting: true, scope: "public", onepage: false, ran: false, search: false, nextPage: 1, reason: "all"}, 
  publicPlaylists: {length: 0, playlists: []},

  player: {status: false, url_id: false, scope: false},
  playerVideos: {videos: [], length: 0, total: 0, onepage: false, nextPage: 1},
  playerCurrentVideo: {viideo: {videoId: false}},
  videoComments: {comments: [], length: 0, total: 0, onepage: false, nextPage: 1},
  playerSeekTo: {seconds: 0, seeked: false},

  article: {newadded: false},
  userArticles: {articles: [], len: 0, total: 0, onepage: false, nextPage: 1, search: undefined, reason: "all"},
  reader: {status: false, url_id: false, location: false},
  articleComments: {comments: [], length: 0, onepage: false, nextPage: 1},
  
};

const enter = (state = initialState, action) => {

    switch (action.type) {
      case "REMOVE_USER_ARTICLE":

		let filteredArticleList = state.userArticles.articles.filter((article) => {

			return article.url_id !==  action.url_id;

		});

	return {...state, userArticles: {articles: filteredArticleList, len: filteredArticleList.length, total: state.userArticles.total, onepage: state.userArticles.onepage, nextPage: state.userArticles.nextPage, search: state.userArticles.search, reason: state.userArticles.reason}};
      case "ADD_ONE_COMMENT":

		let commentsToAddOne = state.articleComments.comments.slice();

		commentsToAddOne.unshift(action.comment);
	
	return {...state, articleComments: {comments: commentsToAddOne, length: commentsToAddOne.length, onepage: state.articleComments.onepage, nextPage: state.articleComments.nextPage}}
      case "UPDATE_ONE_ARTICLE_COMMENT":
		
		let updatedArticleComments = state.articleComments.comments.map((comment) => {

			let newComment = comment;			

			if (comment.id === action.id) {
		
				newComment.updated_at = new Date();
				newComment.comment = action.comment;
				return newComment;

			}

			else {

				return comment;

			}
		

		   }).sort((x, y) => {

    				return new Date(y.updated_at) - new Date(x.updated_at);

			});

	return {...state, articleComments: {comments: updatedArticleComments, length: updatedArticleComments.length, onepage: state.articleComments.onepage, nextPage: state.articleComments.nextPage}};
      case "REMOVE_ONE_ARTICLE_COMMENT":

		let filteredArticleComments = state.articleComments.comments.filter((comment) => {

				return comment.id !==  action.id;

			});

	return {...state, articleComments: { comments: filteredArticleComments, length: filteredArticleComments.length, onepage: state.articleComments.onepage, nextPage: state.articleComments.nextPage }};
      case "CLEAR_ACTICLE_COMMENTS":

	return {...state, articleComments: {comments: action.comments, length: action.comments.length, onepage: action.onepage, nextPage: action.nextPage}};
      case "ADD_ACTICLE_COMMENTS":

		let articleComments = state.articleComments.comments.slice();

		action.comments.forEach((comment) => {

			articleComments.push(comment);

		});

	return {...state, articleComments: {comments: articleComments, length: articleComments.length, onepage: action.onepage, nextPage: action.nextPage}};
      case "UPDATE_ARTICLE":

		let articleContainer = state.userArticles.articles.slice();

		let updatedArticles;

		if (action.what === "title") {

			updatedArticles = articleContainer.map((article) => {

				let newArticle = article;;

				if (article.url_id === action.url_id) {


					newArticle.title = action.title;
					newArticle.updated_at = new Date();
					return newArticle;

				}

				else {


					return article;


				}

			}).sort((x, y) => {

    				return new Date(y.updated_at) - new Date(x.updated_at);

			});



		}

		if (action.what === "category") {

			updatedArticles = articleContainer.map((article) => {

				let newArticle = article;

				if (article.url_id === action.url_id) {


					newArticle.category = action.category;
					newArticle.updated_at = new Date();
					return newArticle;

				}

				else {


					return article;


				}

			}).sort((x, y) => {

    				return new Date(y.updated_at) - new Date(x.updated_at);

			});

		}

			if (action.what === "thumbnail") {

			updatedArticles = articleContainer.map((article) => {

				let newArticle = article;

				if (article.url_id === action.url_id) {

					newArticle.thumbnail = action.thumbnail;
					newArticle.updated_at = new Date();
					return newArticle;

				}

				else {


					return article;


				}

			}).sort((x, y) => {

    				return new Date(y.updated_at) - new Date(x.updated_at);

			});



			}

			if (action.what === "isPublic") {

			updatedArticles = articleContainer.map((article) => {

				let newArticle = article;

				if (article.url_id === action.url_id) {

					newArticle.public = action.isPublic;
					newArticle.updated_at = new Date();
					return newArticle;

				}

				else {


					return article;


				}

			}).sort((x, y) => {

    				return new Date(y.updated_at) - new Date(x.updated_at);

			});



			}


      return {...state, userArticles: {...state.userArticles, articles: updatedArticles}};
      case "READ":

	let location = action.location;

	if (action.location === "inherit") {

		location = state.reader.location;

	}

      return {...state, reader: {status: action.status, url_id: action.url_id, location: location}};
      case "FETCHED_ARTICLES":
        
		let newArticles = state.articles;

		if (state.userArticles.reason !== action.reason || state.userArticles.search !== action.search || state.article.newadded) {

			newArticles = action.articles;

		}

		if (state.userArticles.reason === action.reason && !state.article.newadded && state.userArticles.search === action.search && !action.fresh) {

			newArticles = state.userArticles.articles.slice();

			for (let i = 0; i < action.articles.length; i++) {

				newArticles.push(action.articles[i]);
		
			}

		}

	return { ...state, article: { newadded: action.newadded }, userArticles: { articles: newArticles, len: newArticles.length, total: action.total, onepage: action.onepage, nextPage: action.nextPage, search: action.search, reason: action.reason} };
      case "ARTICLE_ADDED":

	return {...state, article: {newadded: action.newadded}};
      case "COMMENT_SEEKED":


	return {...state, playerSeekTo: {seconds: action.seconds, seeked: action.seeked}};
      case "ADD_VIDEO_COMMENTS":

		let comments = state.videoComments.comments.slice();
		let onepage;
		let nextPage;
		let total;

		if (action.state === "initial") {

			comments = action.comments;
			onepage = action.onepage;
			total = action.total;
			nextPage = action.nextPage;

		}

		if (action.state === "remove") {

			comments = comments.filter((comment) => {

				return comment.id !==  action.noteId;

			});
			onepage = state.videoComments.onepage;
			total = state.videoComments.total;
			nextPage = state.videoComments.nextPage;

		}

		if (action.state === "one") {

			comments.unshift(action.comment);
			onepage = state.videoComments.onepage;
			total = state.videoComments.total;
			nextPage = state.videoComments.nextPage;

		}

		if (action.state === "edit") {

			comments = comments.map((comment) => {

					let newComment = comment;


					if (comment.id === action.noteId) {


						newComment.updated_at = action.updated_at;
						newComment.note = action.note;
						return newComment;

					}

					else {


						return comment;

					}
			
			});
			onepage = state.videoComments.onepage;
			total = state.videoComments.total;
			nextPage = state.videoComments.nextPage;


		}

		if (action.state === "additional") {

			action.comments.forEach((comment) => {


				comments.push(comment);

			});
			onepage = action.onepage;
			total = action.total;
			nextPage = action.nextPage;

		}

	return {...state, videoComments: {comments: comments, length: comments.length, onepage: onepage, total: total, nextPage: nextPage}};
      case "UPDATE_WATCHED_OF_ONE_VIDEO":

		let playerVideosList = state.playerVideos.videos.slice();

		let newPlayerList = playerVideosList.map((video) => {

			let newVideo = video;

			if (video.id === action.video) {

				if (newVideo["watched"] !== "yes") {

					newVideo["watched"] = action.time;

				}

				return newVideo;
		
			}

			else {


				return video;

			}

		});
	

	return {...state, playerVideos: {total: state.playerVideos.total, onepage: state.playerVideos.onepage, nextPage: state.playerVideos.nextPage, videos: newPlayerList}};
      case "ADD_PLAYER_VIDEOS":

	return {...state, playerVideos: {total: action.total, onepage: action.onepage, nextPage: action.nextPage, videos: action.videos, length: action.videos.length}}
      case "UPDATE_CURRENT_PLAYER_VIDEO":

		let nextVideo;
		let currentPlayerVideos = state.playerVideos.videos.slice();
		let updatedCurrentPlayerVideos;

		if (action.role === "click") {

			nextVideo = action.video;
			updatedCurrentPlayerVideos = currentPlayerVideos;
			

		}

		if (action.role === "end") {

			updatedCurrentPlayerVideos = currentPlayerVideos.map((video, index) => {

				let newVideo = video;

				
				if (action.video.id === video.id) {

					if (index === state.playerVideos.videos.length - 1) {

						nextVideo = state.playerVideos.videos[0];
						newVideo["watched"] = "yes";
						return newVideo;
			

					}

					else {

						nextVideo = state.playerVideos.videos[index + 1];
						newVideo["watched"] = "yes";
						console.log(newVideo);
						return newVideo;


					}

					

				}

				else {

					return video;

				}

			});

		}

	


	return {...state, playerCurrentVideo: {video: nextVideo}, playerVideos: {videos: updatedCurrentPlayerVideos, length: updatedCurrentPlayerVideos.length, total: state.playerVideos.total, onepage: state.playerVideos.onepage, nextPage: state.playerVideos.nextPage}};	
      case "CHANGE_PLAYLIST_PREVIEW":

	    let playlists_to_check = state.searchResultsPlaylists.playlists.slice();

	    let done_playlists_to_check = playlists_to_check.map((playlist, index) => {

				if (playlist.url_id === action.url_id) {

					let newPlaylist = playlist;

					if (newPlaylist.thumbnail_medium !== action.firstVideo.thumbnail_medium) {

						newPlaylist.thumbnail_default = action.firstVideo.thumbnail_default;
						newPlaylist.thumbnail_medium = action.firstVideo.thumbnail_medium;
						newPlaylist.thumbnail_high = action.firstVideo.thumbnail_high;

						return newPlaylist;


					}

					else {

						return playlist;

					}
				
					

				}

				else {

					return playlist;

				}


		}).sort((x, y) => {

    				return new Date(y.updated_at) - new Date(x.updated_at);

			});

      return {...state, searchResultsPlaylists: {length: done_playlists_to_check.length, playlists: done_playlists_to_check}}
      case "UPDATE_NUMBER_OF_VIDEOS":
		
	    let updatedItems = state.searchResultsPlaylists.playlists.map((item, index) => {

			if (action.index === item.url_id) {

			let updatedItem = item;
			    updatedItem.numberofvideos = action.numberofvideos;
			    updatedItem.numberofwatchedvideos = action.watchedVideos;
		            updatedItem.ran = true;

				return updatedItem;

			}

			else {
				item.ran = true;
				return item;

			}


		}).sort((x, y) => {

    				return y.updated_at - x.updated_at;

			});

		
 	return { ...state, searchResultsPlaylists: {length: updatedItems.length, playlists: updatedItems}};
      case "UPDATE_NUMBER_OF_VIDEOS_PUBLIC":
		
	    let updatedItems_public = state.publicPlaylists.playlists.map((item, index) => {

			if (action.index === item.url_id) {

			let updatedItem = item;
			    updatedItem.numberofvideos = action.numberofvideos;
		            updatedItem.ran = true;

				return updatedItem;

			}

			else {
				item.ran = true;
				return item;

			}


		}).sort((x, y) => {

    				return y.updated_at - x.updated_at;

			});

		
 	return { ...state, publicPlaylists: {length: updatedItems_public.length, playlists: updatedItems_public}};
      case 'UPDATE_PLAYLISTS_RESULT':

		let newResultItem = state.searchResultsPlaylists.playlists.slice();

		let updatedArray = newResultItem.map((item, index) => {

		let newItem = item;
		
			if (action.title) {

				if (action.index === item.url_id) {

					newItem.title = action.title;
					newItem.updated_at = new Date();

					return newItem;
					
				}

				else {

					return item;
	
				}

			}

			else if (action.description) {

				
				if (action.index === item.url_id) {

					newItem.description = action.description;
					newItem.updated_at = new Date();
					return newItem;
					
				}

				else {

					return item;
	
				}
			}

			else if (action.category) {

				if (action.index === item.url_id) {

					newItem.category = action.category;
					newItem.updated_at = new Date();
					return newItem;
					
				}

				else {

					return item;
	
				}

			}

			else if (action.public) {

				if (action.index === item.url_id) {

					newItem.public = action.newValue;
					newItem.updated_at = new Date();
					return newItem;
					
				}

				else {

					return item;
	
				}

			}

			else if (action.delete) {


				if (action.index === item.url_id) {

					newItem.numberofvideos--;
				
					if (newItem.watched === "yes") {


						newItem.numberofwatchedvideos--;

					}
					
					return newItem;
					
				}

				else {

					return item;
	
				}
			

			}

			else if (action.add) {


				if (action.index === item.url_id) {

					newItem.numberofvideos++;
					
					return newItem;
					
				}

				else {

					return item;
	
				}
			

			}

			else if (action.watched) {

				if (action.index === item.url_id) {

					newItem.numberofwatchedvideos++;
					
					return newItem;
					
				}

				else {

					return item;
	
				}

			}


			else {


				return item;

			}

		}).sort((x, y) => {

    				return new Date(y.updated_at) - new Date(x.updated_at);

			});

		
        return { ...state, searchResultsPlaylists: {length: updatedArray.length, playlists: updatedArray}};
      case 'LOGIN_ACTION':
        return { ...state, login: action.login};
	      case 'MORE_WAITING':
		
        return { ...state, searchResults: {...state.searchResults, moreWaiting: true}};
	      case 'MORE_WAITING_PUBLIC':
		
        return { ...state, public: {...state.public, moreWaiting: true}};
		case 'PUBLIC_ACTION':
		
	return {...state, publicPlaylists: {length: action.playlists.length, playlists: action.playlists}, public: {globalReason: action.globalReason, form: action.form, page: action.page, waiting: action.waiting, scope: "public", moreWaiting: action.moreWaiting, onepage: action.onepage, ran: action.ran, search: action.search, reason: action.reason, nextPage: action.nextPage}};
	  case 'CLEAR_VIDEO':
		return {...state, playlistVideos: {length: 0, videos: [], newadded: action.newadded}};
	case 'CLEAR_EDITOR':
		return {...state, editorVideos: {videos: [], length: 0}};
	case 'CLEAR_PLAYER':
		return {...state, playerVideos: {videos: [], length: 0}};
      case 'ADD_VIDEO':

        let allVideos = state.playlistVideos.videos.slice();

		if (allVideos.length === 0) {

			allVideos.push(action.playlistVideos);			

		}

		let found = false;

		for (let i = 0; i < allVideos.length; i++) {


			if (action.playlistVideos.info.contentDetails) {

			if (allVideos[i].info.id.videoId === action.playlistVideos.info.contentDetails.videoId) {

				found = true;
				break;

			

			}

				if (allVideos[i].info.contentDetails) {

					if (allVideos[i].info.contentDetails.videoId === action.playlistVideos.info.contentDetails.videoId) {

						found = true;
						break;


					}
				

				}


			}

			if (!action.playlistVideos.info.contentDetails) {


				if (allVideos[i].info.id.videoId === action.playlistVideos.info.id.videoId) {

					found = true;
					break;

				}


			}

		}

		if (!found) {

		    allVideos.push(action.playlistVideos);			

		}

        return {...state, playlistVideos: {length: allVideos.length, videos: allVideos}};
      case 'ADD_VIDEO_EDITOR':

	let editor_videos = state.editorVideos.videos.slice();
	let new_total = state.editorVideos.total;

		if (editor_videos.length === 0) {

			 editor_videos.push(action.video);
			 new_total++;		

		}

		let found2 = false;

		for (let i = 0; i < editor_videos.length; i++) {

			if (editor_videos[i].videoId === action.video.videoId) {

				found2 = true;
				break;

			}

		}

		if (!found2) {

		     editor_videos.push(action.video);	
			new_total++;	

		}

	
	
  
        return {...state, editorVideos: {videos: editor_videos, length: editor_videos.length, total: new_total, nextPage: state.editorVideos.nextPage, onepage: state.editorVideos.onepage},};
      case 'REMOVE_VIDEO':

          let videos = state.playlistVideos.videos;
          
          let filteredVideos = videos.filter((data, index) => {

            return index !== action.index;

              });

        return {...state, playlistVideos: {length: filteredVideos.length, videos: filteredVideos}};
      case 'ADD_NEW_PUBLIC_SEARCH_RESULT':

          let old_playlists2 = state.publicPlaylists.playlists.slice();
  
			action.playlists.forEach((playlist) => {

				old_playlists2.push(playlist);

			}); 

        return {...state, public: {...state.public, nextPage: action.nextPage, page: action.page, waiting: action.waiting, onepage: action.onepage, moreWaiting: action.moreWaiting}, publicPlaylists: {length: old_playlists2.length, playlists: old_playlists2}};
case 'ADD_NEW_SEARCH_RESULT':

          let old_playlists = state.searchResultsPlaylists.playlists.slice();
  
			action.playlists.forEach((playlist) => {

				old_playlists.push(playlist);

			});

        return {...state, searchResults: {form: state.searchResults.form, moreWaiting: action.moreWaiting, page: state.searchResults.page, waiting: false, scope: state.searchResults.scope, onepage: action.onepage, ran: state.searchResults.ran, search: state.searchResults.search, nextPage: action.nextPage, reason: state.searchResults.reason}, searchResultsPlaylists: {length: old_playlists.length, playlists: old_playlists}};
      case 'REMOVE_SEARCH_RESULT':

          let sr_playlists = state.searchResultsPlaylists.playlists;
          
          let residual_playlists = sr_playlists.filter((data) => {
		
	   
            		return data.url_id !== action.url_id;

              });

	let newTotal = state.searchResults.page.total - 1;

        return {...state, searchResults: {moreWating: state.searchResults.moreWaiting, page: {total: newTotal}, waiting: false, scope: state.searchResults.scope, onepage: state.searchResults.onepage, ran: state.searchResults.ran, search: state.searchResults.search, nextPage: state.searchResults.nextPage, reason: state.searchResults.reason}, searchResultsPlaylists: {length: residual_playlists.length, playlists: residual_playlists}};
 case 'REMOVE_VIDEO_EDITOR':

          let videos_remove_editor = state.editorVideos.videos;
	  let neweditortotal = state.editorVideos.total - 1;
          
          let filteredVideos_remove_editor = videos_remove_editor.filter((data, index) => {

            return index !== action.index;

              });

        return {...state, editorVideos: {total: neweditortotal, onepage: state.editorVideos.onepage, lastPage: state.editorVideos.lastPage, length: filteredVideos_remove_editor.length, videos: filteredVideos_remove_editor}};
      case 'DRAG_DROP':

      return {...state, dragDrop: {videoBeingOverEd: action.overed, videoBeingDragged: action.dragged}};
case 'DRAG_DROP_EDITOR':

      return {...state, dragDropEditor: {videoBeingOverEd: action.overed, videoBeingDragged: action.dragged}};
	  case 'ORDER_VIDEO':
		
		let videos2 = state.playlistVideos.videos.slice();
		let firstVideo = videos2[action.index1.index];
			videos2[action.index1.index] = videos2[action.index2.index];
			videos2[action.index2.index] = firstVideo;

			
	  return {...state,  playlistVideos: {length: state.playlistVideos["length"] + 1, videos: videos2}};
	case 'ORDER_VIDEO_EDITOR':

		let firstVideo_editor = state.editorVideos.videos[action.index1.index].order;
		let secondVideo_editor = state.editorVideos.videos[action.index2.index].order;

		let videos_editor = state.editorVideos.videos.map((video, index) => {

				if (index === action.index1.index) {
				
					let newOrder = video;
					    newOrder.order = secondVideo_editor;

					return newOrder;
			

				}

				else if (index === action.index2.index) {
				
					let newOrder = video;
					    newOrder.order = firstVideo_editor;
					
					return newOrder;

				}

				else { 

					return video;


				 }
		


		});

		let videos_editor_fixed = videos_editor.slice();
		let firstVideo_editor_fixed = videos_editor_fixed[action.index1.index];
			videos_editor_fixed[action.index1.index] = videos_editor_fixed[action.index2.index];
			videos_editor_fixed[action.index2.index] = firstVideo_editor_fixed;
	
		
	  return {...state,  editorVideos: {total: state.editorVideos.total, nextPage: state.editorVideos.nextPage, onepage: state.editorVideos.onepage, playlist: state.editorVideos.playlist, length: state.editorVideos["length"] + 1, videos: videos_editor_fixed}};
	  case 'SEARCH_ACTION':
	
        return {...state, searchResultsPlaylists: {length: action.playlists.length, playlists: action.playlists}, searchResults: {form: action.form, page: action.page, moreWaiting: action.moreWaiting, waiting: action.waiting, scope: "user", onepage: action.onepage, ran: action.ran, search: action.search, reason: action.reason, nextPage: action.nextPage}};
	case 'FIRE_EDITOR':

			let id;

			if (action.url_id) {

				id = action.url_id;

			}	

			if (!action.url_id) {

				id = state.editor.url_id;

			}		

			return {...state, bugFixed: true, editor: {status: action.status, url_id: id}};
	case 'FIRE_PLAYER':
			let id2;

			if (action.url_id) {

				id2 = action.url_id;

			}	

			if (!action.url_id) {

				id2 = state.editor.url_id;

			}

	return {...state, player: {status: action.status, url_id: id2, scope: action.scope}};	
	case 'OPEN_EDITOR':

			let videosToPush = state.editorVideos.videos.slice();
			
			action.videos.forEach((video) => {

				videosToPush.push(video);

			});

			return {...state, editorVideos: {total: action.total, videos: videosToPush, length: videosToPush.length, nextPage: action.nextPage, onepage: action.onepage}};
      default:
        return state;
    }
};

export default enter;
