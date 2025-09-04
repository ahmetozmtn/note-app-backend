import { z } from 'zod';

// --- Auth Schemas ---

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: 'Name is required and must be at least 3 characters long',
        }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' }),
});

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' }),
});

// --- Note Schemas ---

export const createNoteSchema = z.object({
    title: z
        .string()
        .min(3, {
            message: 'Title is required and must be at least 3 characters long',
        }),
    content: z
        .string()
        .min(10, {
            message:
                'Content is required and must be at least 10 characters long',
        }),
    tags: z.array(z.string()).optional(),
    color: z.string().default('#000000').optional(),
});

export const updateNoteSchema = z.object({
    title: z
        .string()
        .min(3, {
            message: 'Title is required and must be at least 3 characters long',
        }),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
    color: z.string().default('#000000').optional(),
});
