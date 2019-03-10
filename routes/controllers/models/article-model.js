const knex = require('knex')(require('../../../knexfile'));

const articleModel = {};

articleModel.getPublicArticlesCategory = function getPublicArticlesCategory(user, search, pag) {
		  
						let search2 = `%${search}%`;
		  
						return knex('articles')
									.join( 'user', function(builder) {
										
										builder.on("articles.user", "=", "user.id");
										
									}).select('articles.thumbnail', 'articles.title', 'articles.category', 'articles.link', 'articles.url_id', 'articles.public', 'articles.user', 'user.username').where("articles.public", "=", 1)
									.where("articles.category", "like", search2)
									.offset(pag.offset).limit(pag.per_page).orderBy('articles.updated_at', 'desc');
									
		};
		
articleModel.countPublicArticlesCategory = function countPublicArticlesCategory(user, search) {
		  
							let search2 = `%${search}%`;
		  
						return knex('articles').where({"articles.user": user})
							.andWhere("articles.category", "like", search2).count();
									
		};

articleModel.getPublicArticlesTitle = function getPublicArticlesTitle(user, search, pag) {
		  
						let search2 = `%${search}%`;
		  
						return knex('articles')
									.join( 'user', function(builder) {
										
										builder.on("articles.user", "=", "user.id");
										
									}).select('articles.thumbnail', 'articles.title', 'articles.category', 'articles.link', 'articles.url_id', 'articles.public', 'articles.user', 'user.username').where("articles.public", "=", 1)
									.where("articles.title", "like", search2)
									.offset(pag.offset).limit(pag.per_page).orderBy('articles.updated_at', 'desc');
									
		};
		
articleModel.countPublicArticlesTitle = function countPublicArticlesTitle(user, search) {
		  
							let search2 = `%${search}%`;
		  
						return knex('articles').where({"articles.user": user})
							.andWhere("articles.title", "like", search2).count();
									
		};

articleModel.getAllArticlesPublic = function getAllArticlesPublic(user, pag) {

			return knex('articles').join( 'user', function(builder) {
										
										builder.on("articles.user", "=", "user.id");
										
									}).select('articles.thumbnail', 'articles.title', 'articles.category', 'articles.link', 'articles.url_id', 'articles.public', 'articles.user', 'user.username').where("articles.public", "=", 1).offset(pag.offset).limit(pag.per_page).orderBy('articles.updated_at', 'desc');



};

articleModel.countAllArticlesPublic = function countAllArticlesPublic(user) {

					return  knex('articles').count().where("articles.public", "=", 1);
									
};

articleModel.removeArticle = function removeArticle(user, url_id) {

			return knex("articleComments").where("articleComments.article", "=", url_id).andWhere("articleComments.user", "=", user).del().then((row1) => {

		return knex("articles").where("articles.url_id", "=", url_id).andWhere("articles.user", "=", user).del();

}).catch(() => { console.log(e) });


};

articleModel.editOneComment = function editOneComment(user, url_id, commentId, comment) {

				return knex("articleComments").where("articleComments.id", "=", commentId).andWhere("articleComments.article", "=", url_id).andWhere("articleComments.user", "=", user).update({"articleComments.comment": comment, "articleComments.updated_at": new Date()});

};
   

articleModel.removeOneComment = function removeOneComment(user, url_id, commentId) {

				return knex("articleComments").where("articleComments.id", "=", commentId).andWhere("articleComments.article", "=", url_id).andWhere("articleComments.user", "=", user).del();

};
   
articleModel.countArticleComments = function countArticleComments(url_id) {

				return knex("articleComments").where("articleComments.article", "=", url_id).count();

};

articleModel.getArticleComments = function getArticleComments(url_id, pag) {

			
				return knex("articleComments").join( 'user', function(builder) {
										
										builder.on("articleComments.user", "=", "user.id");
										
									}).select("articleComments.id", "articleComments.comment", "articleComments.user", "articleComments.created_at", "articleComments.updated_at", "user.username").where("articleComments.article", "=", url_id).offset(pag.offset).limit(pag.per_page).orderBy("articleComments.id", "desc");

};

