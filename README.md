# Note App Backend

Not uygulaması için RESTful API servisi. Kullanıcı kimlik doğrulama, not yönetimi ve favori notlar gibi özellikler sunar.

## Teknolojiler

- **Runtime:** Node.js 22
- **Framework:** Express.js 5
- **Veritabanı:** MongoDB 7 (Mongoose ODM)
- **Kimlik Doğrulama:** JWT (Access Token + Refresh Token)
- **Validasyon:** Zod
- **Email:** Nodemailer
- **Güvenlik:** Helmet, CORS, Rate Limiting, bcrypt
- **Loglama:** Winston
- **Dokumantasyon:** Swagger/OpenAPI
- **Konteyner:** Docker, Docker Compose

## Kurulum

### Gereksinimler

- Node.js 22+
- MongoDB 7+ veya Docker

### Ortam Değişkenleri

Proje kök dizininde `.env` dosyası oluşturun:

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
COOKIE_SAME_SITE=strict

MONGO_URI=mongodb://admin:password123@localhost:27017/noteapp?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=noteapp

JWT_SECRET_KEY=your-jwt-secret-key
JWT_EXPIRES_IN=15m

EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465

EMAIL_TOKEN_SECRET_KEY=your-email-token-secret
EMAIL_TOKEN_EXPIRES_IN=1h

REFRESH_TOKEN_SECRET_KEY=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_COOKIE_MAX_AGE=604800000
```

### Manuel Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda çalıştır
npm run dev

# Production modunda çalıştır
npm start
```

### Docker ile Kurulum

```bash
# Tüm servisleri başlat (API + MongoDB)
docker compose up -d

# Logları görüntüle
docker compose logs -f

# Servisleri durdur
docker compose down

# Veritabanı dahil tüm verileri sil
docker compose down -v
```

## API Endpoints

Tum endpoint'ler `/api/v1` prefix'i ile baslar. Korumali endpoint'ler `Authorization: Bearer <token>` header'i gerektirir.

API dokumantasyonuna erisim: `http://localhost:5000/api-docs`

### Auth

| Method | Endpoint                                   | Aciklama                      | Auth  |
| ------ | ------------------------------------------ | ----------------------------- | ----- |
| POST   | `/api/v1/auth/register`                    | Yeni kullanici kaydi          | Hayir |
| POST   | `/api/v1/auth/login`                       | Kullanici girisi              | Hayir |
| POST   | `/api/v1/auth/refresh`                     | Access token yenileme         | Hayir |
| POST   | `/api/v1/auth/logout`                      | Cikis yap                     | Hayir |
| POST   | `/api/v1/auth/logout-all`                  | Tum cihazlardan cikis         | Evet  |
| GET    | `/api/v1/auth/verify`                      | Email dogrulama               | Hayir |
| POST   | `/api/v1/auth/reset-password-email`        | Sifre sifirlama emaili gonder | Hayir |
| POST   | `/api/v1/auth/reset-password-confirmation` | Sifre sifirlama onayi         | Hayir |

#### Register

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "User",
  "email": "example@example.com",
  "password": "12345678"
}
```

#### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "example@example.com",
  "password": "12345678"
}
```

### Users

| Method | Endpoint            | Aciklama                       | Auth |
| ------ | ------------------- | ------------------------------ | ---- |
| GET    | `/api/v1/users/:id` | Kullanici bilgilerini getir    | Evet |
| PUT    | `/api/v1/users/:id` | Kullanici bilgilerini guncelle | Evet |

#### Update User

```
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "email": "new@example.com"
}
```

### Notes

| Method | Endpoint                      | Aciklama               | Auth |
| ------ | ----------------------------- | ---------------------- | ---- |
| GET    | `/api/v1/notes`               | Tum notlari listele    | Evet |
| POST   | `/api/v1/notes`               | Yeni not olustur       | Evet |
| GET    | `/api/v1/notes/:id`           | Tek not getir          | Evet |
| PUT    | `/api/v1/notes/:id`           | Not guncelle           | Evet |
| DELETE | `/api/v1/notes/:id`           | Not sil                | Evet |
| GET    | `/api/v1/notes/search?query=` | Notlarda ara           | Evet |
| GET    | `/api/v1/notes/query?tag=`    | Tag'e gore filtrele    | Evet |
| GET    | `/api/v1/notes/favorites`     | Favori notlari listele | Evet |
| POST   | `/api/v1/notes/favorites/:id` | Favorilere ekle        | Evet |
| DELETE | `/api/v1/notes/favorites/:id` | Favorilerden cikar     | Evet |

#### Create Note

```
POST /api/v1/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Note Title",
  "content": "Note Content",
  "tags": ["personel", "work"],
  "color": "#FF5733"
}
```

#### Update Note

```
PUT /api/v1/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Title",
  "content": "New Note Content...",
  "tags": ["New Tag"],
  "color": "#3498DB"
}
```

## Proje Yapısı

```
note-app-backend/
├── config/
│   ├── db.js           # MongoDB baglantisi
│   ├── env.js          # Ortam degiskenleri
│   └── swagger.js      # Swagger konfigurasyonu
├── controllers/
│   ├── auth.controller.js
│   ├── note.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── logger.middleware.js
│   ├── noteOwner.middleware.js
│   ├── notFound.middleware.js
│   ├── user.middleware.js
│   └── validation.middleware.js
├── models/
│   ├── note.model.js
│   ├── refreshToken.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── note.routes.js
│   └── user.routes.js
├── templates/
│   ├── password-reset.template.html
│   └── verification.template.html
├── utils/
│   ├── email.service.js
│   ├── logger.js
│   └── token.js
├── validation/
│   └── validation.js
├── app.js
├── server.js
├── Dockerfile
└── docker-compose.yml
```

## Lisans

MIT
