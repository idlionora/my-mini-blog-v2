interface CommentCardInput {
    commentId: string;
    commentUserName: string;
    commentUserPhoto: string;
    commentDate: string;
    commentString: string;
    isLoggedIn: boolean;
}

const commentCard = ({commentId, commentUserName, commentUserPhoto, commentDate, commentString, isLoggedIn}: CommentCardInput) => {

    const commentDateOptions: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		timeZone: 'Asia/Jakarta',
		timeZoneName: 'short',
	};
    const dateObj = new Date(commentDate);
    const dateDisplay = new Intl.DateTimeFormat('en-US', commentDateOptions).format(dateObj);

    const parsedContent = new DOMParser().parseFromString(commentString, 'text/html').body.innerText;

    return `<div class="commentcard-main"><div class="commentcard-bar"><div class="flex items-center"><div class="userimg-container userimg-md mr-2 ml-0.5"><img src="${import.meta.env.PUBLIC_IMG_HOST}${commentUserPhoto}" alt="${commentUserName.split(' ')[0]}'s photo" class="userimg-photo"></div><div class="commentcard-bar-text"><p>${commentUserName}</p><p class="card-text-sm">${dateDisplay}</p></div></div></div><div class="commentcard-textbox"><div id="comment-content" class="commentcard-content"> ${parsedContent}</div>${isLoggedIn ? `<div class="commentcard-button-box"><button id="button-edit-${commentId}" class="button-comment button-comment-green">Edit</button><button id="button-delete-${commentId}" class="button-comment button-comment-red">Delete</button></div>` : ''}</div></div>`;
}

export default commentCard;