articleModel.addComment = function addComment(items) {
      
		return knex('articleComments').insert({
								 
							comment: items.comment,
							article: items.url_id,
							user: items.user
	
						}).debug();
		
};

articleModel.editArticleIsPublic = function editArticleIsPublic(user, url_id, isPublic) {
   
		return knex('articles').update({"articles.public": isPublic, "articles.updated_at": new Date()}).
					where({url_id: url_id, user: user});
		
};

articleModel.editArticleThumbnail = function editArticleThumbnail(user, url_id, thumbnail) {
 
		return knex('articles').update({"articles.thumbnail": thumbnail, "articles.updated_at": new Date()}).
					where({url_id: url_id, user: user});
		
};

articleModel.editArticleCategory = function editArticleCategory(user, url_id, category) {

		return knex('articles').update({"articles.category": category, "articles.updated_at": new Date()}).
					where({url_id: url_id, user: user});
		
};

articleModel.editArticleTitle = function editArticleTitle(user, url_id, title) {

		return knex('articles').update({"articles.title": title, "articles.updated_at": new Date()}).
					where({url_id: url_id, user: user});
		
};

articleModel.getArticleBasedOnUrl = function getArticleBasedOnUrl(user, url_id) {

			return knex('articles').join( 'user', function(builder) {
										
										builder.on("articles.user", "=", "user.id");
										
									}).select('articles.thumbnail', 'articles.title', 'articles.category', 'articles.link', 'articles.url_id', 'articles.public', 'articles.user', 'user.username').where('articles.url_id', "=", url_id);

};

articleModel.addArticle = function addArticle(items) {
 
		return knex('articles').insert({
								 
							title: items.title,
							link: items.link,
							url_id: items.url_id,
							user: items.user,
							category: items.category,
							thumbnail: items.thumbnail,
							public: items.isPublic
	
						}).debug();
		
};

articleModel.countArticles = function countArticles(user) {

		return knex('articles').where({ "articles.user": user }).count();

};

articleModel.countArticlesTitle = function countArticlesTitle(user, title) {

		let search = `%${title}%`;

		return knex('articles').where({ "articles.user": user }).andWhere("articles.title", "like", search).count();

};

articleModel.countArticlesCategory = function countArticlesCategory(user, category) {

		let search = `%${category}%`;

		return knex('articles').where({ "articles.user": user }).andWhere("articles.category", "like", search).count();

};
 
articleModel.getArticles = function getArticles(user, pag) {

						return knex('articles')
									.join( 'user', function(builder) {
										
										builder.on(user, "=", "user.id");
										
									})
									.select('user.username', 'articles.created_at', 'articles.updated_at', 'articles.url_id', 'articles.title', 'articles.category', 'articles.id', 'articles.thumbnail')
									.offset(pag.offset).limit(pag.per_page).orderBy('articles.updated_at', 'desc').where("articles.user","=", user);


};

articleModel.getArticlesTitle = function getArticlesTitle(user, title, pag) {

		let search = `%${title}%`;

		return knex('articles')
					.join( 'user', function(builder) {
										
										builder.on(user, "=", "user.id");
										
									})
									.select('user.username', 'articles.created_at', 'articles.url_id', 'articles.title', 'articles.category', 'articles.id', 'articles.thumbnail')
									.offset(pag.offset).limit(pag.per_page).orderBy('articles.updated_at', 'desc').where("articles.user","=", user).andWhere("articles.title", "like", search);


};

articleModel.getArticlesCategory = function getArticlesCategory(user, category, pag) {

						let search = `%${category}%`;

						return knex('articles')
									.join( 'user', function(builder) {
										
										builder.on(user, "=", "user.id");
										
									})
									.select('user.username', 'articles.created_at', 'articles.url_id', 'articles.title', 'articles.category', 'articles.id', 'articles.thumbnail')
									.offset(pag.offset).limit(pag.per_page).orderBy('articles.updated_at', 'desc').where("articles.user","=", user).andWhere("articles.category", "like", search);


};


module.exports = articleModel;
