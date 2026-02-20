# Nikaled.biz

Конверсионный сайт по ТЗ:
- Главная как продающий лендинг.
- 4 SEO-лендинга услуг.
- Портфолио, контакты, о компании.
- Лид-формы + модалка-калькулятор.
- Интеграция лидов в Telegram или SMTP через `LEAD_PROVIDER`.

## Запуск

```bash
npm install
npm run dev
```

Скопируйте `.env.example` в `.env.local` и заполните переменные.

## One-command deploy on VPS

```bash
cd /var/www/nikaled
chmod +x deploy.sh
./deploy.sh
```

Опционально через переменные:

```bash
APP_DIR=/var/www/nikaled BRANCH=main PM2_APP=nikaled ./deploy.sh
```

Если нужно принудительно переустановить зависимости:

```bash
FORCE_INSTALL=1 ./deploy.sh
```
