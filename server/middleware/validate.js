import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((issue) => ({
        field: issue.path.join('.').replace(/^(body|query|params)\./, ''),
        message: issue.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Invalid request payload',
    });
  }
};

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().trim().email('Please provide a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const createQuestSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required').max(120, 'Title cannot exceed 120 characters'),
    description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional().default(''),
    category: z.enum(['intellect', 'vitality', 'discipline', 'creativity'], {
      errorMap: () => ({ message: 'Category must be intellect, vitality, discipline, or creativity' }),
    }),
    isRecurring: z.boolean().optional().default(false),
    dueDate: z.string().optional().nullable(),
  }),
});

export const updateQuestSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title cannot be empty').max(120).optional(),
    description: z.string().trim().max(500).optional(),
    category: z.enum(['intellect', 'vitality', 'discipline', 'creativity']).optional(),
    isRecurring: z.boolean().optional(),
    dueDate: z.string().optional().nullable(),
  }),
});
