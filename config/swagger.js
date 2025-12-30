import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Note App API',
            version: '1.0.0',
            description: 'Not uygulaması için RESTful API servisi',
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: { type: 'string', example: 'example' },
                        email: {
                            type: 'string',
                            example: 'example@example.com',
                        },
                        isVerified: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Note: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        title: { type: 'string', example: 'Note Title' },
                        content: { type: 'string', example: 'Note Content...' },
                        userId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['personel', 'work'],
                        },
                        color: { type: 'string', example: '#FF5733' },
                        isFavorites: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 3,
                            example: 'example',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'example@example.com',
                        },
                        password: {
                            type: 'string',
                            minLength: 8,
                            example: '12345678',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'example@example.com',
                        },
                        password: {
                            type: 'string',
                            minLength: 8,
                            example: '12345678',
                        },
                    },
                },
                CreateNoteRequest: {
                    type: 'object',
                    required: ['title', 'content'],
                    properties: {
                        title: {
                            type: 'string',
                            minLength: 3,
                            example: 'Note Title',
                        },
                        content: {
                            type: 'string',
                            minLength: 10,
                            example: 'Note Content...',
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['personal'],
                        },
                        color: { type: 'string', example: '#FF5733' },
                    },
                },
                UpdateNoteRequest: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: {
                            type: 'string',
                            minLength: 3,
                            example: 'New Title',
                        },
                        content: {
                            type: 'string',
                            example: 'New Note Content...',
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['updated'],
                        },
                        color: { type: 'string', example: '#3498DB' },
                    },
                },
                UpdateUserRequest: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 3,
                            example: 'New Name',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'new@example.com',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Error message' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
