export interface CommentCardInput {
    commentId: string;
    commentUserName: string;
    commentUserPhoto: string;
    commentDate: string;
    commentString: string;
    isLoggedIn: boolean;
}

const commentCard = (cardData:CommentCardInput, index:number) => {
    const {commentId, commentUserName, commentUserPhoto, commentDate, commentString, isLoggedIn} = cardData;

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

    return `<div class="commentcard-main"><div class="commentcard-bar"><div class="flex items-center"><div class="userimg-container userimg-md mr-2 ml-0.5"><img src="${import.meta.env.PUBLIC_IMG_HOST}${commentUserPhoto}" alt="${commentUserName.split(' ')[0]}'s photo" class="userimg-photo"></div><div class="commentcard-bar-text"><p>${commentUserName}</p><p class="card-text-sm">${dateDisplay}</p></div></div></div><div class="commentcard-textbox" id="comment-textbox-${index}" data-savedcomment="${isLoggedIn ? parsedContent : ''}"><div id="comment-content-${index}" class="commentcard-content"> ${parsedContent}</div>${isLoggedIn ?`<div id="button-comment-container-${index}" class="commentcard-button-box" data-commentid="${commentId}" data-commentindex="${index}"><button id="button-edit-${index}" class="button-comment button-comment-green">Edit</button><button id="button-delete-${index}" class="button-comment button-comment-red">Delete</button></div>`:""}</div></div>`;
}

export default commentCard;
