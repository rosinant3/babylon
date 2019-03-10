const articleModel = require('./models/article-model');
const uuidv1 = require('uuid/v1');

const articleControllers = {};

articleControllers.editController = function editController(req, res, next) {
  
		let body = req.body;
		let user = body.user;
		let reason = body.reason;
		let url_id = body.url_id;

		if (reason === "remove_article") {

			let removeArticle = articleModel.removeArticle(user, url_id);

			removeArticle.then((row) => {

				res.send({removed: row});

			})
			.catch((e) => { console.log(e); });


		}
     
		if (reason === "title") {

			let title = body.title;

			let editArticleTitle = articleModel.editArticleTitle(user, url_id, title);

			editArticleTitle.then((row) => {

				res.send({edited: row});

			})
			.catch((e) => { console.log(e) });


		}

		if (reason === "category") {

			let category = body.category;

			let editArticleCategory = articleModel.editArticleCategory(user, url_id, category);

			editArticleCategory.then((row) => {

				res.send({edited: row});

			})
			.catch((e) => { console.log(e) });


		}

		if (reason === "thumbnail") {

			let thumbnail = body.thumbnail;

			let editArticleThumbnail = articleModel.editArticleThumbnail(user, url_id, thumbnail);

			editArticleThumbnail.then((row) => {
  
				res.send({edited: row});

			})
			.catch((e) => { console.log(e) });


		}
   
		if (reason === "isPublic") {

			let isPublic = body.isPublic;

			let editArticleIsPublic = articleModel.editArticleIsPublic(user, url_id, isPublic );

			editArticleIsPublic.then((row) => {

				res.send({edited: row});

			}).catch((e) => { console.log(e) });


		}
    
		if (reason === "remove_comment") {

			let commentId = body.commentId;

			let removeOneComment = articleModel.removeOneComment(user, url_id, commentId);
 
			removeOneComment.then((row) => {

				res.send({ removed: row });

			})
			.catch((e) => { console.log(e); });

		}

		if (reason === "edit_comment") {

			let commentId = body.commentId;
			let comment = body.comment.trim(); 
			
			if (comment === "" || comment.length > 5000) {

				
				res.send({ commentError: true });
			

			}			

			let editOneComment = articleModel.editOneComment(user, url_id, commentId,comment);
 
			editOneComment.then((row) => {

				res.send({ updated: row });

			})
			.catch((e) => { console.log(e); });

		}

};

articleControllers.addController = function addController(req, res, next) {

		let reason = req.body.reason;
		let user = req.body.user;

	if (reason === "article") {

		 let isPublic = req.body.isPublic;
		 let title = req.body.title.trim();
		 let link = req.body.link.trim();
		 let thumbnail = req.body.thumbnail.trim()
		 let category = req.body.category.trim();
		 let url_id = uuidv1();
		 let expression = `(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})`;
		 let imageExpression =  /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/;
		 let regex = new RegExp(expression);
		 let imageRegex = new RegExp(imageExpression);

		if (title === "" || title.length > 255) {

			res.send({titleError: true});

		}

		if (category === "" || category.length > 255) {

			res.send({categoryError: true});

		}

		else if (link === "" || link.length > 5000 || !regex.test(link)) {

			res.send({linkError: true});

		}

		else if (link === "" || link.length > 5000 || !imageRegex.test(thumbnail)) {

			res.send({thumbnailError: true});

		}

		else {

			let items = {

				title: title,
				link: link,
				url_id: url_id,
				user: user,
				category: category,
				thumbnail: thumbnail,
				isPublic: isPublic

			}

			let addArticle = articleModel.addArticle(items);

			addArticle.then((row) => {

				res.send({id: row});

			}).catch((e) => { console.log(e); });
			
		}

	}

	if (reason === "comment") {
  
		let comment = req.body.comment;
		let url_id = req.body.url_id;
		let items = {};
		    items.comment = comment;
		    items.url_id = url_id;
		    items.user = user;

		if (comment === "" || comment.length > 500) {

			res.send({textAreaError: true});

		}

		else {

			let addComment = articleModel.addComment(items);

			addComment.then((row) => {

				res.send({ added: row });
		

			}).catch((e) => { console.log(e); });

		}

	}	

};

