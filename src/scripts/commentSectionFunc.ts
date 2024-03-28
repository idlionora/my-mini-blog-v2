import axios from 'axios';
import CommentSection from '@scripts/commentSectionClass';
import CommentForm from '@scripts/commentFormClass';
import { commentEditArea, commentContent } from '@scripts/commentCard';

// BASIC INFO //
const blogpostArticle = document.getElementById('blogpost-article');
const blogId = blogpostArticle?.dataset.blogid;
type CurrentUserInfo = { id: string; name: string; photo: string; token: string } | undefined;
let commentUserInfo: CurrentUserInfo;

const setUserForComment = () => {
	// get token value and expiration date
	const userJWT = localStorage.getItem('user_jwt');
	if (!userJWT) {
		return;
	}
	const userJWTObj = JSON.parse(userJWT);
	const dateExp = Date.parse(userJWTObj.expires);

	// delete user's data from localStorage if expired
	if (Date.now() > dateExp) {
		localStorage.removeItem('user_jwt');
		localStorage.removeItem('user_info');
		return;
	}

	// get current user info
	const userInfo = localStorage.getItem('user_info');
	if (!userInfo) {
		localStorage.removeItem('user_jwt');
		return;
	}

	// set user's JWT token and info for comment
	const parsedUserInfo = JSON.parse(userInfo);
	commentUserInfo = { ...parsedUserInfo, token: userJWTObj.value };
};
setUserForComment();

// COMMENT FORM FUNCTIONS //
const currentUserImg = document.getElementById('comment-current-userimg');
const currentUserName = document.getElementById('comment-current-username');
const commentTextArea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
const commentCount = document.getElementById('comment-textarea-count');
const commentButton = document.getElementById('comment-textarea-button');

const blogCommentBox = new CommentForm(
	blogId || '',
	currentUserImg!,
	currentUserName!,
	commentTextArea!,
	commentCount!,
	commentButton!
);

async function postComment(blogCommentBox: CommentForm, token: string) {
	if (blogCommentBox.blogId.length < 1) return;

	const message = blogCommentBox.textArea.value;
	try {
		const headers = { Authorization: `Bearer ${token}` };
		await axios.post(
			`${import.meta.env.PUBLIC_APISITE}/blogposts/${blogCommentBox.blogId}/comments`,
			{
				comment: message,
				createdAt: Date.now(),
			},
			{ headers }
		);
		blogCommentBox.textArea.value = '';
		blogCommentBox.commentCount.innerText = '1000';
		reloadCommentSection('last');
	} catch (err) {
		console.log(err);
		alert('Failed to post your comment. Please try again later.');
	}
}

const commentFormInit = (blogCommentBox: CommentForm, commentUserInfo: CurrentUserInfo) => {
	if (!commentUserInfo?.token) {
		blogCommentBox.commentButton.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.replace('/login');
		});
		return;
	} else {
		blogCommentBox.commentButton.addEventListener('click', (e) => {
			e.preventDefault();
			postComment(blogCommentBox, commentUserInfo.token);
		});
	}

	blogCommentBox.userImg.setAttribute(
		'src',
		`${import.meta.env.PUBLIC_IMG_HOST}${commentUserInfo?.photo}`
	);
	blogCommentBox.userName.innerText = commentUserInfo.name;
	blogCommentBox.userName.className = '';
	blogCommentBox.textArea.removeAttribute('disabled');
	blogCommentBox.textArea.addEventListener('input', (e) => blogCommentBox.countCharacters(e));
	blogCommentBox.commentButton.innerText = 'Comment';
};

commentFormInit(blogCommentBox, commentUserInfo);

// COMMENT CARDS FUNCTIONS //
// PAGINATION TABS
const commentContainer = document.getElementById('comment-container');
const paginationContainer = document.getElementById('pagination-container');
const blogComments = new CommentSection(
	blogId!,
	paginationContainer!,
	commentContainer!,
	commentUserInfo?.id || '00'
);

