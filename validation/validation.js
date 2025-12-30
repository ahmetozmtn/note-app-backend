import { z } from 'zod';

// --- Auth Schemas ---

export const registerSchema = z
    .object({
        name: z.string().trim().min(3, {
            message: 'Name is required and must be at least 3 characters long',
        }),
        email: z.string().trim().email({ message: 'Invalid email address' }),
        password: z
            .string()
            .trim()
            .min(8, { message: 'Password must be at least 8 characters long' }),
    })
    .strict();

export const loginSchema = z
    .object({
        email: z.string().trim().email({ message: 'Invalid email address' }),
        password: z
            .string()
            .trim()
            .min(8, { message: 'Password must be at least 8 characters long' }),
    })
    .strict();

// --- User Schemas ---
export const updateUserSchema = z
    .object({
        name: z.string().trim().min(3, {
            message: 'Name is required and must be at least 3 characters long',
        }),
        email: z.string().trim().email({ message: 'Invalid email address' }),
    })
    .strict();

export const paramsIdSchema = z
    .object({
        id: z
            .string()
            .trim()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'),
    })
    .strict();

// --- Note Schemas ---

export const createNoteSchema = z
    .object({
        title: z.string().trim().min(3, {
            message: 'Title is required and must be at least 3 characters long',
        }),
        content: z.string().trim().min(10, {
            message:
                'Content is required and must be at least 10 characters long',
        }),
        tags: z.array(z.string()).optional(),
        color: z.string().default('#000000').optional(),
    })
    .strict();

export const updateNoteSchema = z.object({
    title: z.string().trim().min(3, {
        message: 'Title is required and must be at least 3 characters long',
    }),
    content: z.string().trim().optional(),
    tags: z.array(z.string()).optional(),
    color: z.string().default('#000000').optional(),
});

export const getNoteByIdSchema = z
    .object({
        id: z
            .string()
            .trim()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'),
    })
    .strict();

export const deleteNoteSchema = z
    .object({
        id: z
            .string()
            .trim()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'),
    })
    .strict();
