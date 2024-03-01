export interface ExploreCardData {
	title: string;
	blogthumbImg: string;
	content: string;
	slug: string;
}

interface ExploreCardResponse {
	cardData: ExploreCardData;
	index: number;
}

const exploreCard = ({ cardData, index }: ExploreCardResponse) => {
	const { blogthumbImg, title, content, slug } = cardData;

	const parsedTitle = new DOMParser().parseFromString(title, 'text/html').body.innerText;
	const parsedContent = new DOMParser().parseFromString(content.slice(0, 150), 'text/html').body.innerText;

	return `<a href="/blogs/${slug}" class="explore-card-main"><div class="explore-image-container"><img src="${import.meta.env.PUBLIC_IMG_HOST}${blogthumbImg}" alt="thumbnail ${index}" class="object-scale-down"/></div><div class="explore-text-container"><h3 class="explore-title">${parsedTitle}</h3><p class="explore-text">${parsedContent}</p></div></a>`;
};

export default exploreCard;
