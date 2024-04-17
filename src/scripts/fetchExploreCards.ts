import axios, { AxiosError } from 'axios';
import exploreCard, { type ExploreCardData } from '@scripts/exploreCard';
import shuffleArray from '@scripts/shuffleArray';

interface BlogsKeyForExploreCards {
	tagString: string | undefined;
	excludedId: string | undefined;
	cardContainer: HTMLElement | null;
	fetchingMessage: HTMLElement | null;
}

async function mapExploreCards(
	idArr: string[],
	cardContainer: HTMLElement | null,
	fetchingMessage: HTMLElement | null
) {
	const res2 = await axios.get(
		`${import.meta.env.PUBLIC_APISITE}/blogposts/?fields=title,blogthumbImg,content,slug&_id=${idArr.join()}`
	);
	const cardsData = res2.data.data;
	const cardsInsert = cardsData.map((cardData: ExploreCardData, index: number) => {
		return exploreCard({ cardData, index });
	});
	const parsedCards = new DOMParser().parseFromString(cardsInsert.join(''), 'text/html').body;
	
	fetchingMessage!.className = fetchingMessage!.className.replace('flex', 'hidden');
	cardContainer!.innerHTML = parsedCards.innerHTML;

}

async function fetchExploreCards({
	excludedId,
	tagString,
	cardContainer,
	fetchingMessage,
}: BlogsKeyForExploreCards) {
	try {
		fetchingMessage!.className = fetchingMessage!.className.replace('hidden', 'flex');

		if (!tagString) {
			fetchingMessage!.innerText = 'No related post available.';
			return;
		}

		const res = await axios.get(`${import.meta.env.PUBLIC_APISITE}/tags/?tag=${tagString}`);
		const resData = res.data.data;
		let blogpostIds = resData
			.map((tagData: { _id: string; tag: string; blogposts: string[] }) => tagData.blogposts)
			.flat();
		blogpostIds = blogpostIds.filter(
			(value: string, index: number, array: string[]) => array.indexOf(value) === index
		);
		blogpostIds.splice(blogpostIds.indexOf(excludedId), 1);

		if (blogpostIds.length < 1) {
			fetchingMessage!.innerText = 'No related post available.';
			return;
		} else if (blogpostIds.length < 6) {
			await mapExploreCards(blogpostIds, cardContainer, fetchingMessage);
			return;
		}

		const shuffledIds = shuffleArray<string>(blogpostIds);
		await mapExploreCards(shuffledIds, cardContainer, fetchingMessage);
	} catch (error) {
		const err = error as AxiosError;
		console.log(err.message);
		fetchingMessage!.innerText = 'Related posts are unable to load';
	}
}

export default fetchExploreCards;
