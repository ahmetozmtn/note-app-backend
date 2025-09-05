import { ZodError } from 'zod';

export const validationMiddleware = schema => (req, res, next) => {
    try {
        const parsed = schema.parse(req.body);
        req.body = parsed; // clean data
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'ValidationError',
                details: error.flatten().fieldErrors,
            });
        }
        next(error); // başka tip hata varsa global handler'a yolla
    }
};
// export default validationMiddleware;
