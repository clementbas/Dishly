# Dishly

Application web fullstack de partage et découverte de recettes de cuisine.

## Stack

- **Frontend** : React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend** : Node.js + Express
- **Base de données** : MongoDB + Mongoose
- **Auth** : JWT (access token 15min + refresh token 7j)
- **i18n** : Français / Anglais (react-i18next)

## Fonctionnalités

- Inscription / Connexion avec JWT et refresh token automatique
- Créer, modifier, supprimer des recettes
- Upload d'image pour les recettes et l'avatar
- Système de favoris
- Recherche et filtres avancés (catégorie, difficulté, temps de préparation, tri)
- Pagination
- Thème clair / sombre persisté
- Interface responsive (mobile-friendly)
- Toasts de feedback utilisateur
- Animations de page et de composants

## Structure

```
Dishly/
├── frontend/        # React app (Vite)
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── context/     # AuthContext, ThemeContext
│   │   ├── hooks/       # Hooks personnalisés
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Appels API (axios)
│   │   └── i18n/        # Traductions FR / EN
└── backend/         # Express API
    └── src/
        ├── controllers/  # Logique métier
        ├── middleware/   # auth, validate, upload, errorHandler
        ├── models/       # Mongoose (User, Recipe, Category)
        ├── routes/       # Routes Express
        └── validators/   # Schémas Joi
```

## Installation

### Prérequis

- Node.js 18+
- Un cluster MongoDB (local ou Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # puis remplir les variables
npm run dev
```

Variables d'environnement (`backend/.env`) :

```
PORT=8000
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Variables d'environnement (`frontend/.env`) :

```
VITE_API_URL=http://localhost:8000/api
```

## API — Principales routes

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Non | Inscription |
| POST | `/api/auth/login` | Non | Connexion |
| POST | `/api/auth/refresh` | Non | Rafraîchir le token |
| POST | `/api/auth/logout` | Oui | Déconnexion |
| GET | `/api/recipes` | Non | Liste des recettes (filtres + pagination) |
| POST | `/api/recipes` | Oui | Créer une recette |
| PUT | `/api/recipes/:id` | Oui | Modifier une recette |
| DELETE | `/api/recipes/:id` | Oui | Supprimer une recette |
| GET | `/api/categories` | Non | Liste des catégories |
| GET | `/api/users/me/favorites` | Oui | Favoris de l'utilisateur |
| POST | `/api/users/me/favorites/:id` | Oui | Ajouter aux favoris |
