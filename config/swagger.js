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
                        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        name: { type: 'string', example: 'Ahmet' },
                        email: { type: 'string', example: 'ahmet@example.com' },
                        isVerified: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Note: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        title: { type: 'string', example: 'Not Başlığı' },
                        content: { type: 'string', example: 'Not içeriği...' },
                        userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        tags: { type: 'array', items: { type: 'string' }, example: ['kisisel', 'is'] },
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
                        name: { type: 'string', minLength: 3, example: 'Ahmet' },
                        email: { type: 'string', format: 'email', example: 'ahmet@example.com' },
                        password: { type: 'string', minLength: 8, example: '12345678' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'ahmet@example.com' },
                        password: { type: 'string', minLength: 8, example: '12345678' },
                    },
                },
                CreateNoteRequest: {
                    type: 'object',
                    required: ['title', 'content'],
                    properties: {
                        title: { type: 'string', minLength: 3, example: 'Not Başlığı' },
                        content: { type: 'string', minLength: 10, example: 'Not içeriği burada yer alacak...' },
                        tags: { type: 'array', items: { type: 'string' }, example: ['kisisel'] },
                        color: { type: 'string', example: '#FF5733' },
                    },
                },
                UpdateNoteRequest: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: { type: 'string', minLength: 3, example: 'Güncel Başlık' },
                        content: { type: 'string', example: 'Güncel içerik...' },
                        tags: { type: 'array', items: { type: 'string' }, example: ['guncellenmis'] },
                        color: { type: 'string', example: '#3498DB' },
                    },
                },
                UpdateUserRequest: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        name: { type: 'string', minLength: 3, example: 'Yeni Ad' },
                        email: { type: 'string', format: 'email', example: 'yeni@example.com' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Hata mesajı' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