articleControllers.getController = function getController(req, res, nex) {

		let reqData = req.body;
		let user = reqData.user;
		let scope = reqData.scope;
		let reason = reqData.reason;

    		let pagination = {page: {}};

    		let per_page = reqData.per_page || 5;
    		let page = reqData.current_page || 1;
    		if (page < 1) page = 1;
    		let offset = (page - 1) * per_page;
		

		if ( reason === "all" && scope === "user") {
	 
			let countArticles = articleModel.countArticles(user);
			let getArticles = articleModel.getArticles(user, {offset: offset, per_page: per_page});

			countArticles.then((count2) => {
			
				let count = count2[0]["count(*)"];

				pagination.page.total = count;
				pagination.page.per_page = per_page;
				pagination.page.offset = offset;
				pagination.page.current_page = page;
				pagination.page.from = offset;

				getArticles.then((rows) => {
 
					pagination.page.to = offset + rows.length;
					pagination.page.last_page = Math.ceil(count / per_page);
					pagination.data = rows;

					return res.send(pagination);

				}).catch((e) => {console.log(e)});



			}).catch((e) => { console.log(e); });




		}


		if ( reason === "title" && scope === "user") {
			
			let title = req.body.search.trim();

			let countArticles = articleModel.countArticlesTitle(user, title);
			let getArticles = articleModel.getArticlesTitle(user, title, {offset: offset, per_page: per_page});

			countArticles.then((count2) => {
			
				let count = count2[0]["count(*)"];

				pagination.page.total = count;
				pagination.page.per_page = per_page;
				pagination.page.offset = offset;
				pagination.page.current_page = page;
				pagination.page.from = offset;

				getArticles.then((rows) => {

					pagination.page.to = offset + rows.length;
					pagination.page.last_page = Math.ceil(count / per_page);
					pagination.data = rows;

					res.send(pagination);

				}).catch((e) => {console.log(e)});



			}).catch((e) => { console.log(e); });


		}


		if ( reason === "category" && scope === "user") {

			let category = req.body.search.trim();

			let countArticles = articleModel.countArticlesCategory(user, category);
			let getArticles = articleModel.getArticlesCategory(user, category, {offset: offset, per_page: per_page});

			countArticles.then((count2) => {
			
				let count = count2[0]["count(*)"];

				pagination.page.total = count;
				pagination.page.per_page = per_page;
				pagination.page.offset = offset;
				pagination.page.current_page = page;
				pagination.page.from = offset;

				getArticles.then((rows) => {
 
					pagination.page.to = offset + rows.length;
					pagination.page.last_page = Math.ceil(count / per_page);
					pagination.data = rows;

					res.send(pagination);

				}).catch((e) => { console.log(e); });



			}).catch((e) => { console.log(e); });

		}

		if ( reason === "all" && scope === "public") {
	
			let countArticles = articleModel.countAllArticlesPublic(user);
			let getArticles = articleModel.getAllArticlesPublic(user, {offset: offset, per_page: per_page});


			countArticles.then((count2) => {
			
				let count = count2[0]["count(*)"];

				pagination.page.total = count;
				pagination.page.per_page = per_page;
				pagination.page.offset = offset;
				pagination.page.current_page = page;
				pagination.page.from = offset;

				getArticles.then((rows) => {
 
					pagination.page.to = offset + rows.length;
					pagination.page.last_page = Math.ceil(count / per_page);
					pagination.data = rows;

					return res.send(pagination);

				}).catch((e) => {console.log(e)});



			}).catch((e) => { console.log(e); });




		}


		if ( reason === "title" && scope === "public") {
			
			let title = req.body.search.trim();

			let countArticles = articleModel.countPublicArticlesTitle(user, title);
			let getArticles = articleModel.getPublicArticlesTitle(user, title, {offset: offset, per_page: per_page});

			countArticles.then((count2) => {
			
				let count = count2[0]["count(*)"];

				pagination.page.total = count;
				pagination.page.per_page = per_page;
				pagination.page.offset = offset;
				pagination.page.current_page = page;
				pagination.page.from = offset;

				getArticles.then((rows) => {

					pagination.page.to = offset + rows.length;
					pagination.page.last_page = Math.ceil(count / per_page);
					pagination.data = rows;

					res.send(pagination);

				}).catch((e) => {console.log(e)});



			}).catch((e) => { console.log(e); });


		}


		if ( reason === "category" && scope === "public") {

			let category = req.body.search.trim();

			let countArticles = articleModel.countPublicArticlesCategory(user, category);
			let getArticles = articleModel.getPublicArticlesCategory(user, category, {offset: offset, per_page: per_page});

			countArticles.then((count2) => {
			
				let count = count2[0]["count(*)"];

				pagination.page.total = count;
				pagination.page.per_page = per_page;
				pagination.page.offset = offset;
				pagination.page.current_page = page;
				pagination.page.from = offset;

				getArticles.then((rows) => {
 
					pagination.page.to = offset + rows.length;
					pagination.page.last_page = Math.ceil(count / per_page);
					pagination.data = rows;

					res.send(pagination);

				}).catch((e) => { console.log(e); });



			}).catch((e) => { console.log(e); });

		}		
		

		if (reason === "url") {

			let url_id = req.body.url_id;

			let getArticleBasedOnUrl = articleModel.getArticleBasedOnUrl(user, url_id);

			getArticleBasedOnUrl.then((row) => {

				res.send(row);



			}).catch((e) => { console.log(e); });





		}

		if ( reason === "comments" ) {

			let url_id = req.body.url_id;

			let countArticleComments = articleModel.countArticleComments(url_id);
			let getArticleComments = articleModel.getArticleComments(url_id, {offset: offset, per_page: per_page});


			countArticleComments.then((count2) => {

				let count = count2[0]["count(*)"];
   
				pagination.page.total = count;
				pagination.page.per_page = per_page;
				pagination.page.offset = offset;
				pagination.page.current_page = page;
				pagination.page.from = offset;

				getArticleComments.then((rows) => {

					pagination.page.to = offset + rows.length;
					pagination.page.last_page = Math.ceil(count / per_page);
					pagination.data = rows;

					res.send(pagination);

				}).catch((e) => { console.log(e); });

			});

		}

};
  
module.exports = articleControllers;
