import fetchExploreCards from '@scripts/fetchExploreCards';

try {
	const errorMessage = document.getElementById('main-container')?.dataset.errormessage;
	if (errorMessage) {
		throw Error('Something went wrong!');
	}

	const currentBlogId = document.getElementById('blogpost-article')?.dataset.blogid;
	const tagString = document.getElementById('tag-list')?.dataset.tags;
	const expCardContainer = document.getElementById('explore-card-container');
	const exploreFetchMesage = document.getElementById('explore-fetch-message');
	
	fetchExploreCards({
		tagString,
		excludedId: currentBlogId,
		cardContainer: expCardContainer,
		fetchingMessage: exploreFetchMesage,
	});
} catch {}
