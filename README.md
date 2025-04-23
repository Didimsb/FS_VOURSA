# Voursa - Plateforme Immobilière

Voursa est une plateforme de gestion immobilière complète construite avec la stack MERN (MongoDB, Express, React, Node.js).

## Structure du projet

- `/server` - Backend API (Node.js/Express)
- `/voursa` - Frontend (React)

## Installation

### Configuration requise
- Node.js (v14+)
- MongoDB (ou connexion à MongoDB Atlas)

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd voursa
npm install
npm start
```

## Déploiement
Le projet est configuré pour être facilement déployé sur:
- Backend: Render.com
- Frontend: Vercel

## Fonctionnalités
- Gestion des propriétés immobilières
- Système d'authentification multi-rôles (admin, vendeur)
- Upload d'images via Cloudinary
- Interface administrateur et vendeur
