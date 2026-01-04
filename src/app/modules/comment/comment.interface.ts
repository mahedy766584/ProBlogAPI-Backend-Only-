import { Types } from "mongoose";

export type TComment = {
    blogPost: Types.ObjectId;
    user: Types.ObjectId;
    contentType: 'markdown' | 'html';
    renderedHtml: string;
    content: string;
    parent?: Types.ObjectId;
    isFlagged: boolean;
};