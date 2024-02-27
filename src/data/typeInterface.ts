export interface BlogFrontmatter {
    id: string;
    title: string;
    summary: string;
    slug: string;
    blogpostImg: string;
    blogthumbImg: string;
    bannerImg: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    user: {_id: string, name: string, photo: string};
    commentCount: number;
}


// const {id: blogId, title, summary, slug, blogpostImg, blogthumbImg, bannerImg, content, tags, createdAt, updatedAt, user, commentCount} = Astro.props;
// const {_id: userId, name: userName} = user;
