# Crypto Analytics Dashboard

**Лабораторна робота / Практичний проєкт**  
Повнфункціональна аналітична панель для криптовалюти з портфелем, реальними даними та візуалізаціями.

![Crypto Dashboard](https://github.com/qweVitaliy/Crypto-analytics-dashboard/blob/main/frontend/src/assets/hero.png)

## 🚀 Про проєкт

Це сучасний веб-додаток для відстеження криптовалютного портфеля та аналізу ринку. Проєкт складається з двох частин:

- **Backend** — Node.js + Express + PostgreSQL
- **Frontend** — React + Vite + Tailwind CSS + Recharts

### Основні можливості

- **Портфель користувача** — додавання/видалення активів
- **Реальні ринкові дані** — інтеграція з CoinGecko API
- **Інтерактивні графіки** — ціни, свічки, індикатори
- **Аналітика** — сумарна вартість, розподіл, динаміка
- **Кешування** — для швидкості та зменшення навантаження на API
- **Docker** — легке розгортання через `docker-compose`

## 🛠 Технологічний стек

**Backend:**
- Node.js + Express
- PostgreSQL
- dotenv, cors, nodemon
- Кешування запитів до CoinGecko

**Frontend:**
- React 19 + Vite
- Tailwind CSS
- Recharts / Lightweight Charts
- Axios
- Lucide React (іконки)

**DevOps:**
- Docker + Docker Compose
- Git

## 📋 Як запустити проєкт

```bash
# 1. Клонувати репозиторій
git clone https://github.com/qweVitaliy/Crypto-analytics-dashboard.git
cd Crypto-analytics-dashboard

# 2. Запустити всі сервіси
docker-compose up -d 

npm run dev - (На /frontend і /backend)
