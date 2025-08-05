// import slugify from "slugify";
// import { Category } from "./category.model";

// export const generateUniqueSlug = async (name: string) => {
//     const baseSlug = slugify(name, {
//         lower: true,
//         replacement: '_',
//         remove: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g,
//         strict: true,
//         trim: true,
//     });
//     let slugs = baseSlug;
//     let count = 1;

//     while (await Category.findOne({ slugs })) {
//         slugs = `${baseSlug}-${count}`;
//         count++;
//     };

//     return slugs;
// };