function addPageArrowListeners() {
	blogComments.paginationContainer.children[0].addEventListener('click', switchToPrevTab);
	blogComments.paginationContainer.children[2].addEventListener('click', switchToNextTab);
}

function removePageArrowListeners() {
	blogComments.paginationContainer.children[0].removeEventListener('click', switchToPrevTab);
	blogComments.paginationContainer.children[2].removeEventListener('click', switchToNextTab);
}

function addPageNumListeners() {
	document.getElementById('pagination-first')?.addEventListener('click', switchToFirstTab);
	document.getElementById('pagination-last')?.addEventListener('click', switchToLastTab);
}

function removePageNumListeners() {
	document.getElementById('pagination-first')?.removeEventListener('click', switchToFirstTab);
	document.getElementById('pagination-last')?.removeEventListener('click', switchToLastTab);
}

function switchToPrevTab() {
	switchToTabNum(blogComments.currentTab - 1);
}
function switchToNextTab() {
	switchToTabNum(blogComments.currentTab + 1);
}
function switchToFirstTab() {
	switchToTabNum(1);
}
function switchToLastTab() {
	switchToTabNum(blogComments.commentTabNum);
}

const switchToTabNum = (newTabNum: number) => {
	removePageNumListeners();
	removeCommentButtonListeners();
	blogComments.loadTabNum(newTabNum);
	addPageNumListeners();
	registerButtonListeners();
	addCommentButtonListeners();
};

const reloadCommentSection = async (tabJump: number | 'persist' | 'last' = 1) => {
	removePageArrowListeners();
	removePageNumListeners();
	removeCommentButtonListeners();
	await blogComments.buildPagination(tabJump);
	addPageArrowListeners();
	addPageNumListeners();
	registerButtonListeners();
	addCommentButtonListeners();
};

await blogComments.buildPagination();
addPageArrowListeners();
addPageNumListeners();

// COMMENT CARD BUTTONS
interface CommentListenerObj {
	[keyIndex: string]: () => void;
}
let buttonListeners: CommentListenerObj = {};
let commentButtonBoxes: HTMLElement[];

function registerButtonBoxes() {
	commentButtonBoxes = Array.from(
		document.getElementsByClassName('commentcard-button-box')
	) as HTMLElement[];
}

const registerButtonListeners = () => {
	registerButtonBoxes();
	
	commentButtonBoxes.forEach((buttonBox) => {
		const commentIndex = buttonBox.dataset.commentindex || '';
		const commentId = buttonBox.dataset.commentid || '';
		
		buttonListeners[`edit${commentIndex}`] = () =>
			insertCommentTextarea(commentIndex, commentId);
		buttonListeners[`delete${commentIndex}`] = () =>
			deleteComment(commentId, commentUserInfo!.token);
		buttonListeners[`cancel${commentIndex}`] = () => cancelEditComment(commentIndex, commentId);
		buttonListeners[`confirm${commentIndex}`] = () =>
			confirmEditComment(commentIndex, commentId, commentUserInfo!.token);
	});
};

function insertCommentTextarea(index: string, commentId: string) {
	if (index.length < 1 || commentId.length < 1) return;

	document
		.getElementById(`button-edit-${index}`)
		?.removeEventListener('click', buttonListeners[`edit${index}`]);
	document
		.getElementById(`button-delete-${index}`)
		?.removeEventListener('click', buttonListeners[`delete${index}`]);

	const commentTextbox = document.getElementById(`comment-textbox-${index}`);
	const savedComment = commentTextbox?.dataset.savedcomment || '';
	commentTextbox!.className = 'commentcard-textbox edit';

	const textareaInsert = commentEditArea(index, commentId);
	const parsedInsert = new DOMParser().parseFromString(textareaInsert, 'text/html').body;
	commentTextbox!.innerHTML = parsedInsert.innerHTML;
	const insertedTextarea = document.getElementById(
		`comment-textarea-${index}`
	) as HTMLTextAreaElement;
	insertedTextarea.value = savedComment;

	document
		.getElementById(`comment-cancel-${index}`)
		?.addEventListener('click', buttonListeners[`cancel${index}`]);
	document
		.getElementById(`comment-confirm-${index}`)
		?.addEventListener('click', buttonListeners[`confirm${index}`]);
}

