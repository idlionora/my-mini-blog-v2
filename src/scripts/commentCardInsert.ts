export function commentTextarea(index: string, commentId: string) {
	return `<textarea id="comment-textarea-${index}"  name="comment-textarea-${index}" rows="4" autofocus placeholder="What's on your mind?" maxlength="1000" class="commentcard-textarea"></textarea><div id="comment-buttonbox-${index}" class="commentcard-button-box" data-commentId="${commentId}" data-commentIndex="${index}"><button id="comment-cancel-${index}" class="button-comment button-comment-yellow">Cancel</button><button id="comment-confirm-${index}" class="button-comment button-comment-green ">Confirm</button></div>`;
};
