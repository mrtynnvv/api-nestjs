<h1 align="center">api-nestjs</h1>
<p align="center">
  <i>Frontend репозиторий: <a href="https://github.com/mrtynnvv/Calorielly">github.com/calorielly</a> </i>
</p>

## 💡 Архитектура и стек

- NestJS 11 (модульная архитектура: `AuthModule`, `UsersModule`, `PrismaModule`), глобальная конфигурация через `@nestjs/config`
- ORM и данные: Prisma 6 + SQLite; файл БД вынесен в `external-db/app.sqlite` (удобно для бэкапов/разделения окружений), миграции в `prisma/migrations`, включены `PRAGMA journal_mode=WAL` и `foreign_keys`
- Аутентификация и безопасность: JWT (`@nestjs/jwt` + `passport-jwt`), хеширование паролей через Argon2id (`argon2`), нормализация телефона, обработка ошибок через стандартные `HttpException`
- Валидация ввода: DTO на `class-validator`/`class-transformer` + глобальный `ValidationPipe` (`whitelist`, `transform`)
- API эндпоинты: `POST /auth/register`, `POST /auth/login`; защищённые `GET|PATCH /users/me/calorie-limit` (JWT Guard)
<<<<<<< HEAD
- Конфигурация и окружения: переменные `.env` (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES`); генерация `.env` из `.env.example` (`npm run genEnv:dev` — `~/external-db/app.sqlite`, `npm run genEnv:prod` — `../external-db/app.sqlite` относительно папки проекта)
- Процессы и деплой: PM2 (`ecosystem.config.js`), разделение .env для dev/prod, zero‑downtime рестарты; `start:prod` на `dist/main.js`
=======
- Конфигурация и окружения: переменные `.env` (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES`), генерация `.env` из `.env.example` (`npm run genEnv`)
- Процессы и деплой: PM2 (`ecosystem.config.js`), разделение env для dev/prod, zero‑downtime рестарты; `start:prod` на `dist/main.js`
>>>>>>> parent of 9bdeb1f (genEnv upd)

## 📝 Licence

Copyright © 2025 [Dima Martynov](https://github.com/mrtynnvv).<br />
Этот проект находится под лицензией [MIT](https://github.com/mrtynnvv/Calorielly/blob/main/LICENSE).<br />
