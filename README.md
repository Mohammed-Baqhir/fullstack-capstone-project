# GiftLink Full-Stack Capstone Project

GiftLink connects users who want to give away household items with users looking for free reusable items.

## Services
- `giftlink-backend` - Node.js/Express API with MongoDB and JWT auth
- `giftlink-frontend` - React frontend
- `sentiment` - Express sentiment analysis service using natural
- `.github/workflows/main.yml` - GitHub Actions CI workflow
- `k8s` - sample Kubernetes manifests

## Local Run

### Backend
```bash
cd giftlink-backend
cp .env.example .env
npm install
npm start
```

### Frontend
```bash
cd giftlink-frontend
cp .env.example .env
npm install
npm start
```

### Sentiment
```bash
cd sentiment
npm install
npm start
```
