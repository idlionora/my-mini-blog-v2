import axios, { AxiosError } from "axios";
import commentCard, {type CommentCardInput} from "@scripts/commentCard";
import { commentTextarea } from "@scripts/commentCardInsert";

interface CommentBlogpostInfo {
    _id: string;
    title: string;
    user: {_id: string, name: string};
}

export interface CommentData {
    _id: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
    blogpost: CommentBlogpostInfo;
    user: {_id: string, name: string, photo: string}
}

const cancelEditComment = (index: number, commentId: string) => {
	console.log("cancel button is clicked!!")
};

const confirmEditComment = (index: number, commentId: string) => {
	console.log("confirm button is clicked!!")
};

export const deleteComment = (index: number, commentId: string) => {
	console.log("delete button is clicked!!")
}

export const insertCommentTextarea = (index: number, commentId: string) => {
	document.getElementById(`button-edit-${index}`)?.removeEventListener('click', () => insertCommentTextarea(index, commentId));
	document
		.getElementById(`button-delete-${index}`)
		?.removeEventListener('click', () => deleteComment(index, commentId));

	const commentTextbox = document.getElementById(`comment-textbox-${index}`);
	const savedComment = commentTextbox?.dataset.savedcomment || '';
	commentTextbox!.className = 'commentcard-textbox edit';

	const textareaInsert = commentTextarea(index, commentId);
	const parsedInsert = new DOMParser().parseFromString(textareaInsert, 'text/html').body;
	commentTextbox!.innerHTML = parsedInsert.innerHTML;
	const insertedTextarea = document.getElementById(`comment-textarea-${index}`) as HTMLTextAreaElement;
	insertedTextarea.value = savedComment;

	document.getElementById(`comment-cancel-${index}`)?.addEventListener('click', () => cancelEditComment(index, commentId));
	document.getElementById(`comment-confirm-${index}`)?.addEventListener('click', () => confirmEditComment(index, commentId));
}

export async function switchToTabNum(commentClass:CommentSection, newTabNum:number) {
	document.getElementById('pagination-first')?.removeEventListener('click', () => switchToTabNum(commentClass, 1));
	document
		.getElementById('pagination-last')
		?.removeEventListener('click', () =>
			switchToTabNum(commentClass, commentClass.commentTabNum)
		);
    commentClass.loadTabNum(newTabNum);
    document.getElementById('pagination-first')?.addEventListener('click', () => switchToTabNum(commentClass, 1));
    document
		.getElementById('pagination-last')
		?.addEventListener('click', () => switchToTabNum(commentClass, commentClass.commentTabNum));
    //add eventListener for edit and delete button    
}

class CommentSection {
	protected blogId: string;
	paginationContainer: HTMLElement;
	paginationNumContainer: HTMLElement;
	commentContainer: HTMLElement;

	protected fetchedComments: CommentData[] = [];
	commentNumPerTab: number = 5;
	commentTabNum: number = 1;
	currentTab: number = 1;
	protected loggedinUserId: string;

	constructor(
		blogId: string,
		paginationContainer: HTMLElement,
		commentContainer: HTMLElement,
		loggedinUserId: string
	) {
		this.blogId = blogId;
		this.paginationContainer = paginationContainer;
		this.paginationNumContainer = paginationContainer.children[1] as HTMLElement;
		this.commentContainer = commentContainer;
		this.loggedinUserId = loggedinUserId;
	}

	async fetchComments() {
		try {
			const res = await axios.get(
				`${import.meta.env.PUBLIC_APISITE}/blogposts/${this.blogId}/comments`
			);
			const fetchedComments = res.data.data;
			this.fetchedComments = fetchedComments;
			this.commentTabNum = Math.ceil(fetchedComments.length / this.commentNumPerTab);
		} catch (error) {
			const err = error as AxiosError;
			console.log(err.message);
		}
	}

	displayPageNums() {
		const pagesArr: string[] = [];
		const firstTab = '<button id="pagination-first" class="button-pagination">1</button>';
		const currentTab = `<button id="pagination-selected" class="button-pagination-selected">${this.currentTab}</button>`;
		const lastTab = `<button id="pagination-last" class="button-pagination">${this.commentTabNum}</button>`;
		const dotsTab = '<div class="button-pagination-dots">...</div>';

		if (this.currentTab !== 1) pagesArr.push(firstTab);
		if (this.currentTab > 2) pagesArr.push(dotsTab);
		pagesArr.push(currentTab);
		if (this.commentTabNum - 1 > this.currentTab) pagesArr.push(dotsTab);
		if (this.commentTabNum > this.currentTab) pagesArr.push(lastTab);

		const parsedTabs = new DOMParser().parseFromString(pagesArr.join(''), 'text/html').body;
		this.paginationNumContainer.innerHTML = parsedTabs.innerHTML;
	}

	assignDisabledButtons() {
		const numContainerLength = this.paginationNumContainer.children.length;
		if (this.currentTab === 1) {
			this.paginationContainer.children[0].setAttribute('disabled', '');
			this.paginationNumContainer.children[0].setAttribute('disabled', '');
		} else {
			this.paginationContainer.children[0].removeAttribute('disabled');
		}

		if (this.currentTab === this.commentTabNum) {
			this.paginationContainer.children[2].setAttribute('disabled', '');
			this.paginationNumContainer.children[numContainerLength - 1].setAttribute(
				'disabled',
				''
			);
		} else {
			this.paginationContainer.children[2].removeAttribute('disabled');
		}
	}

	displayComments() {
		const commentsInTab = this.fetchedComments.slice(
			this.commentNumPerTab * (this.currentTab - 1),
			this.commentNumPerTab * this.currentTab
		);
		const commentInsert = commentsInTab.map((commentData: CommentData, index: number) => {
			const { _id, comment, createdAt, user } = commentData;
			const cardData: CommentCardInput = {
				commentId: _id,
				commentUserName: user.name,
				commentUserPhoto: user.photo,
				commentDate: createdAt,
				commentString: comment,
				isLoggedIn: this.loggedinUserId === user._id,
			};
			return commentCard(cardData, index)
		});
		const parsedCards = new DOMParser().parseFromString(commentInsert.join(''), "text/html").body;
		this.commentContainer.innerHTML = parsedCards.innerHTML;
	}

	async buildPagination(tabJump: 'first' | 'last' = 'first') {
		await this.fetchComments();
		if (tabJump === 'first') {
			this.currentTab = 1;
		} else if (tabJump === 'last') {
			this.currentTab = this.commentTabNum;
		}
		this.displayPageNums();
		this.assignDisabledButtons();
		this.displayComments();
	}

	loadTabNum(newTabNum: number) {
		this.currentTab = newTabNum;
		this.displayPageNums();
		this.assignDisabledButtons();
		this.displayComments()
	}
}

export default CommentSection;
