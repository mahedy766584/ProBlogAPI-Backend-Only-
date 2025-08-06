// categorySchema.pre('save', async function (next) {

//     if (!this.isModified("name")) return next();

//     const baseSlag = slugify(this.name, {
//         lower: true,
//         replacement: '_',
//         remove: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g,
//         strict: true,
//         trim: true,
//     });

//     let slug = baseSlag;
//     let count = 1;

//     while (await Category.exists({ slug })) {
//         slug = `${baseSlag}-${count}`;
//         count++;
//     }

//     this.slug = slug;
//     next();

// });