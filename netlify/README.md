# Netlify Telegram Relay

Этот relay нужен на случай, когда основной VPS не может достучаться до `api.telegram.org`, но сама заявка всё равно должна попасть в Telegram.

## Что разворачивать в Netlify

- репозиторий: текущий проект целиком
- функции: берутся из `netlify/functions`
- build command: можно оставить пустым
- publish directory: не требуется

## Переменные окружения в Netlify

Задайте в панели Netlify:

```text
TELEGRAM_RELAY_TOKEN=<длинный случайный секрет>
TELEGRAM_BOT_TOKEN=<токен бота>
TELEGRAM_CHAT_IDS=5254195940,801480908
```

Если нужен только один чат, можно использовать `TELEGRAM_CHAT_ID`.

## URL функции

После деплоя функция будет доступна по адресу:

```text
https://<your-netlify-site>.netlify.app/.netlify/functions/telegram-relay
```

## Что добавить на основном VPS

В `.env.local` основного сайта нужно задать:

```text
TELEGRAM_RELAY_URL=https://<your-netlify-site>.netlify.app/.netlify/functions/telegram-relay
TELEGRAM_RELAY_TOKEN=<тот же секрет, что и в Netlify>
```

## Как работает цепочка

1. Сайт пытается отправить заявку напрямую в Telegram.
2. Если Telegram с VPS недоступен, уходит запрос в Netlify relay.
3. Если relay тоже не сработал, включается email fallback.
4. Если и email недоступен, заявка сохраняется локально в `var/failed-leads`.

## Что relay умеет

- отправлять текстовые заявки
- пересылать вложения через `sendDocument`
- проверять секретный заголовок `x-telegram-relay-token`

# Netlify OpenAI Relay

Этот relay нужен на случай, когда серверный runtime сайта не может обратиться к OpenAI напрямую, хотя сам AI-помощник должен продолжать работать.

## Переменные окружения в Netlify

Задайте в панели Netlify:

```text
OPENAI_RELAY_TOKEN=<длинный случайный секрет>
OPENAI_API_KEY=<рабочий ключ OpenAI>
OPENAI_MODEL=gpt-4o-mini
```

## URL функции

После деплоя функция будет доступна по адресу:

```text
https://<your-netlify-site>.netlify.app/.netlify/functions/openai-relay
```

## Что добавить на основном VPS

В `.env.local` основного сайта нужно задать:

```text
OPENAI_RELAY_URL=https://<your-netlify-site>.netlify.app/.netlify/functions/openai-relay
OPENAI_RELAY_TOKEN=<тот же секрет, что и в Netlify>
```

`OPENAI_API_KEY` на основном сервере можно оставить, если хотите сначала пробовать прямой вызов, а затем переключаться на relay. Если прямой доступ стабильно недоступен, AI-помощник сможет работать только через relay.

## Как работает цепочка

1. Сайт сначала пытается обратиться к OpenAI напрямую.
2. Если сервер получает `403` с региональным ограничением или типовую сетевую ошибку, запрос уходит в Netlify relay.
3. Relay выполняет вызов к OpenAI из окружения Netlify и возвращает сырой ответ обратно на сайт.
4. Если relay тоже не сработал, AI-помощник показывает fallback-форму заявки.

## Что relay умеет

- принимать готовый `requestBody` для `chat/completions`
- проверять секретный заголовок `x-openai-relay-token`
- форвардить запрос в OpenAI с ключом, который хранится только в Netlify
