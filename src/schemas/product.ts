
import joi from 'joi';

export const productSchema = joi.object({
    name: joi.string().required(),
    price: joi.number().required().min(0),
    description: joi.string(),
    categoryId: joi.string().required(),
    createdAt: joi.date().default(() => new Date()),
    updatedAt: joi.date().default(() => new Date()),
    deletedAt: joi.date().default(null),
    deleted: joi.boolean().default(false),
});

// export const categoryProductSchema = joi.object().shape({
//     name: joi.string().trim().required(),
//     description: joi.string().required(),
//     products: joi.array().of(
//         joi
//             .string()
//             // regular expression để validate ObjectId.
//             //
//             .matches(/^[0-9a-fA-F]{24}$/)
//             .required()
//     ),
// });
