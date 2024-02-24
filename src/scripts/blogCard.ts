interface BlogCardData {
    id: string;
    blogpostImg: string;
    title: string;
    user: {_id: string, name: string};
    createdAt: string;
    summary: string;
    tags: string[];
    commentCount: number;
    slug: string;
}

interface CardResponse {
    cardData: BlogCardData;
    index: number;
}

const blogCard = ({cardData, index} : CardResponse) => {
    const {blogpostImg, title, user, createdAt, summary, tags, commentCount, slug} = cardData;
    const {_id: userId, name: userName} = user;
    const blogDate = new Date(createdAt);

    const tagsString = tags.map((tag:string) => {return `<a href="/tags/${tag}" class="card-mr-2 card-link">#${tag}</a>`})

    return `<div id="card-${index}" class="card-main"><div class="card-container ${blogpostImg === '/my-mini-blog/blogpost_img/default.jpg' ? 'card-pic-border' : ''}"><img src="${import.meta.env.PUBLIC_IMG_HOST}${blogpostImg}" alt="blog image ${index}" class="card-pic" /></div><div class="card-text-container"><h3><a href="/blogs/${slug}" class="card-link card-link-title">${title}</a></h3><p class="card-text-sm card-mt-05"> ${blogDate.toLocaleDateString('id')} – <a href="/users/${userId}" class="card-link">${userName}</a></p><div class="card-summary">${summary}</div><div class="card-mt-4 card-text-sm">${tagsString}</div><p class="card-text-sm">${commentCount > 1 ? 'comments' : 'comment'}: ${commentCount}</p><a href="/blogs/${slug}" class="card-readpost card-mt-4">Read Post<img src="/icons/move-right.svg" alt="" class="card-arrow"></a></div></div>`;
}

export default blogCard;
