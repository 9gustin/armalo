import { z } from "zod"

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const MIN_PASSWORD_LENGTH = 4
export const password = z
  .string()
  .min(MIN_PASSWORD_LENGTH)
  .max(100)
  .transform((str) => str.trim())

export const Signup = z.object({
  name: z.string().min(2).max(100),
  email,
  password,
})

export const Login = z.object({
  email,
  password: z.string(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
