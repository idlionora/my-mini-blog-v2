import axios, { AxiosError } from "axios";

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

class CommentSection {
    protected blogId: string;
    protected commentContainer: HTMLElement;
    protected paginationContainer: HTMLElement;

    fetchedComments: CommentData[] = [];
    commentNumPerTab: number = 5
    commentTabNum: number = 1;
    currentTab: number = 1;

    constructor(blogId: string, commentContainer: HTMLElement, paginationContainer: HTMLElement) {
        this.blogId = blogId;
        this.commentContainer = commentContainer;
        this.paginationContainer = paginationContainer;
    }

    displayPageNums () {
        console.log(this.commentTabNum);
        console.log(this.commentNumPerTab);
        console.log(this.currentTab)
        const pagesArr:string[] = []
        const firstTab = '<button id="pagination-first" class="button-pagination">1</button>'
        const currentTab = `<button class="button-pagination-selected">${this.currentTab}</button>`
        const lastTab = `<button id="pagination-last" class="button-pagination">${this.commentTabNum}</button>`;
        const dotsTab = '<div class="button-pagination-dots">...</div>'

        if (this.currentTab !== 1) pagesArr.push(firstTab);
        if (this.currentTab > 2) pagesArr.push(dotsTab);
        pagesArr.push(currentTab);
        if (this.commentTabNum - 1 > this.currentTab) pagesArr.push(dotsTab);
        if (this.commentTabNum > this.currentTab) pagesArr.push(lastTab);
        console.log(this.pagesArr)

        const parsedTabs = new DOMParser().parseFromString(pagesArr.join(''), 'text/html').body;
        this.paginationContainer.innerHTML = parsedTabs.innerHTML; 
        console.log(this.paginationContainer.innerHTML)        
    }

    async fetchComments() {
        try {
            const res = await axios.get(`${import.meta.env.PUBLIC_APISITE}/blogposts/${this.blogId}/comments`);
            const fetchedComments = res.data.data;
            this.fetchedComments = fetchedComments
            this.currentTab = 3;
            this.commentTabNum = Math.ceil(fetchedComments.length/ this.commentNumPerTab);

            this.displayPageNums()
        } catch(error) {
            const err = error as AxiosError;
            console.log(err.message);
        }
    }


    buildPagination () {
        
    }

    switchTabNum() {}

}

export default CommentSection;
