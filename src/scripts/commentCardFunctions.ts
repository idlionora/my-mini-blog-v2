import CommentSection from './commentSectionClass';
import { commentTextarea } from '@scripts/commentCardInsert';

function cancelEditComment(index: string, commentId: string) {
	console.log('cancel button is clicked!!');
}

function confirmEditComment(index: string, commentId: string) {
	console.log('confirm button is clicked!!');
}

function deleteComment(index: string, commentId: string) {
	console.log('delete button is clicked!!');
}

function insertCommentTextarea(index: string, commentId: string) {
	if (index.length === 0 || commentId.length === 0) return;
	document
		.getElementById(`button-edit-${index}`)
		?.removeEventListener('click', () => insertCommentTextarea(index, commentId));
	document
		.getElementById(`button-delete-${index}`)
		?.removeEventListener('click', () => deleteComment(index, commentId));

	const commentTextbox = document.getElementById(`comment-textbox-${index}`);
	const savedComment = commentTextbox?.dataset.savedcomment || '';
	commentTextbox!.className = 'commentcard-textbox edit';

	const textareaInsert = commentTextarea(index, commentId);
	const parsedInsert = new DOMParser().parseFromString(textareaInsert, 'text/html').body;
	commentTextbox!.innerHTML = parsedInsert.innerHTML;
	const insertedTextarea = document.getElementById(
		`comment-textarea-${index}`
	) as HTMLTextAreaElement;
	insertedTextarea.value = savedComment;

	document
		.getElementById(`comment-cancel-${index}`)
		?.addEventListener('click', () => cancelEditComment(index, commentId));
	document
		.getElementById(`comment-confirm-${index}`)
		?.addEventListener('click', () => confirmEditComment(index, commentId));
}

function addCommentButtonListeners() {
	const commentButtonBoxes = Array.from(
		document.getElementsByClassName('commentcard-button-box')
	) as HTMLElement[];

	commentButtonBoxes.forEach((buttonBox) => {
		const commentIndex = buttonBox.dataset.commentindex || '';
		const commentId = buttonBox.dataset.commentid || '';

		buttonBox.children[0].addEventListener('click', () =>
			insertCommentTextarea(commentIndex, commentId)
		);
		buttonBox.children[1].addEventListener('click', () =>
			deleteComment(commentIndex, commentId)
		);
	});
	console.log('addCommentButtonListeners runs!!');
}

function removeCommentButtonListeners() {
	const commentButtonBoxes = Array.from(
		document.getElementsByClassName('commentcard-button-box')
	) as HTMLElement[];

	commentButtonBoxes.forEach((buttonBox) => {
		const commentIndex = buttonBox.dataset.commentindex || '';
		const commentId = buttonBox.dataset.commentid || '';

		if (document.getElementById(`comment-cancel-${commentIndex}`)) {
			buttonBox.children[0].className = 'button-comment button-comment-red';
			buttonBox.children[0].removeEventListener('click', () =>
				cancelEditComment(commentIndex, commentId)
			);
			buttonBox.children[1].removeEventListener('click', () =>
				confirmEditComment(commentIndex, commentId)
			);
		} else {
			buttonBox.children[0].className = 'button-comment button-comment-red';
			buttonBox.children[0].removeEventListener('click', () =>
				insertCommentTextarea(commentIndex, commentId)
			);
			buttonBox.children[1].removeEventListener('click', () =>
				deleteComment(commentIndex, commentId)
			);
		}
	});
	document
		.getElementById('comment-current-username')
		?.removeEventListener('click', () => console.log('hello'));
	console.log('removeCommentButtonListeners runs!!');
}

function addPageNumListeners(commentClass: CommentSection) {
	// document
	// 	.getElementById('pagination-first')
	// 	?.addEventListener('click', commentClass.switchToFirstTab);
	// document
	// 	.getElementById('pagination-last')
	// 	?.addEventListener('click', commentClass.switchToLastTab);
}

function removePageNumListeners(commentClass: CommentSection) {
	// document
	// 	.getElementById('pagination-first')
	// 	?.removeEventListener('click', commentClass.switchToFirstTab);
	// document
	// 	.getElementById('pagination-last')
	// 	?.removeEventListener('click', commentClass.switchToLastTab);
}

export function switchToTabNum(commentClass: CommentSection, newTabNum: number) {
	removePageNumListeners(commentClass);
	commentClass.loadTabNum(newTabNum);
	addPageNumListeners(commentClass);

	//add eventListener for edit and delete button
}

export async function commentSectionInit(
	commentClass: CommentSection,
	tabJump: 'first' | 'last' = 'first'
) {
	await commentClass.buildPagination(tabJump);
	// commentClass.paginationContainer.children[0].addEventListener(
	// 	'click', paginationFunc.switchToPrevTab
	// );
	// commentClass.paginationContainer.children[2].addEventListener(
	// 	'click', paginationFunc.switchToNextTab
	// );
	addPageNumListeners(commentClass);
	// addCommentButtonListeners();
}
