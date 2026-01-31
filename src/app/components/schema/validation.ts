import * as z  from "zod";

export const UsernameValidation = z.string()
.min(6, {message: "Username must be between 6 and 20 characters"})
.max(20, {message: "Username must be no more than 20 characters"})
.regex(/^[a-zA-Z0-9_]+$/, 
    {message: "Username can only contain letters, numbers, and underscores" });

export const UpdateProfileValidation = z.object({
  username: UsernameValidation,
  image:  z.string().url().optional().or(z.literal("")).or(z.null()),
})
export type UpdateProfileForm = z.infer<typeof UpdateProfileValidation>

export const EmailValidation = z.string().email ({ message: "Invalid Email" });

export const PasswordValidation = z.string()
.min (12, {message: "At least 12 characters long"})
.max (24, {message: "Password is too long"})
.regex(/[A-Z]/, {message:  "At least 1 uppercase letter (A-Z)"})
.regex(/[a-z]/, {message: "At least 1 lowercase letter (a-z)"})
.regex(/[0-9]/, {message: "At least 1 number (0-9)"})
.regex(/[~`!@#$%^&*()-_+={}[]|\;:"<>,.]/, 
{message: "At least 1 special character"});


export type UserForm = z.infer<typeof FormSchema>

export const LoginSchema = z.object({
  email: EmailValidation,
  password: z.string().min(1, "Password is required"),
})

export type LoginForm = z.infer<typeof LoginSchema>

export const FormSchema = z
.object({
    username: UsernameValidation,
    email: EmailValidation,
    password: PasswordValidation,
    confirmPassword: z.string(),
})
// รหัสผ่านต้องตรงกัน
.superRefine((data,ctx) =>{
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      message: "Passwords do not match",
      code: z.ZodIssueCode.custom,
    });
  }
})
export const Passwordschema = z
.object({
    confirmNewPassword: z.string().min(1, {message: "New password is required"}),
    newPassword: PasswordValidation,
    // รหัสปัจจุบัน
    currentPassword: z.string().min(1, {message: "Current password is required"}),  
})
.superRefine((data, ctx) => {
// รหัสผ่านใหม่กับconfirmรหัสผ่านต้องตรงกัน
    if (data.newPassword !== data.confirmNewPassword) {
    ctx.addIssue({
      path: ["confirmNewPassword"],
      message: "New passwords do not match",
      code: z.ZodIssueCode.custom,
    });
  }
});