function cancelEditComment(index: string, commentId: string) {
	if (index.length < 1 || commentId.length < 1) return;

	document
		.getElementById(`comment-cancel-${index}`)
		?.removeEventListener('click', buttonListeners[`cancel${index}`]);
	document
		.getElementById(`comment-confirm-${index}`)
		?.removeEventListener('click', buttonListeners[`confirm${index}`]);

	const commentTextbox = document.getElementById(`comment-textbox-${index}`);
	const savedComment = commentTextbox?.dataset.savedcomment || '';
	commentTextbox!.className = 'commentcard-textbox';

	const commentContentInsert = commentContent(index, commentId, savedComment);
	const parsedInsert = new DOMParser().parseFromString(commentContentInsert, 'text/html').body;
	commentTextbox!.innerHTML = parsedInsert.innerHTML;

	document
		.getElementById(`button-edit-${index}`)
		?.addEventListener('click', buttonListeners[`edit${index}`]);
	document
		.getElementById(`button-delete-${index}`)
		?.addEventListener('click', buttonListeners[`delete${index}`]);
}

async function confirmEditComment(index: string, commentId: string, token: string) {
	if (!commentId || commentId.length < 1) return;

	const insertedTextarea = document.getElementById(
		`comment-textarea-${index}`
	) as HTMLTextAreaElement;
	const message = insertedTextarea.value;
	try {
		const headers = { Authorization: `Bearer ${token}` };
		await axios.patch(
			`${import.meta.env.PUBLIC_APISITE}/comments/${commentId}`,
			{ comment: message, updatedAt: Date.now() },
			{ headers }
		);

		const commentTextbox = document.getElementById(`comment-textbox-${index}`);
		commentTextbox!.dataset.savedcomment = message;
		buttonListeners[`cancel${index}`]();
	} catch (err) {
		console.log(err);
		alert('Failed to edit your comment. Please try again later.');
	}
}

async function deleteComment(commentId: string, token: string) {
	if (!commentId || commentId.length < 1) return;
	const result = confirm('Are you sure you want to delete?');

	if (result) {
		try {
			const headers = { Authorization: `Bearer ${token}` };
			await axios.delete(`${import.meta.env.PUBLIC_APISITE}/comments/${commentId}`, {
				headers,
			});
			await reloadCommentSection('persist');
		} catch (err) {
			console.log(err);
			alert('Failed to delete your comment. Please try again later.');
		}
	}
}

function addCommentButtonListeners() {
	// registerButtonBoxes();
	// this function is applied only after registerButtonListeners is called 
	//So, the commentButtonBoxes are already updated
	commentButtonBoxes.forEach((buttonBox) => {
		const commentIndex = buttonBox.dataset.commentindex || '';

		buttonBox.children[0].addEventListener('click', buttonListeners[`edit${commentIndex}`]);
		buttonBox.children[1].addEventListener('click', buttonListeners[`delete${commentIndex}`]);
	});
}

function removeCommentButtonListeners() {
	registerButtonBoxes();
	commentButtonBoxes.forEach((buttonBox) => {
		const commentIndex = buttonBox.dataset.commentindex || '';

		if (document.getElementById(`comment-cancel-${commentIndex}`)) {
			buttonBox.children[0].removeEventListener(
				'click',
				buttonListeners[`cancel${commentIndex}`]
			);
			buttonBox.children[1].removeEventListener(
				'click',
				buttonListeners[`confirm${commentIndex}`]
			);
		} else {
			buttonBox.children[0].removeEventListener(
				'click',
				buttonListeners[`edit${commentIndex}`]
			);
			buttonBox.children[1].removeEventListener(
				'click',
				buttonListeners[`delete${commentIndex}`]
			);
		}
	});
}

registerButtonListeners();
addCommentButtonListeners();
