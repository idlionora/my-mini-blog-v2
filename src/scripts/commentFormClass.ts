class CommentForm {
	blogId: string;
	userImg: HTMLElement;
	userName: HTMLElement;
	textArea: HTMLTextAreaElement;
	commentCount: HTMLElement;
	commentButton: HTMLElement;

	constructor(
		blogId: string,
		userImg: HTMLElement,
		userName: HTMLElement,
		textArea: HTMLTextAreaElement,
		commentCount: HTMLElement,
		commentButton: HTMLElement
	) {
		this.blogId = blogId;
		this.userImg = userImg;
		this.userName = userName;
		this.textArea = textArea;
		this.commentCount = commentCount;
		this.commentButton = commentButton;
	}

	countCharacters(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		if(target) {
			this.commentCount.innerText = (1000 - target.value.length).toString();
		}
	}
}

export default CommentForm;
