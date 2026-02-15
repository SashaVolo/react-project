
export interface IUser {
    id: number;
    firstName: string;
    secondName: string;
    avatar: string;
}

export interface ITag {
    id: number;
    name: string;
}


export interface IPrismaTag {
    postId: number;
    tagId: number;
    tag: ITag;
}

export interface IPost {
    id: number;
    name: string;
    description: string;
    pic: string;
    likeCount: number;

    isLiked: boolean;


    user: {
        id: number;
        firstName: string;
        secondName: string;
        avatar: string;
    };


    tags: IPrismaTag[];
}


export const MOCK_TAGS: ITag[] = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Design" },
    { id: 3, name: "Coding" },
    { id: 4, name: "Lifestyle" },
    { id: 5, name: "Space" },
];
