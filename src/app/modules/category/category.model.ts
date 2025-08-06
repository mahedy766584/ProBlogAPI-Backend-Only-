import mongoose, { model, Schema } from "mongoose";
import { TCategory } from "./category.interface";
import { generateUniqSlug } from "../../utils/globalPreHooks";


const categorySchema = new Schema<TCategory>({
    name: {
        type: String,
        required: true,
        unique: true,
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

categorySchema.pre('save', async function (next) {
    if (!this.isModified("name")) return next();
    this.slug = await generateUniqSlug(mongoose.model('Category'), this.name);
    next();
});


export const Category = model<TCategory>(
    'Category', categorySchema
);