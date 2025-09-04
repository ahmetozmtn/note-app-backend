const validationMiddleware = schema => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default validationMiddleware;
