import logger from '../utils/logger.js';

export const errorMiddleware = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        status: err.status || 500,
    });

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
};
