import z from "zod/v3";

const loginValidationSchema = z.object({
    body: z.object({
        userName: z.string({ required_error: 'User name is required' }),
        password: z.string({ required_error: 'Password is required' }),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old password is required' }),
        newPassword: z.string({ required_error: 'Password is required' }),
    })
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required',
        })
    })
});



export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
};