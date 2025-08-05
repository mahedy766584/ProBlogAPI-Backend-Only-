import mongoose, { model, Schema } from "mongoose";
import { TCategory } from "./category.interface";
import slugify from "slugify";

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

categorySchema.pre('save', async function () {

    if (!this.isModified("name")) return;

    const baseSlug = slugify(this.name, {
        lower: true,
        replacement: '_',
        remove: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g,
        strict: true,
        trim: true,
    });
    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Category.findOne({ slug })) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    this.slug = slug;

});

export const Category = model<TCategory>(
    'Category', categorySchema
);