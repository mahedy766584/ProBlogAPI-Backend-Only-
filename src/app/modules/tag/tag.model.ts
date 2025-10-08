import { model, Schema } from "mongoose";
import { TTag } from "./tag.interface";
import { generateUniqSlug } from "../../utils/common/globalPreHooks";

const tagSchema = new Schema<TTag>({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
},
    {
        timestamps: true,
    }
);

tagSchema.pre('save', async function (next) {
    if (!this.isModified("name")) return next();
    this.slug = await generateUniqSlug(model('Tag'), this.name);
    next();
});

export const Tag = model<TTag>(
    'Tag',
    tagSchema,
);