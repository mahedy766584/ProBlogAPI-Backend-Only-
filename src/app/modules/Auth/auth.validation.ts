import z from "zod/v3";

const loginValidationSchema = z.object({
    body: z.object({
        userName: z.string({required_error: 'User name is required'}),
        password: z.string({ required_error: 'Password is required' }),
    }),
});


export const AuthValidation = {
    loginValidationSchema,
};