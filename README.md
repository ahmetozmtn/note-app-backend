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

Tüm endpoint'ler `/api` prefix'i ile başlar. Korumalı endpoint'ler `Authorization: Bearer <token>` header'ı gerektirir.

### Auth

| Method | Endpoint                                | Açıklama                      | Auth  |
| ------ | --------------------------------------- | ----------------------------- | ----- |
| POST   | `/api/auth/register`                    | Yeni kullanıcı kaydı          | Hayır |
| POST   | `/api/auth/login`                       | Kullanıcı girişi              | Hayır |
| POST   | `/api/auth/refresh`                     | Access token yenileme         | Hayır |
| POST   | `/api/auth/logout`                      | Çıkış yap                     | Hayır |
| POST   | `/api/auth/logout-all`                  | Tüm cihazlardan çıkış         | Evet  |
| GET    | `/api/auth/verify`                      | Email doğrulama               | Hayır |
| POST   | `/api/auth/reset-password-email`        | Şifre sıfırlama emaili gönder | Hayır |
| POST   | `/api/auth/reset-password-confirmation` | Şifre sıfırlama onayı         | Hayır |

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "User",
  "email": "example@example.com",
  "password": "12345678"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "example@example.com",
  "password": "12345678"
}
```

### Users

| Method | Endpoint         | Açıklama                       | Auth |
| ------ | ---------------- | ------------------------------ | ---- |
| GET    | `/api/users/:id` | Kullanıcı bilgilerini getir    | Evet |
| PUT    | `/api/users/:id` | Kullanıcı bilgilerini güncelle | Evet |

#### Update User

```
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "email": "new@example.com"
}
```

### Notes

| Method | Endpoint                   | Açıklama               | Auth |
| ------ | -------------------------- | ---------------------- | ---- |
| GET    | `/api/notes`               | Tüm notları listele    | Evet |
| POST   | `/api/notes`               | Yeni not oluştur       | Evet |
| GET    | `/api/notes/:id`           | Tek not getir          | Evet |
| PUT    | `/api/notes/:id`           | Not güncelle           | Evet |
| DELETE | `/api/notes/:id`           | Not sil                | Evet |
| GET    | `/api/notes/search?query=` | Notlarda ara           | Evet |
| GET    | `/api/notes/query?tag=`    | Tag'e göre filtrele    | Evet |
| GET    | `/api/notes/favorites`     | Favori notları listele | Evet |
| POST   | `/api/notes/favorites/:id` | Favorilere ekle        | Evet |
| DELETE | `/api/notes/favorites/:id` | Favorilerden çıkar     | Evet |

#### Create Note

```
POST /api/notes
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
PUT /api/notes/:id
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
│   ├── db.js           # MongoDB bağlantısı
│   └── env.js          # Ortam değişkenleri
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
