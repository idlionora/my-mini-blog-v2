function parseHTMLFromCollection(elements: HTMLCollection) {
	const elementsArr = Array.prototype.slice.call(elements);
	const parsedElementsArr: HTMLElement[] = [];

	elementsArr.forEach((element) => {
		parsedElementsArr.push(
			new DOMParser().parseFromString(element.innerText, 'text/html').body
		);
	});

	const elementsLength = elementsArr.length;
	for (let i = 0; i < elementsLength; i++) {
		elements[i].innerHTML = parsedElementsArr[i].innerHTML;
	}
}

export default parseHTMLFromCollection;
