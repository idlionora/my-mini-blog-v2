import fetchExploreCards from '@scripts/fetchExploreCards';

const blogpostArticle = document.getElementById('blogpost-article');
const currentBlogId = blogpostArticle?.dataset.blogid;
const tagList = document.getElementById('tag-list');
const tagString = tagList?.dataset.tags;
const expCardContainer = document.getElementById('explore-card-container');
const exploreFetchMesage = document.getElementById('explore-fetch-message');

fetchExploreCards({
	tagString,
	excludedId: currentBlogId,
	cardContainer: expCardContainer,
	fetchingMessage: exploreFetchMesage,
});
